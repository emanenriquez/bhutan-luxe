import type { Metadata } from 'next'
import Link from 'next/link'
import { WorkflowHero, FlowRail, SevenElements, DetailFooter, type WorkflowElement } from '../ui'
import { WorkflowGraph, GraphLegend } from '../graph'
import { DAILY_AGENT, PERSON_DAY } from './graphs'

const title = 'Daily Check-in Agent | Edge8 Workflows'
const description =
  'Two scheduled routines replace the stand-up. Every weekday a 09:00 reminder tells both team chats it is time to update their cards; at 09:30 the check-in reads each person’s cards on the Workboard, writes a three-line check-in (done yesterday, doing today, blockers) for the Product Team and for EO, and posts it to the right Lark chat. Anyone whose cards have not moved in 24 hours is checked against booked leave and listed as pending; anyone on leave is listed as off.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/daily-check-in-agent/' },
  openGraph: { title, description, url: '/workflows/daily-check-in-agent/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'machine', desc: 'Time. 09:00 (+07) every weekday for the reminder, 09:30 for the check-in, both scheduled on Vercel. Nobody calls a meeting.' },
  { name: 'Inputs', assignment: 'machine', desc: 'The Workboard: each person’s cards, when they last moved, the comments on them and the blockers written on them. Booked leave from the time-off table. The active team directory for the rosters.' },
  { name: 'Decision', assignment: 'both', desc: 'The agent decides whether a person has been active in the 24-hour window and whether silence is booked leave. It never decides what someone did; it reads it off the cards.' },
  { name: 'Routing', assignment: 'machine', desc: 'Two rosters, two chats. Product Development and Operations make the Product Team post; EO makes the EO post. Anyone in neither department gets no check-in rather than the wrong team’s.' },
  { name: 'Output', assignment: 'machine', desc: 'One reminder and one check-in message per team per weekday, and a routine run row per run.' },
  { name: 'Delivery', assignment: 'machine', desc: 'Plain-text Lark messages in each team chat. Pending, off and no-cards people are named at the foot of the post; there are no DMs and no thread replies.' },
  { name: 'Measurement', assignment: 'human', desc: 'A weekday with no post is the alarm. Every post names who is pending and who is off, so the gaps are visible daily, not at the retro. Settings → Agents keeps every run.' },
]

const EXCEPTIONS = [
  { when: 'No card moved or commented in 24 hours', then: 'Booked leave checked; if none, the line is tagged quiet and the person is listed as pending', heard: 'The team post' },
  { when: 'Approved or taken leave covers the run date', then: 'Listed as off with the leave type, never chased', heard: 'The team post' },
  { when: 'No cards assigned at all', then: 'Listed under no cards, no three lines written', heard: 'The team post' },
  { when: 'Card moved by someone other than the assignee', then: 'Counts as activity for the assignee', heard: 'The team post' },
  { when: 'Blocker written on a card', then: 'Surfaces under Blockers until it is resolved', heard: 'Every post until it clears' },
  { when: 'Weekend, by Vietnam time', then: 'No run, no message', heard: 'Run log, marked skipped' },
  { when: 'Team directory or Workboard read fails', then: 'Run aborts before any message', heard: 'Run log, marked failed; the missing post is the tell' },
  { when: 'A team chat webhook is not configured', then: 'That post is skipped with a warning; the other still goes', heard: 'Run log' },
  { when: 'Same day seen again (a retry, or Run now after the cron)', then: 'No-op: one post per day, never a duplicate', heard: 'Run log, marked skipped' },
  { when: 'A missed morning', then: 'A super admin presses Run now on Settings → Agents; the same run posts under the same routine', heard: 'The team post, whenever it is pressed' },
]

export default function DailyCheckInAgentWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Operations"
        title="Daily Check-in Agent"
        status="built"
        tldr="The stand-up is the meeting everyone attends and nobody needs, because the answers already live on the Workboard. This agent reads them off the cards every weekday morning, posts a three-line check-in per team, and names the people whose cards went quiet so a human can follow up."
        meta={[
          { label: 'Source', value: 'Workboard cards + comments' },
          { label: 'Cadence', value: 'Weekdays 09:00 and 09:30 (+07)' },
          { label: 'Human touchpoints', value: 'The card, the Run now button' },
        ]}
      />

      {/* Orientation */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The shape, in ten seconds</span>
          <h2 className="section-title section-title--sm">Cards in, check-ins out</h2>
          <p className="section-sub u-mt-3">
            This rail is the orientation, not the workflow. Real life branches and fails; the diagrams below are the
            truth, drawn branch by branch.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Time to Check In', cadence: '09:00 weekdays', actor: 'system' },
              { num: '02', title: 'Cards Move', cadence: 'Thirty minutes, on the Workboard', actor: 'human', actorLabel: 'Team' },
              { num: '03', title: 'Check-ins Gathered', cadence: '09:30 weekdays', actor: 'system' },
              { num: '04', title: 'Posted to the Chat', cadence: 'Product Team, EO', actor: 'system' },
              { num: '05', title: 'Run Logged', cadence: 'Settings → Agents', actor: 'system' },
            ]}
          />
        </div>
      </section>

      {/* Daily agent, real flow */}
      <section className="section wf-section--tint">
        <div className="container">
          <span className="section-label wf-section--white">The reality &middot; every weekday</span>
          <h2 className="section-title section-title--sm">The morning check-in, every branch</h2>
          <p className="section-sub u-mt-3">
            Five boxes in the rail; three decisions, two aborts and one quiet ending in reality. The 09:00 message is
            the only warning anyone gets; thirty minutes later the agent reads the board as it stands. The check-in
            itself is the easy part: done yesterday is any card that moved into Done in the last 24 hours, doing today
            is every open card, blockers are the unresolved blockers written on the cards. The interesting work is the
            silence: telling booked leave from a forgotten board, and naming only the latter, in the post itself, so the
            team lead sees it without the agent ever DMing anyone.
          </p>
          <WorkflowGraph
            graph={DAILY_AGENT}
            caption="The 09:00 reminder and the 09:30 agent. The first decision is the idempotency check: a weekend or a day that already posted ends the run before it reads anything. The red box on the right is not a DM; it is the pending line at the foot of the team post."
          />
          <GraphLegend
            items={[
              { kind: 'trigger', label: 'schedule fires' },
              { kind: 'decision', label: 'decision' },
              { kind: 'human', label: 'human touchpoint' },
              { kind: 'write', label: 'run log write' },
              { kind: 'flag', label: 'flag a human' },
              { kind: 'terminal', label: 'quiet end' },
            ]}
          />
        </div>
      </section>

      {/* Person-day state machine */}
      <section className="section">
        <div className="container">
          <span className="section-label">The state machine</span>
          <h2 className="section-title section-title--sm">What one person&rsquo;s day looks like to the agent</h2>
          <p className="section-sub u-mt-3">
            Underneath the morning run sits one entity with rules: a person on a given day. Everyone starts stale at
            09:30. A move or a comment on one of their cards in the last 24 hours makes them fresh; leave booked over
            the date makes them off; anything else makes them pending. All three reach the post: fresh people get their
            three lines, off people are listed with their leave type, pending people get their three lines tagged and
            their name at the foot. Only the human move, updating a card, is dashed. The agent never marks anyone fresh
            on its own, and it never looks again until the next morning.
          </p>
          <WorkflowGraph
            graph={PERSON_DAY}
            caption="Green arrows are agent moves; the dashed arrow is the one thing only the person can do. Every state reaches the post; the difference is how the person is named in it."
          />
          <GraphLegend
            items={[
              { kind: 'write', label: 'agent may move' },
              { kind: 'action', label: 'human only (dashed)' },
            ]}
          />
        </div>
      </section>

      {/* Exceptions */}
      <section className="section wf-section--tint">
        <div className="container">
          <span className="section-label wf-section--white">When it goes sideways</span>
          <h2 className="section-title section-title--sm">Every exception has an owner</h2>
          <p className="section-sub u-mt-3">
            An automation is defined by what happens off the happy path. Each row here is a real condition the agent
            hits, what it does about it, and where a human hears about it. Silence is only ever by design.
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

      {/* Contract + timing + instrumentation */}
      <section className="section">
        <div className="container">
          <span className="section-label">The contract</span>
          <h2 className="section-title section-title--sm">Data, timing, and how we know it works</h2>
          <div className="wf-info-grid">
            <div className="wf-info-card">
              <h3>Reads and writes</h3>
              <ul>
                <li>Reads: the active team directory with departments; approved or taken leave over the run date; every Workboard card with its lane, last move, comments and blockers; the day&rsquo;s routine runs</li>
                <li>Writes: one reminder and one check-in per team per weekday, and one routine run row per run, whether it posted, skipped or failed</li>
                <li>Idempotency key: the date. The check-in looks for a successful run that already posted today before it reads anything, so a retry or a Run now after the cron sends nothing</li>
                <li>The reminder has no key: it reads nothing and posts one fixed line, so it cannot fail on data</li>
              </ul>
            </div>
            <div className="wf-info-card">
              <h3>Timing model</h3>
              <ul>
                <li>09:00 (+07) weekdays: the reminder, thirty minutes before the board is read</li>
                <li>09:30 (+07) weekdays: the check-in, after the first coffee, before the first meeting</li>
                <li>The activity window is the 24 hours before the run, so a Monday post reads Sunday morning onward, not the whole weekend</li>
                <li>A line names up to three card titles, then says how many more</li>
                <li>Both run as Vercel crons on UTC schedules; a missed morning is re-run by hand from Settings &rarr; Agents, and the date key makes that safe</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>How we know it works</h3>
              <ul>
                <li>A weekday with no post in either chat is itself the alarm</li>
                <li>Every post lists who is off and who is pending, so a quiet board is visible the same day</li>
                <li>Settings &rarr; Agents shows every run with its result: the rosters posted, the head count per roster, the cards read</li>
                <li>Weekly eyeball: people pending three days running, cards in Doing for over a week. Zero of each is the target</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Anatomy + closing */}
      <section className="section wf-section--tint">
        <div className="container">
          <SevenElements elements={ELEMENTS} />
          <p className="wf-lead u-mt-6">
            This is the same pattern as{' '}
            <Link href="/workflows/lark-scheduler-to-crm-updates" className="u-accent">
              Lark Scheduler to CRM Updates
            </Link>
            : a scheduled agent reading systems that already hold the truth, writing one message a human actually
            reads, and refusing to guess. The cards are the stand-up; the agent only reads them out.
          </p>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
