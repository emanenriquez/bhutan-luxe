import Link from "next/link";
import { companyOs } from "@/kernel/data/supabase";
import { PageHead } from "@/kernel/ui/PageHead";
import { formatCents } from "@/kernel/ui/format";
import { getAdminUser } from "@/kernel/identity/admin-auth";
import { getWorkboard, listBoardManageOptions, moveCardColumn } from "@/entities/boards";
import { Workboard } from "@/entities/boards/ui/Workboard";
import { MS_DAY } from "@/entities/company-os";

export const metadata = {
  title: "Company Dashboard",
  description: "Sales, marketing and the workboard at a glance.",
};

// Page views come from Vercel Web Analytics. Needs a team-scoped Vercel API
// token in VERCEL_API_TOKEN; without it the tile links to the Vercel dashboard.
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_czmNxa5EXlAYJBIaO2puHHfaVlMy";
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID ?? "team_xxuALfrVsyAc6Yyh01pIgTuC";
const VERCEL_ANALYTICS_URL = "https://vercel.com/emanenriquezs-projects/bhutan-luxe/analytics";

async function pageViews(since: string | null): Promise<number | null> {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return null;
  const params = new URLSearchParams({ projectId: VERCEL_PROJECT_ID, teamId: VERCEL_TEAM_ID, filter: "environment eq 'production'" });
  if (since) {
    params.set("since", since);
    params.set("until", new Date().toISOString());
  }
  try {
    const res = await fetch(`https://api.vercel.com/v1/query/web-analytics/visits/count?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { pageviews?: number } };
    return json.data?.pageviews ?? null;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function count(table: string, apply: (q: any) => PromiseLike<{ count: number | null }>): Promise<number> {
  const { count: n } = await apply(companyOs.from(table).select("id", { count: "exact", head: true }));
  return n ?? 0;
}

function Stat({ label, now, all, href, format = (n: number) => String(n) }: {
  label: string;
  now: number | null;
  all: number | null;
  href: string;
  format?: (n: number) => string;
}) {
  const show = (n: number | null) => (n === null ? "—" : format(n));
  return (
    <Link href={href} className="admin-office-stat">
      <div className="admin-office-stat-label">{label}</div>
      <div className="admin-office-stat-val">{show(now)}</div>
      <div className="admin-office-stat-sub">last 30 days · {show(all)} all time</div>
    </Link>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="admin-office-panel">
      <div className="admin-office-head">
        <div className="admin-office-title">
          <span className="admin-office-dot" aria-hidden />
          <span className="admin-office-name">{title}</span>
        </div>
        <Link href={href} className="admin-auth-link">Open →</Link>
      </div>
      <div className="admin-office-stats">{children}</div>
    </section>
  );
}

export default async function CompanyDashboardPage() {
  const since30 = new Date(Date.now() - 30 * MS_DAY).toISOString();

  const [
    inquiries30, inquiriesAll,
    won30, wonAll,
    wonDeals30, wonDealsAll,
    posts30, postsAll,
    broadcasts30, broadcastsAll,
    views30, viewsAll,
    workboard, boardOptions, admin,
  ] = await Promise.all([
    count("inquiries", (q) => q.gte("created_at", since30)),
    count("inquiries", (q) => q),
    companyOs.from("deals").select("amount_usd_cents, amount_cents").eq("status", "won").gte("closed_at", since30),
    companyOs.from("deals").select("amount_usd_cents, amount_cents").eq("status", "won"),
    count("deals", (q) => q.eq("status", "won").gte("closed_at", since30)),
    count("deals", (q) => q.eq("status", "won")),
    count("marketing_content", (q) => q.not("published_at", "is", null).gte("published_at", since30)),
    count("marketing_content", (q) => q.not("published_at", "is", null)),
    count("email_campaigns", (q) => q.eq("status", "sent").gte("sent_at", since30)),
    count("email_campaigns", (q) => q.eq("status", "sent")),
    pageViews(since30),
    pageViews(null),
    getWorkboard({ scope: { kind: "all" } }),
    listBoardManageOptions(),
    getAdminUser(),
  ]);

  const sum = (rows: { amount_usd_cents: number | null; amount_cents: number | null }[] | null) =>
    (rows ?? []).reduce((s, d) => s + (d.amount_usd_cents ?? d.amount_cents ?? 0), 0);
  const revenue30 = sum(won30.data as never);
  const revenueAll = sum(wonAll.data as never);

  let viewerPersonId: string | null = null;
  if (admin?.email) {
    const { data } = await companyOs.from("people").select("id").eq("email", admin.email).maybeSingle();
    viewerPersonId = data?.id ?? null;
  }

  return (
    <>
      <PageHead eyebrow="CRM" title="Company Dashboard" sub="Sales, marketing and the workboard at a glance." />

      <div className="admin-office-grid">
        <Panel title="Sales" href="/admin/revenue">
          <Stat label="Inquiries" now={inquiries30} all={inquiriesAll} href="/admin/revenue/inquiries" />
          <Stat label="Closed deals" now={wonDeals30} all={wonDealsAll} href="/admin/revenue/deals" />
          <Stat label="Revenue" now={revenue30} all={revenueAll} href="/admin/revenue/deals" format={formatCents} />
        </Panel>

        <Panel title="Marketing" href="/admin/revenue/marketing">
          {views30 === null ? (
            <a href={VERCEL_ANALYTICS_URL} target="_blank" rel="noreferrer" className="admin-office-stat">
              <div className="admin-office-stat-label">Page views</div>
              <div className="admin-office-stat-val">—</div>
              <div className="admin-office-stat-sub">open Vercel Analytics</div>
            </a>
          ) : (
            <a href={VERCEL_ANALYTICS_URL} target="_blank" rel="noreferrer" className="admin-office-stat">
              <div className="admin-office-stat-label">Page views</div>
              <div className="admin-office-stat-val">{views30.toLocaleString()}</div>
              <div className="admin-office-stat-sub">last 30 days · {(viewsAll ?? 0).toLocaleString()} all time</div>
            </a>
          )}
          <Stat label="Blog posts" now={posts30} all={postsAll} href="/admin/revenue/marketing/calendar" />
          <Stat label="Email broadcasts" now={broadcasts30} all={broadcastsAll} href="/admin/revenue/marketing/broadcasts" />
        </Panel>
      </div>

      <section className="admin-card admin-section-card u-mt-5">
        <div className="admin-card-head">
          <h2 className="admin-card-title">Workboard</h2>
          <span className="admin-cell-muted u-sm">
            {workboard.cards.length} {workboard.cards.length === 1 ? "card" : "cards"} across {workboard.boards.length}{" "}
            {workboard.boards.length === 1 ? "board" : "boards"}
          </span>
        </div>
        <Workboard
          data={workboard}
          onMove={moveCardColumn}
          viewerPersonId={viewerPersonId}
          teamOptions={boardOptions.team}
          clientOptions={boardOptions.clients}
          programOptions={boardOptions.programs}
        />
      </section>
    </>
  );
}
