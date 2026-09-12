import type { Metadata } from 'next'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const title = 'Human Token Tracker | Edge8 Workflows'
const description =
  'Four scheduled jobs keep one ledger of human and AI effort per repository: pull requests synced from GitHub, effort logs ingested from each repo, Claude session telemetry recorded as it lands, and AI-written summaries refreshed only when the underlying PRs change. Every step is idempotent, so a re-run never double counts.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/human-token-tracker/' },
  openGraph: { title, description, url: '/workflows/human-token-tracker/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'machine', desc: 'Time. 03:30 (+07) on the office Mac mini, then 09:10, 10:10 and 11:10 (+07) for the three hosted jobs. Nobody fills in a timesheet.' },
  { name: 'Inputs', assignment: 'machine', desc: 'GitHub pull requests for every tracked repo, each repo’s committed effort-log file, Claude session telemetry from the recorder plugin, and the Mac mini’s own local Claude transcripts.' },
  { name: 'Decision', assignment: 'both', desc: 'The machine decides whose work a PR is, which sessions count, and whether a summary needs regenerating. A human decides what the numbers mean, and only a human registers a repo.' },
  { name: 'Routing', assignment: 'machine', desc: 'Every row lands in one schema keyed by repo, person and day. Client-side identities are excluded before anything is written; Edge8 contributors are never counted twice across telemetry and effort logs.' },
  { name: 'Output', assignment: 'machine', desc: 'Pull request rows, token entries (human hours as centihours, Claude tokens), work sessions behind the hours rule, one executive summary and one PR digest per repo, and one FAST goal suggestion per repo.' },
  { name: 'Delivery', assignment: 'machine', desc: 'The ledger and the per-repo pages in the team app. The weekly check-in summary reads the same tables for its Human and AI token report.' },
  { name: 'Measurement', assignment: 'human', desc: 'Each run leaves a row on Settings → Agents with its counts, errors and the model calls it spent. A skipped or error run is the alarm; an unattributed PR count that keeps growing is the second one.' },
]

const EXCEPTIONS = [
  { when: 'GitHub token not configured in the hosted environment', then: 'The hosted job returns without doing anything; the Mac mini job carries the load', heard: 'Settings → Agents, as a skipped run' },
  { when: 'Repo archived, or registered without a GitHub repo', then: 'Left out of every sync, ingest and refresh', heard: 'Nowhere, by design' },
  { when: 'PR author cannot be matched to a person', then: 'PR stored with no person; counted as unattributed', heard: 'The sync run row and the run result' },
  { when: 'One repo’s GitHub fetch fails', then: 'Error recorded against that repo; the other repos still sync', heard: 'The sync run’s error list' },
  { when: 'Repo homepage cannot be read', then: 'Existing live URL kept, never cleared (best-effort)', heard: 'Nowhere, by design' },
  { when: 'Effort-log entry has no session id or no day', then: 'Dropped, because it could not be re-ingested safely', heard: 'The run result, as a skipped count' },
  { when: 'Effort-log entry belongs to an Edge8 contributor', then: 'Filtered out; telemetry already covers them', heard: 'Nowhere, by design' },
  { when: 'Session arrives for a repo nobody registered', then: 'Not stored; there is no auto-enrol', heard: 'The ingest result; the plugin holds the record and re-probes' },
  { when: 'Session author is one of the client’s own identities', then: 'Excluded, never billed', heard: 'The ingest result' },
  { when: 'Repo has no status page', then: 'Executive summary marked as such; no model call, re-checked cheaply next night', heard: 'The run report' },
  { when: 'PR set unchanged since the last digest', then: 'Digest skipped; no model call', heard: 'The run report' },
  { when: 'Model budget spent (40 calls a night)', then: 'The sweep stops and says so; remaining repos wait for tomorrow', heard: 'The run result, budgetExhausted' },
  { when: 'A goal was set by hand', then: 'Never overwritten by the nightly suggestion', heard: 'Nowhere, by design' },
  { when: 'Sync run row cannot be opened', then: 'The sync aborts before touching a PR, rather than run unobserved', heard: 'Settings → Agents, as an error run' },
  { when: 'Local job log contains an error', then: 'Run recorded as error, with the log attached', heard: 'Settings → Agents' },
]

export default function HumanTokenTrackerWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Innovation"
        title="Human Token Tracker"
        tldr="Every project has a cost in human hours and AI tokens, and nobody wants to log either by hand. These jobs read the effort off the systems where it already happens: pull requests on GitHub, session telemetry from the Claude Code recorder, and the effort-log file each repo carries. The ledger is rebuilt from keys, so running a job twice never counts anything twice."
        status="built"
        meta={[
          { label: 'Source', value: 'GitHub PRs, effort logs, session telemetry' },
          { label: 'Cadence', value: '03:30 local, then 09:10, 10:10, 11:10 (+07)' },
          { label: 'Human touchpoints', value: 'Register the repo, read the ledger' },
        ]}
      />

      {/* Orientation */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The shape, in ten seconds</span>
          <h2 className="section-title section-title--sm">Work in, ledger out</h2>
          <p className="section-sub u-mt-3">
            Five steps, one of them human. The team works as normal; four scheduled jobs turn what they did into
            rows, then into summaries. The rail is the orientation; the step cards and the exceptions table are the
            truth.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Work Happens', cadence: 'Every session', actor: 'human', actorLabel: 'Team' },
              { num: '02', title: 'Sessions Recorded', cadence: 'Session end, or 03:30', actor: 'system' },
              { num: '03', title: 'PRs Synced', cadence: '03:30 local, 09:10 hosted', actor: 'system' },
              { num: '04', title: 'Effort Logs Ingested', cadence: '10:10 hosted', actor: 'system' },
              { num: '05', title: 'Summaries Refreshed', cadence: '11:10 hosted', actor: 'ai', actorLabel: 'Claude' },
            ]}
          />
        </div>
      </section>

      {/* Step detail */}
      <section className="section wf-section--tint">
        <div className="container">
          <span className="section-label wf-section--white">Step by step</span>
          <h2 className="section-title section-title--sm">How each step works</h2>
          <StepCards
            steps={[
              {
                num: '01',
                title: 'Work happens, and only registration is manual',
                actor: 'human',
                actorLabel: 'Team',
                body: (
                  <p>
                    A repo enters the tracker when someone commits a registration file to the tracker&rsquo;s telemetry
                    branch. The PR sync processes those files first, verifies that the committer is the person named in
                    the request, and creates the repo record. There is no auto-enrol; an already-registered repo is a
                    no-op, so a file that cannot be deleted is retried harmlessly every night. After that, the team
                    just works.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Sessions recorded',
                actor: 'system',
                cadence: 'Session end, or 03:30 (+07)',
                body: (
                  <p>
                    The recorder plugin posts a Claude Code session the moment it ends, and the row is stored before the
                    request returns. The Mac mini job covers the other paths: it pulls recorder telemetry from the
                    tracker branch and backfills the Mac mini&rsquo;s own local transcripts, deduplicating token counts
                    by message id. Both paths apply the same rules: the repo must be registered, the client&rsquo;s own
                    identities are excluded, the Claude token row is keyed by session so a retry is an update, and the
                    hours rule recomputes each day the session touched.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Pull requests synced',
                actor: 'system',
                cadence: '03:30 (+07) local, 09:10 (+07) hosted',
                body: (
                  <p>
                    For every tracked repo with a GitHub repo, the job fetches pull requests updated since that
                    repo&rsquo;s last sync and upserts them by GitHub id. The author is resolved to a person from the
                    author block in the PR body first, then from the GitHub login; an unresolved author is stored
                    unattributed and counted. Session token rows on the same branch are linked to the PR afterwards,
                    and the run writes its own sync row with repos synced, PRs upserted and errors. The hosted job
                    returns as skipped until its GitHub token exists; the launchd job on the office Mac mini runs the
                    same handler in the meantime.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'Effort logs ingested',
                actor: 'system',
                cadence: '10:10 (+07) hosted',
                body: (
                  <p>
                    Each tracked repo may carry a committed effort-log file. Every entry becomes up to two token rows:
                    Claude tokens keyed on the session id, and human hours as centihours keyed on the session id plus a
                    suffix. Only entries by the client&rsquo;s own identities are kept, because Edge8 contributors are
                    already captured by telemetry and would otherwise be counted twice. Persisting is delete-then-insert
                    by session id, so the same file ingested twice yields the same rows.
                  </p>
                ),
              },
              {
                num: '05',
                title: 'Summaries and goals refreshed',
                actor: 'ai',
                actorLabel: 'Claude',
                cadence: '11:10 (+07) hosted, after the PR sync',
                body: (
                  <p>
                    Per repo, three things may be written and each has a rule for when the model is allowed to run. The
                    executive summary is generated once from the repo&rsquo;s status page and after that only when
                    someone explicitly regenerates it. The digest of the latest ten PRs regenerates only when the set of
                    PR numbers and states changed since last night. The FAST goal is suggested when the repo has none
                    yet or its status page changed, and a goal set by hand is never replaced. The whole sweep shares a
                    budget of forty model calls as a circuit breaker; steady-state nights spend a handful.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Exceptions */}
      <section className="section">
        <div className="container">
          <span className="section-label">When it goes sideways</span>
          <h2 className="section-title section-title--sm">Every exception has an owner</h2>
          <p className="section-sub u-mt-3">
            Most of these are quiet on purpose: a ledger that guesses is worse than one with a gap. Each row is a
            condition the code actually handles, what it does, and where a human sees it.
          </p>
          <div className="wf-table-wrap">
            <table className="wf-table">
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>What happens</th>
                  <th>Where you hear about it</th>
                </tr>
              </thead>
              <tbody>
                {EXCEPTIONS.map((r) => (
                  <tr key={r.when}>
                    <td>{r.when}</td>
                    <td>{r.then}</td>
                    <td>{r.heard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Anatomy + contract */}
      <section className="section wf-section--tint">
        <div className="container">
          <SevenElements elements={ELEMENTS} />
          <div className="wf-info-grid">
            <div className="wf-info-card">
              <h3>Reads and writes</h3>
              <ul>
                <li>Reads: tracked repos, client identities, GitHub PRs and repo homepages, each repo&rsquo;s effort-log file and status page, recorder telemetry, local Claude transcripts</li>
                <li>Writes: pull requests, token entries, work sessions and the hours ledger, per-repo summaries, project goals, a sync run row, and a routine run row per job</li>
                <li>Keys: GitHub PR id for PRs; session id for token rows; repo, person and day for the hours ledger; a fingerprint of PR numbers and states for the digest; the status page&rsquo;s blob sha for the executive summary and the goal</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>The standing rules</h3>
              <ul>
                <li>No auto-enrol: a repo is tracked only after an explicit, committer-verified registration</li>
                <li>A client&rsquo;s own identities are captured and excluded, never billed</li>
                <li>Every write is keyed, so any job can be re-run from any machine without double counting</li>
                <li>The model runs only on change, inside a nightly budget; a summary is pinned until a human asks for a new one</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
