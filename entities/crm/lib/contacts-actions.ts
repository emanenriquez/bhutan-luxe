"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/kernel/identity/admin-auth";
import { recordAudit } from "@/kernel/audit/audit";
import { archiveRecord, guardedDelete, restoreRecord, type Result } from "@/entities/crm/lib/mutations";
import { getPerson360, type Person360 } from "@/entities/crm/lib/contacts";
import { insertPeople, insertTeamMembers, updatePeople } from "@/kernel/identity/writes";
import { companyOs } from "@/kernel/data/supabase";
import { grantAdmin } from "@/entities/company-os/lib/admins";

type CreateResult = { ok: true; message?: string } | { ok: false; error: string };

// Lazy loader for the contacts list shelf — related data (companies, deals) is
// fetched on row open, never preloaded per row.
export async function getPersonShelf(id: string): Promise<Person360 | null> {
  await requireAdmin();
  return getPerson360(id);
}

export async function updatePerson(
  id: string,
  patch: {
    full_name?: string;
    phone?: string;
    persona?: string;
    country?: string;
    linkedin_url?: string;
    notes?: string;
    do_not_contact?: boolean;
  },
): Promise<Result> {
  const admin = await requireAdmin();
  const clean: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) {
    clean[k] = typeof v === "string" && v.trim() === "" ? null : v;
  }
  const { error } = await updatePeople(clean).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await recordAudit({ table: "people", recordId: id, operation: "update", actor: admin.email, newData: patch });
  revalidatePath(`/admin/contacts/${id}`);
  revalidatePath("/admin/contacts");
  return { ok: true };
}

// Add a person to the Company Database from the Contacts screen, optionally
// making them an employee and/or an admin in one step. Admin implies employee:
// an admin must be linked to an active, non-contractor team_members row, so
// checking "Admin" creates that record automatically. Marketing/site imports
// still create people rows their own way; this is the manual, admin-driven add.
export async function createContact(input: {
  full_name: string;
  email: string;
  phone?: string;
  makeEmployee?: boolean;
  makeAdmin?: boolean;
  superAdmin?: boolean;
}): Promise<CreateResult> {
  const admin = await requireAdmin();

  const email = input.email.trim().toLowerCase();
  const fullName = input.full_name.trim();
  if (!email) return { ok: false, error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };

  const makeAdmin = !!input.makeAdmin;
  const makeEmployee = !!input.makeEmployee || makeAdmin; // Admin implies employee.

  // One contact per email — the spine is unique on the (citext) email column.
  const { data: existing } = await companyOs.from("people").select("id").eq("email", email).maybeSingle();
  if (existing) {
    return { ok: false, error: "A contact with this email already exists." };
  }

  const { data: person, error: pErr } = await insertPeople({
    email,
    full_name: fullName || null,
    phone: input.phone?.trim() || null,
    persona: makeEmployee ? "employee" : null,
    is_team_member: makeEmployee,
    source: "admin_manual",
  })
    .select("id")
    .single();
  if (pErr || !person) return { ok: false, error: pErr?.message ?? "Could not create the contact." };

  await recordAudit({
    table: "people",
    recordId: person.id,
    operation: "insert",
    actor: admin.email,
    newData: { email, full_name: fullName, is_team_member: makeEmployee, source: "admin_manual" },
  });

  if (makeEmployee) {
    const { data: tm, error: tErr } = await insertTeamMembers({
      person_id: person.id,
      status: "active",
      employment_type: "full_time",
    })
      .select("id")
      .single();
    if (tErr || !tm) {
      return { ok: false, error: `Contact created, but the employee record failed: ${tErr?.message ?? "unknown error"}.` };
    }
    await recordAudit({
      table: "team_members",
      recordId: tm.id,
      operation: "insert",
      actor: admin.email,
      newData: { person_id: person.id, status: "active", employment_type: "full_time" },
    });
  }

  revalidatePath("/admin/contacts");

  if (makeAdmin) {
    const granted = await grantAdmin({
      personId: person.id,
      email,
      displayName: fullName || null,
      canViewSensitive: !!input.superAdmin,
      actorEmail: admin.email,
    });
    revalidatePath("/admin/settings/admins");
    if (!granted.ok) {
      // The contact (and employee record) exist; only the admin grant failed.
      return { ok: false, error: `Contact added, but admin access failed: ${granted.error}` };
    }
    return { ok: true, message: granted.message };
  }

  return { ok: true, message: makeEmployee ? "Contact added as an employee." : "Contact added." };
}

function refresh(id: string) {
  revalidatePath(`/admin/contacts/${id}`);
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/revenue/leads");
}

// Archive: reversible soft-delete. The person leaves the working lists but the
// record and its history stay intact.
export async function archivePerson(id: string): Promise<Result> {
  const admin = await requireAdmin();
  const r = await archiveRecord("people", id, admin.email);
  if (r.ok) refresh(id);
  return r;
}

export async function restorePerson(id: string): Promise<Result> {
  const admin = await requireAdmin();
  const r = await restoreRecord("people", id, admin.email);
  if (r.ok) refresh(id);
  return r;
}

// Permanent erasure (GDPR right to be forgotten). Guarded by the schema's
// foreign keys: a person with orders/bookings/deals cannot be erased until those
// are cleared, and the attempt returns a clear message instead of a DB error.
export async function deletePerson(id: string): Promise<Result> {
  const admin = await requireAdmin();
  const r = await guardedDelete("people", id, admin.email, { via: "contact_360" });
  if (r.ok) {
    revalidatePath("/admin/contacts");
    revalidatePath("/admin/revenue/leads");
  }
  return r;
}
