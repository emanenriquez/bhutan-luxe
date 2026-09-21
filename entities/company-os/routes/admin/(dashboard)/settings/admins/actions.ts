"use server";

import { revalidatePath } from "next/cache";
import { companyOs } from "@/kernel/data/supabase";
import { requireAdmin } from "@/kernel/identity/admin-auth";
import { recordAudit } from "@/kernel/audit/audit";
import { findAdminEmployee, grantAdmin, sendAccessEmail } from "@/entities/company-os/lib/admins";
import { deleteAdmins, updateAdmins } from "@/kernel/identity/writes";

type Result = { ok: true; message?: string } | { ok: false; error: string };

function refresh() {
  revalidatePath("/admin/settings/admins");
}

// Admins are granted to employees, never free-typed emails. The client sends
// the chosen person's id and the level; email + name are re-resolved from the
// people record server-side, and eligibility (on payroll, not a contractor,
// not already an admin) is re-checked here — findAdminEmployee returns null
// otherwise. The insert + invite is the shared grantAdmin helper.
export async function addAdmin(personId: string, canViewSensitive: boolean): Promise<Result> {
  const admin = await requireAdmin();

  const employee = await findAdminEmployee(personId);
  if (!employee) {
    return { ok: false, error: "Pick an active employee from the list (contractors and current admins are excluded)." };
  }

  const res = await grantAdmin({
    personId,
    email: employee.email, // already normalized lowercase
    displayName: employee.name,
    canViewSensitive,
    actorEmail: admin.email,
  });
  refresh();
  return res;
}

// Edits the display name and the level (Super Admin => can_view_sensitive).
// Email is no longer editable here: it's the linked employee's login address,
// kept in sync with the people record rather than typed by hand.
export async function updateAdmin(
  id: string,
  fields: { displayName: string; canViewSensitive: boolean },
): Promise<Result> {
  const admin = await requireAdmin();

  const { data: row, error: rErr } = await companyOs
    .from("admins")
    .select("id, email, display_name, can_view_sensitive")
    .eq("id", id)
    .maybeSingle();
  if (rErr || !row) return { ok: false, error: rErr?.message ?? "Admin not found." };

  const displayName = fields.displayName.trim() || null;
  const canViewSensitive = fields.canViewSensitive;

  const { error } = await updateAdmins({ display_name: displayName, can_view_sensitive: canViewSensitive })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  await recordAudit({
    table: "admins",
    recordId: id,
    operation: "update",
    actor: admin.email,
    oldData: { display_name: row.display_name, can_view_sensitive: row.can_view_sensitive },
    newData: { display_name: displayName, can_view_sensitive: canViewSensitive },
  });
  refresh();
  return { ok: true, message: "Admin updated." };
}

export async function resendAccessLink(id: string): Promise<Result> {
  await requireAdmin();
  const { data: row, error } = await companyOs
    .from("admins")
    .select("email")
    .eq("id", id)
    .maybeSingle();
  if (error || !row) return { ok: false, error: error?.message ?? "Admin not found." };
  const sent = await sendAccessEmail(row.email);
  refresh();
  return sent;
}

// Revokes /admin access immediately (the gate checks this table per request).
// The Supabase login itself is kept — it may be re-granted or, later, hold a
// /team identity. Removal is what the audit trail records.
export async function deleteAdmin(id: string): Promise<Result> {
  const admin = await requireAdmin();

  const { data: row, error: rErr } = await companyOs
    .from("admins")
    .select("id, email, display_name")
    .eq("id", id)
    .maybeSingle();
  if (rErr || !row) return { ok: false, error: rErr?.message ?? "Admin not found." };
  if (row.email.toLowerCase() === admin.email) {
    return { ok: false, error: "You can't remove yourself — ask another admin." };
  }

  const { error } = await deleteAdmins().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await recordAudit({
    table: "admins",
    recordId: id,
    operation: "delete",
    actor: admin.email,
    oldData: { email: row.email, display_name: row.display_name },
  });
  refresh();
  return { ok: true, message: `${row.email} no longer has admin access.` };
}
