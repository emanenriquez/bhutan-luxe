import { requirePortalMember } from "@/kernel/identity/portal-auth";
import {
  getAssignedLeaveDirectory,
  getAssignedLeavePolicies,
  getAssignedTimeOff,
  getLeaveDecisionQueue,
  isClientLeaveApprover,
  type PortalTimeOffEntry,
} from "@/entities/portal/lib/time-off";
import { DecisionQueue } from "./DecisionQueue";
import { PageHead } from "@/kernel/ui/PageHead";
import { Badge, statusTone as memberStatusTone, type BadgeTone } from "@/kernel/ui/Badge";
import { ViewToggle } from "@/kernel/ui/ViewToggle";
import { type CalendarEntry, PolicyCard, TimeOffCalendar } from "@/entities/time-off";
import { formatLeaveBalance, formatNumber, LEAVE_TYPE_LABEL, type LeaveType } from "@/entities/time-off";
import { formatDate, humanize } from "@/kernel/ui/format";

// Client-facing time off: who from the dedicated team is out, when. Read-only
// v1 — see docs/plans/2026-07-11-client-portal-design.md. Every field rendered
// here comes from entities/portal/lib/time-off.ts's hard-restricted column list; there
// is no reason, manager note, balance, or policy data to accidentally leak.
function statusLabel(status: string): { text: string; tone: BadgeTone } {
  switch (status) {
    case "approved":
      return { text: "Approved", tone: "ok" };
    case "taken":
      return { text: "Taken", tone: "ok" };
    case "requested":
      return { text: "Pending", tone: "warn" };
    default:
      return { text: status, tone: "neutral" };
  }
}

function leaveTypeLabel(type: string): string {
  return LEAVE_TYPE_LABEL[type as LeaveType] ?? type;
}

function dateRange(e: PortalTimeOffEntry): string {
  if (e.startDate === e.endDate) return formatDate(e.startDate) + (e.isHalfDay ? " (half day)" : "");
  return `${formatDate(e.startDate)} → ${formatDate(e.endDate)}`;
}

export default async function PortalTimeOffPage() {
  const actor = await requirePortalMember();
  // isApprover is false for everyone not named as client manager on an active
  // placement, which is how the decision section, and the reasons in it, stay
  // invisible to the rest of the client team.
  const [entries, decisionQueue, isApprover, directory, policies] = await Promise.all([
    getAssignedTimeOff(actor),
    getLeaveDecisionQueue(actor),
    isClientLeaveApprover(actor),
    getAssignedLeaveDirectory(actor),
    getAssignedLeavePolicies(actor),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const outNow = entries.filter(
    (e) => e.startDate <= today && e.endDate >= today && (e.status === "approved" || e.status === "taken"),
  );
  const upcoming = entries.filter((e) => e.startDate > today);
  const history = [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate));

  const calendarEntries: CalendarEntry[] = entries.map((e) => ({
    id: e.id,
    name: e.fullName || "Team member",
    leaveType: e.leaveType,
    status: e.status,
    startDate: e.startDate,
    endDate: e.endDate,
    isHalfDay: e.isHalfDay,
  }));

  const muted = <span className="admin-cell-muted">—</span>;

  // Same table the admin History page shows, minus the profile links, scoped
  // to this client's assigned staff. Balances are computed from each member's
  // policy rules; the policy itself follows as the card the employee also sees.
  const balancesView = (
    <>
    <div className="admin-card admin-section-card">
      <h2 className="admin-card-title">Balances</h2>
      {directory.length === 0 ? (
        <div className="admin-empty">No assigned team members.</div>
      ) : (
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
                  <th>Used</th>
                  <th>Accrued</th>
                  <th>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {directory.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className="admin-cell-strong">{r.fullName || "Team member"}</span>
                    </td>
                    <td>{r.approverName || "Edge8"}</td>
                    <td>{r.team || muted}</td>
                    <td>{r.location || muted}</td>
                    <td>{r.leavePolicy || muted}</td>
                    <td>{r.workSchedule || muted}</td>
                    <td>
                      {r.status ? (
                        <Badge tone={memberStatusTone(r.status)}>{humanize(r.status)}</Badge>
                      ) : (
                        muted
                      )}
                    </td>
                    {r.computed ? (
                      <>
                        <td className="admin-cell-mono">{formatNumber(r.computed.usedDays)}</td>
                        <td className="admin-cell-mono">{formatNumber(r.computed.accruedDays)}</td>
                        <td className="admin-cell-mono">
                          <span className={r.computed.remainingDays < 0 ? "u-warn" : undefined}>
                            {formatNumber(r.computed.remainingDays)}
                          </span>
                          {r.computed.pendingDays > 0 && (
                            <span className="admin-cell-muted"> · {formatNumber(r.computed.pendingDays)} pending</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="admin-cell-mono">{formatLeaveBalance(r.usedDays)}</td>
                        <td className="admin-cell-mono">{formatLeaveBalance(r.totalDays)}</td>
                        <td className="admin-cell-mono">
                          {formatLeaveBalance(Number(r.totalDays ?? 0) - Number(r.usedDays ?? 0))}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    {policies.map((p) => (
      <PolicyCard key={p.id} policy={p} />
    ))}
    </>
  );

  const calendarView = (
    <div className="admin-card admin-section-card">
      <h2 className="admin-card-title">Team calendar</h2>
      <TimeOffCalendar entries={calendarEntries} />
    </div>
  );

  const listView = (
    <>
      <div className="admin-card admin-section-card">
        <h2 className="admin-card-title">Out now ({outNow.length})</h2>
        {outNow.length === 0 ? (
          <div className="admin-empty">No one is out right now.</div>
        ) : (
          <div className="admin-list">
            {outNow.map((e) => {
              const s = statusLabel(e.status);
              return (
                <div className="admin-list-row" key={e.id}>
                  <div className="admin-list-main">
                    <div className="admin-list-title">{e.fullName || "Team member"}</div>
                    <div className="admin-list-sub">{leaveTypeLabel(e.leaveType)} · {dateRange(e)}</div>
                  </div>
                  <div className="admin-list-aside">
                    <Badge tone={s.tone}>{s.text}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-card admin-section-card">
        <h2 className="admin-card-title">Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <div className="admin-empty">Nothing scheduled.</div>
        ) : (
          <div className="admin-list">
            {upcoming.map((e) => {
              const s = statusLabel(e.status);
              return (
                <div className="admin-list-row" key={e.id}>
                  <div className="admin-list-main">
                    <div className="admin-list-title">{e.fullName || "Team member"}</div>
                    <div className="admin-list-sub">{leaveTypeLabel(e.leaveType)} · {dateRange(e)}</div>
                  </div>
                  <div className="admin-list-aside">
                    <Badge tone={s.tone}>{s.text}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-card admin-section-card">
        <h2 className="admin-card-title">History ({history.length})</h2>
        {history.length === 0 ? (
          <div className="admin-empty">No time-off history yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((e) => {
                  const s = statusLabel(e.status);
                  return (
                    <tr key={e.id}>
                      <td>{e.fullName || "Team member"}</td>
                      <td>{leaveTypeLabel(e.leaveType)}</td>
                      <td>{dateRange(e)}</td>
                      <td>
                        <Badge tone={s.tone}>{s.text}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <PageHead eyebrow="Client Portal" title="Time Off" sub="Who's out, and when, on your team." />
      {isApprover && <DecisionQueue requests={decisionQueue} />}
      <ViewToggle
        views={[
          { key: "calendar", label: "Calendar", content: calendarView },
          { key: "list", label: "List", content: listView },
          { key: "balances", label: "Policy & balances", content: balancesView },
        ]}
      />
    </>
  );
}
