import { supabase, companyOs } from "@/kernel/data/supabase";
import { envAllowlist } from "@/kernel/identity/admin-auth";
import { byFirstName, personName } from "@/kernel/config/people-name";
import { recordAudit } from "@/kernel/audit/audit";
import { insertAdmins } from "@/kernel/identity/writes";
import { getSiteOrigin } from "@/kernel/config/site-origin";

export type GrantResult = { ok: true; message?: string } | { ok: false; error: string };

// Data layer for Settings → Admins. Emails are stored lowercase (unique on
// lower(email)); every write path must normalize before hitting the table.

export type AdminSource = "db" | "env" | "both";

export type AdminListRow = {
  id: string | null; // null = env-only entry (not editable from the UI)
  email: string;
  displayName: string | null;
  personId: string | null; // linked employee (company_os.people); null for env/owner rows
  canViewSensitive: boolean; // true = Super Admin (wages + PII)
  createdAt: string | null;
  createdBy: string | null;
  source: AdminSource;
  hasLogin: boolean;
  lastSignInAt: string | null;
};

export type AuthUserInfo = {
  userId: string;
  emailConfirmedAt: string | null;
  lastSignInAt: string | null;
};

// Auth users keyed by lowercase email, via a first-page listUsers scan — the
// same convention as portal provisioning (talent/team actions). Small org, so
// one page is sufficient; revisit if the auth user count ever grows large.
async function authUsersByEmail(): Promise<Map<string, AuthUserInfo>> {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error || !data?.users) {
    if (error) console.error("listUsers failed:", error.message);
    return new Map();
  }
  const map = new Map<string, AuthUserInfo>();
  for (const u of data.users) {
    const email = (u.email ?? "").trim().toLowerCase();
    if (!email || map.has(email)) continue;
    map.set(email, {
      userId: u.id,
      emailConfirmedAt: u.email_confirmed_at ?? null,
      lastSignInAt: u.last_sign_in_at ?? null,
    });
  }
  return map;
}

export async function findAuthUser(email: string): Promise<AuthUserInfo | null> {
  return (await authUsersByEmail()).get(email.trim().toLowerCase()) ?? null;
}

type AdminDbRow = {
  id: string;
  email: string;
  display_name: string | null;
  person_id: string | null;
  can_view_sensitive: boolean;
  created_at: string;
  created_by: string | null;
};

// DB rows plus env-only entries, each enriched with login status.
export async function listAdmins(): Promise<{ rows: AdminListRow[]; error: string | null }> {
  const { data, error } = await companyOs
    .from("admins")
    .select("id, email, display_name, person_id, can_view_sensitive, created_at, created_by")
    .order("created_at", { ascending: true });
  if (error) return { rows: [], error: error.message };

  const dbRows = (data ?? []) as AdminDbRow[];
  const dbEmails = new Set(dbRows.map((r) => r.email.toLowerCase()));
  const envEmails = envAllowlist();
  const authUsers = await authUsersByEmail();

  const withLogin = (r: Omit<AdminListRow, "hasLogin" | "lastSignInAt">): AdminListRow => {
    const auth = authUsers.get(r.email.toLowerCase());
    return { ...r, hasLogin: Boolean(auth), lastSignInAt: auth?.lastSignInAt ?? null };
  };

  const rows: AdminListRow[] = [
    ...dbRows.map((r) =>
      withLogin({
        id: r.id,
        email: r.email,
        displayName: r.display_name,
        personId: r.person_id,
        canViewSensitive: r.can_view_sensitive,
        createdAt: r.created_at,
        createdBy: r.created_by,
        source: envEmails.has(r.email.toLowerCase()) ? "both" : "db",
      }),
    ),
    ...[...envEmails]
      .filter((e) => !dbEmails.has(e))
      .map((e) =>
        withLogin({
          id: null,
          email: e,
          displayName: null,
          personId: null,
          // env-only admins can't be leveled from the UI; the SENSITIVE_VIEWERS
          // env var is their separate break-glass path to sensitive data.
          canViewSensitive: false,
          createdAt: null,
          createdBy: null,
          source: "env",
        }),
      ),
  ];
  return { rows, error: null };
}

// ── Adding an admin: the employee picker ───────────────────────────────────
//
// Admins are granted to employees, not to arbitrary emails. The Add form lists
// people on the payroll (active/on_leave/notice) with a permanent employment
// type — contractors are excluded — minus anyone who is already an admin.
// Mirrors the assignability model in lib/team-auth (status, never persona).

export type AdminEmployeeOption = {
  personId: string;
  name: string;
  email: string;
};

const ADMIN_ELIGIBLE_STATUSES = ["active", "on_leave", "notice"] as const;

type EmployeePersonRow = {
  id: string;
  display_name: string | null;
  preferred_name: string | null;
  full_name: string | null;
  email: string | null;
  archived_at: string | null;
};

export async function listAdminEmployeeOptions(): Promise<AdminEmployeeOption[]> {
  const [{ data: members }, { data: adminRows }] = await Promise.all([
    companyOs
      .from("team_members")
      .select(
        "employment_type, status, person:people!team_members_person_id_fkey(id, display_name, preferred_name, full_name, email, archived_at)",
      )
      .in("status", ADMIN_ELIGIBLE_STATUSES)
      .neq("employment_type", "contract"),
    companyOs.from("admins").select("person_id, email"),
  ]);

  const takenIds = new Set<string>();
  const takenEmails = new Set<string>();
  for (const a of (adminRows ?? []) as { person_id: string | null; email: string }[]) {
    if (a.person_id) takenIds.add(a.person_id);
    if (a.email) takenEmails.add(a.email.toLowerCase());
  }

  const rows = (members ?? []) as unknown as { person: EmployeePersonRow | null }[];
  const seen = new Set<string>();
  const options: AdminEmployeeOption[] = [];
  for (const { person: p } of rows) {
    if (!p || p.archived_at) continue;
    const email = (p.email ?? "").trim().toLowerCase();
    if (!email) continue; // can't grant console access without a login email
    if (seen.has(p.id) || takenIds.has(p.id) || takenEmails.has(email)) continue;
    seen.add(p.id);
    options.push({ personId: p.id, name: personName(p), email });
  }
  return options.sort((a, b) => byFirstName(a.name, b.name));
}

// The one person the Add form is about to grant. Re-fetched server-side (never
// trusted from the client) so email + name are authoritative and eligibility
// is re-checked at write time.
export async function findAdminEmployee(personId: string): Promise<AdminEmployeeOption | null> {
  return (await listAdminEmployeeOptions()).find((o) => o.personId === personId) ?? null;
}

// ── Granting admin access ───────────────────────────────────────────────────
//
// Shared by Settings → Admins ("Add an admin" from the employee list) and the
// Contacts "Add contact → Admin" flow. Both paths must insert the same
// company_os.admins row, audit it, and send the same access email, so the logic
// lives here once rather than in each route's actions.

// Send the right email for the account's state: no login yet → Supabase invite
// (creates the auth user, link lets them set a password); existing login →
// password reset. These are generated server-side, so the link comes back via
// the implicit flow with the session in the URL hash (#access_token=…). Land
// straight on /admin/reset-password (which reads the hash) — NOT
// /api/auth/callback, which only handles the PKCE ?code= flow used by the
// browser-initiated login "forgot password" form.
export async function sendAccessEmail(email: string): Promise<GrantResult> {
  const redirectTo = `${getSiteOrigin()}/admin/reset-password`;
  const existing = await findAuthUser(email);
  if (existing) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return { ok: false, error: `Reset email failed: ${error.message}` };
    return { ok: true, message: `Password reset link sent to ${email}.` };
  }
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (error) return { ok: false, error: `Invite failed: ${error.message}` };
  return { ok: true, message: `Invite sent to ${email}.` };
}

// Insert the admins row, audit it, and send the access email. The caller must
// have ensured the person is eligible (linked people row, unarchived, with an
// email, a team_members row that is active and not a contractor) and is not
// already an admin — this does not re-check eligibility.
export async function grantAdmin(opts: {
  personId: string;
  email: string;
  displayName: string | null;
  canViewSensitive: boolean;
  actorEmail: string;
}): Promise<GrantResult> {
  const { personId, email, displayName, canViewSensitive, actorEmail } = opts;
  const { data: row, error } = await insertAdmins({
    email,
    display_name: displayName,
    person_id: personId,
    can_view_sensitive: canViewSensitive,
    created_by: actorEmail,
  })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await recordAudit({
    table: "admins",
    recordId: row.id,
    operation: "insert",
    actor: actorEmail,
    newData: { email, display_name: displayName, person_id: personId, can_view_sensitive: canViewSensitive },
  });

  const sent = await sendAccessEmail(email);
  if (!sent.ok) {
    // Access is already granted; only the email failed. Surface that precisely.
    return {
      ok: true,
      message: `${email} added, but the email could not be sent (${sent.error}). They can use "Forgot password" on the login page.`,
    };
  }
  return { ok: true, message: `${email} added. ${sent.message}` };
}
