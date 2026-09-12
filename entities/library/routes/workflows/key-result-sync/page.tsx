import type { Metadata } from 'next'
import Link from 'next/link'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const title = 'Key Result Sync | Edge8 Workflows'
const description =
  'A nightly job refreshes the key results whose number the company’s own systems can compute. Today that is one KR, workflows built, counted from the routines on Settings → Agents. Each run writes the current value and appends a log row as the devops agent, so an agent-sourced KR never waits for a human to remember it.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/key-result-sync/' },
  openGraph: { title, description, url: '/workflows/key-result-sync/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'machine', desc: 'Time. 03:45 (+07) every day. The KR is refreshed before anyone opens the goals page.' },
  { name: 'Inputs', assignment: 'machine', desc: 'The list of computed KRs in code (one today), the KR row itself, and the routine catalogue: every cron in the deploy config, the on-demand routines, and the Mac mini jobs.' },
  { name: 'Decision', assignment: 'both', desc: 'The machine decides the number. A human decides the target, the status (on track, at risk, off track, done) and which KRs are worth computing at all.' },
  { name: 'Routing', assignment: 'machine', desc: 'One KR, one row, one write. There is no notification: the value shows up where the KR is read.' },
  { name: 'Output', assignment: 'machine', desc: 'The KR’s current value, its updated-at stamp, and one log row with the value, the week, and a note that breaks the count down by host.' },
  { name: 'Delivery', assignment: 'machine', desc: 'The goals page and the 8 Edges views read the KR row; the log trail sits beside it, attributed to the devops agent rather than a person.' },
  { name: 'Measurement', assignment: 'human', desc: 'The run row on Settings → Agents carries updated and failed counts. Any failed run is the alarm; the routine catalogue is the source, so the number can only be wrong if the catalogue is.' },
]

const EXCEPTIONS = [
  { when: 'KR row deleted or replaced', then: '“key result not found”; the run fails rather than silently doing nothing forever', heard: 'Settings → Agents, as an error run' },
  { when: 'KR read fails', then: 'That KR is recorded as failed; the loop continues to the next computed KR', heard: 'Settings → Agents, as an error run' },
  { when: 'Value write fails', then: 'No log row is appended; the KR keeps its previous value', heard: 'Settings → Agents, as an error run' },
  { when: 'Log insert fails after the value was written', then: 'Value stands, log missing; error prefixed “log:” so the two cases read differently', heard: 'Settings → Agents, as an error run' },
  { when: 'Run triggered twice in a day', then: 'Same value written again and a second log row for the same week; there is no per-run key', heard: 'The KR’s log' },
  { when: 'A cron is added to the deploy config without metadata', then: 'Still counted; the catalogue lists every scheduled path, named or not', heard: 'Settings → Agents shows the unnamed entry' },
  { when: 'Target reached or passed', then: 'Nothing special; the agent only reports the number', heard: 'The goals page, when a human reads it' },
  { when: 'Status needs changing', then: 'Never touched by the agent; only a human check-in sets status', heard: 'The goals page' },
]

export default function KeyResultSyncWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Operations"
        title="Key Result Sync"
        tldr="Some key results are opinions that need a weekly human check-in. Some are just counts the company already produces. This job takes the second kind off the calendar: every night it computes the number from the system that owns it, writes it onto the KR, and leaves a log row signed by the agent. Humans keep the target and the status; the machine keeps the number honest."
        status="built"
        meta={[
          { label: 'Source', value: 'The routine catalogue on Settings → Agents' },
          { label: 'Cadence', value: 'Daily, 03:45 (+07)' },
          { label: 'Human touchpoints', value: 'Target, status, which KRs to compute' },
        ]}
      />

      {/* Orientation */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The shape, in ten seconds</span>
          <h2 className="section-title section-title--sm">Count in, KR out</h2>
          <p className="section-sub u-mt-3">
            The goals model runs strategy, then company objectives, then key results, then each person&rsquo;s FAST
            goals laddered back to a KR. This job sits at the KR layer only. Four steps: a human names the KR, the
            machine counts, writes and logs, and the goals page reads the result.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'KR Marked as Computed', cadence: 'Once, in code', actor: 'human', actorLabel: 'Founder' },
              { num: '02', title: 'Number Computed', cadence: '03:45 daily', actor: 'system' },
              { num: '03', title: 'Value Written, Log Appended', cadence: 'Same run', actor: 'system' },
              { num: '04', title: 'Read at Check-in', cadence: 'Weekly', actor: 'human', actorLabel: 'Accountable owner' },
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
                title: 'A KR is marked as computed',
                actor: 'human',
                actorLabel: 'Founder',
                body: (
                  <p>
                    A key result joins this job by being added to a short list in the cron&rsquo;s code: the row it
                    keeps, a label, and a function that returns the value and a one-line note. Today the list has one
                    entry, the objective to build 88 workflows into the 8 Edges Open Source System, whose number is the
                    count of managed routines. Adding a second computed KR is a code change, deliberately: the list is
                    the statement of which numbers the company trusts a system to read off.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'The number is computed',
                actor: 'system',
                cadence: '03:45 (+07), every day',
                body: (
                  <p>
                    The job loads the same catalogue Settings → Agents renders: every scheduled path in the deploy
                    config, the on-demand routines the app calls itself, and the jobs on the office Mac mini. The value
                    is the length of that list, and the note breaks it down by host. Nothing is estimated; if a routine
                    is on the page, it counts, and if it is not, it does not.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Value written, log appended',
                actor: 'system',
                cadence: 'Same run',
                body: (
                  <p>
                    For each computed KR the job reads the row first, so a deleted KR fails loudly instead of being
                    skipped forever. It then writes the current value and the updated-at stamp, and appends one log row
                    keyed to the Monday of the current week, with the value, the note, and the author recorded as the
                    devops agent. Status is never touched. The response lists every KR with its new and previous value,
                    and any failure turns the whole run red on Settings → Agents.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'Read at the weekly check-in',
                actor: 'human',
                actorLabel: 'Accountable owner',
                body: (
                  <p>
                    KRs without a computed source are checked in by hand on the goals page: the owner enters the
                    current value and picks a status, and the audit log records who did it. A computed KR arrives at
                    that same check-in with its value already current, so the only human decision left is the status.
                    The log trail shows agent rows for computed KRs; that is how a reader tells a number the machine
                    read off from one a person typed in.
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
            The job is small enough that every failure has one home: the run row on Settings → Agents. The two rows
            at the bottom are not failures; they are the boundary between what the agent does and what a human does.
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
                <li>Reads: the computed-KR list in code, the KR row (id and current value), the routine catalogue</li>
                <li>Writes: the KR&rsquo;s current value and updated-at; one KR log row per KR per run, author kind agent, author the devops agent; one routine run row</li>
                <li>Never writes: status, target, or any KR not on the list</li>
                <li>Week key: the Monday (UTC) of the run&rsquo;s week; nightly runs in the same week append, they do not replace</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>The standing rules</h3>
              <ul>
                <li>The number comes from the system that owns it, never from a spreadsheet</li>
                <li>A KR is computed only when someone adds it to the list in code</li>
                <li>Status stays human: the agent reports, it does not judge</li>
                <li>A missing KR row fails the run; silence is never the outcome</li>
              </ul>
            </div>
          </div>
          <p className="wf-lead u-mt-6">
            This is the quiet cousin of the{' '}
            <Link href="/workflows/daily-check-in-agent" className="u-accent">
              Daily Check-in Agent
            </Link>
            : the same refusal to guess, applied to a single number. The check-in agent reads the cards so nobody
            writes a stand-up; this job reads the catalogue so nobody counts routines by hand.
          </p>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
