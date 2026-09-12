import Link from "next/link";
import { companyOs } from "@/kernel/data/supabase";
import { selectTeamDirectory } from "@/entities/org";
import { PageHead } from "@/kernel/ui/PageHead";
import { PeopleRow } from "./PeopleRow";
import { Badge, statusTone } from "@/kernel/ui/Badge";
import { humanize } from "@/kernel/ui/format";
import { formatLeaveBalance, formatNumber, getMemberLeave, hoursToDays } from "@/entities/time-off";
import { firstParam, type SearchParamsObj } from "@/kernel/ui/url";

export const metadata = {
  title: "Time Off — History",
  description: "Team leave policies, work schedules, and balances.",
};

// Operations → Time Off → History. One row per team member with their approver,
// team, location, leave policy, work schedule, and current-period balance. Data
// comes from company_os.team_directory (normalized identity + synced Dayoff
// facts); the balance is computed from the member's leave policy rules when
// the policy has them, else the synced figure. Read-only; clicking the row
// opens the shared Team Member profile.
type DirectoryRow = {
  id: string;
  full_name: string | null;
  email: string;
  status: string | null;
  team: string | null;
  location: string | null;
  leave_policy: string | null;
  work_schedule: string | null;
  manager_name: string | null;
  used_days: number | string | null;
  total_days: number | string | null;
};

const muted = <span className="admin-cell-muted">—</span>;

export default async function TimeOffHistoryPage({ searchParams }: { searchParams: SearchParamsObj }) {
  const view = firstParam(searchParams.view) === "deactivated" ? "deactivated" : "activated";

  const base = selectTeamDirectory(
      "id, full_name, email, status, team, location, leave_policy, work_schedule, manager_name, used_days, total_days",
    )
    .order("full_name", { ascending: true });
  const { data, error } =
    view === "activated" ? await base.eq("status", "active") : await base.neq("status", "active");

  const rows = (data ?? []) as unknown as DirectoryRow[];
  const leaveById = await getMemberLeave(rows.map((r) => r.id));

  return (
    <>
      <PageHead
        eyebrow="Operations · Time Off"
        title="History"
        sub="Leave policies, work schedules, and balances across the team."
      />

      <div className="admin-tabs" role="tablist">
        <Link
          href="/admin/operations/time-off/history"
          role="tab"
          aria-selected={view === "activated"}
          className={`admin-tab${view === "activated" ? " is-active" : ""} u-link-plain`}
        >
          Activated
        </Link>
        <Link
          href="/admin/operations/time-off/history?view=deactivated"
          role="tab"
          aria-selected={view === "deactivated"}
          className={`admin-tab${view === "deactivated" ? " is-active" : ""} u-link-plain`}
        >
          Deactivated
        </Link>
      </div>

      {error && (
        <div className="admin-alert admin-alert--err u-mb-4">
          {error.message}
        </div>
      )}

      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Approver</th>
                <th>Team</th>
                <th>Location</th>
                <th>Leave policy</th>
                <th>Work schedule</th>
                <th>Status</th>
                <th>Used / accrued (days)</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="admin-cell-muted">
                    No {view === "deactivated" ? "deactivated" : "active"} team members.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const leave = leaveById.get(r.id) ?? null;
                  const b = leave?.balance ?? null;
                  const hpd = leave?.policy?.accrual.hoursPerDay ?? 8;
                  return (
                  <PeopleRow key={r.id} href={`/admin/talent/team/${r.id}`}>
                    <td>
                      <span className="admin-cell-strong">{r.full_name || r.email}</span>
                    </td>
                    <td>{r.manager_name || muted}</td>
                    <td>{r.team || muted}</td>
                    <td>{r.location || muted}</td>
                    <td>{leave?.policy?.name ?? r.leave_policy ?? muted}</td>
                    <td>{r.work_schedule || muted}</td>
                    <td>
                      {r.status ? (
                        <Badge tone={statusTone(r.status)}>{humanize(r.status)}</Badge>
                      ) : (
                        muted
                      )}
                    </td>
                    {b ? (
                      <>
                        <td className="admin-cell-mono">
                          {formatNumber(hoursToDays(b.usedHours, hpd))} / {formatNumber(hoursToDays(b.accruedHours + b.anchorHours + b.adjustedHours, hpd))}
                        </td>
                        <td className="admin-cell-mono">
                          <span className={b.remainingHours < 0 ? "u-warn" : undefined}>
                            {formatNumber(hoursToDays(b.remainingHours, hpd))} d
                          </span>
                          <span className="admin-cell-muted"> · {formatNumber(b.remainingHours)} h</span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="admin-cell-mono">
                          {formatLeaveBalance(r.used_days)} / {formatLeaveBalance(r.total_days)}
                        </td>
                        <td className="admin-cell-mono">{muted}</td>
                      </>
                    )}
                  </PeopleRow>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
