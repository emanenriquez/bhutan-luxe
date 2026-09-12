// The Admin surface's composition root. Unlike every other file under app/ this
// is not a mount: the shell is the kernel's (ADR 0002) and the navigation is
// generated from this deployment's entity list, so app/ is the only place both
// can be named. It guards the surface, then hands the shell what it needs.
import type { Metadata } from "next";
import { requireAdmin, isSuperAdmin } from "@/kernel/identity/admin-auth";
import { hasTeamAccess } from "@/kernel/identity/team-auth";
import { AdminShell } from "@/kernel/shell/AdminShell";
import { avatarUrlForAuthUser } from "@/entities/retreats";
import { signOut } from "@/entities/company-os";
import { AdminChatWidget } from "@/entities/assistant/client";
import { isPrivilegedChatUser } from "@/entities/assistant";
import { ADMIN_NAV } from "@/app/nav";
import "@/app/admin/admin.css";
import "@/app/styles/utilities.css";

export const metadata: Metadata = {
  title: { template: "%s · 8 Edges", default: "8 Edges" },
  description: "Bhutan Luxe CRM — contacts, inquiries, deals and affiliates.",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const [canSwitchToTeam, avatarUrl, superAdmin] = await Promise.all([
    hasTeamAccess(user.id),
    avatarUrlForAuthUser(user.id),
    isSuperAdmin(user.email),
  ]);

  return (
    <AdminShell
      sections={ADMIN_NAV}
      signOut={signOut}
      user={user}
      avatarUrl={avatarUrl}
      canSwitchToTeam={canSwitchToTeam}
      isSuperAdmin={superAdmin}
      assistant={<AdminChatWidget canWrite={isPrivilegedChatUser(user.email)} />}
    >
      {children}
    </AdminShell>
  );
}
