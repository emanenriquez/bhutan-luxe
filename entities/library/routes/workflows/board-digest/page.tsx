import type { Metadata } from 'next'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const title = 'Board Digest | Edge8 Workflows'
const description =
  'Every morning at 08:15 one scheduled job reads the open cards on every active board, groups them by assignee, sorts oldest due first with overdue flagged, and emails each active team member their own list. The board is the to-do list; the digest is the reminder.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/board-digest/' },
  openGraph: { title, description, url: '/workflows/board-digest/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'machine', desc: 'Time. 08:15 (+07) every day, weekends included. Nobody asks for their list.' },
  { name: 'Inputs', assignment: 'machine', desc: 'Open, unarchived, top-level cards with an assignee; the board each belongs to; the active team roster.' },
  { name: 'Decision', assignment: 'machine', desc: 'Who gets an email (anyone active with at least one open card on an active board), the order (due date ascending, undated last) and the flag (due date before today).' },
  { name: 'Routing', assignment: 'machine', desc: 'One email per person to the address on their people record. Nothing goes to a channel, nothing goes to a manager.' },
  { name: 'Output', assignment: 'machine', desc: 'A short HTML email: a greeting, the count of open tasks, one line per card linking to its board, and a link to the Workboard.' },
  { name: 'Delivery', assignment: 'machine', desc: 'Transactional email through the mail provider; every accepted send is logged with its kind and card count.' },
  { name: 'Measurement', assignment: 'human', desc: 'Each run leaves a row on Settings → Agents with recipients and emailed. Recipients higher than emailed is the alarm. The count on the email itself is the nudge: a number that never shrinks is the conversation to have.' },
]

const EXCEPTIONS = [
  { when: 'Person has no open cards', then: 'No email at all; silence means a clear board', heard: 'Nowhere, by design' },
  { when: 'Assignee is not an active team member', then: 'Their cards are skipped; no email', heard: 'Nowhere, by design' },
  { when: 'Board is not active, or has been archived', then: 'Its cards are left out of every digest', heard: 'Nowhere, by design' },
  { when: 'Card is a subtask', then: 'Not listed; only top-level cards count', heard: 'Nowhere, by design' },
  { when: 'Card has no due date', then: 'Listed after every dated card as “no due date”; never overdue', heard: 'The email' },
  { when: 'Due date is before today', then: 'Date shown in red with “(overdue)”', heard: 'The email' },
  { when: 'Card is done, or archived', then: 'Excluded; the query only reads open, unarchived cards', heard: 'Nowhere, by design' },
  { when: 'Mail provider key missing', then: 'Nothing is sent; a warning is logged per recipient; the run still reports recipients', heard: 'Settings → Agents: recipients above zero, emailed zero' },
  { when: 'One send is rejected', then: 'That person gets nothing today; the loop continues to the next', heard: 'Settings → Agents: emailed below recipients' },
  { when: 'Card or roster read fails', then: 'Run stops before any email', heard: 'Settings → Agents, as an error run' },
  { when: 'Run triggered twice in a day', then: 'A second email goes out; there is no per-day key', heard: 'The inbox' },
]

export default function BoardDigestWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Operations"
        title="Board Digest"
        tldr="A kanban board is only a to-do list if people open it. This job removes the opening: every morning it reads each person’s open cards straight off the boards, orders them by due date, marks anything late, and puts the list in their inbox with one link back to the board. It never creates, moves or closes a card; it only reads them out."
        status="built"
        meta={[
          { label: 'Source', value: 'Board cards + team roster' },
          { label: 'Cadence', value: 'Daily, 08:15 (+07)' },
          { label: 'Human touchpoints', value: 'The card, the inbox' },
        ]}
      />

      {/* Orientation */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The shape, in ten seconds</span>
          <h2 className="section-title section-title--sm">Cards in, one email each out</h2>
          <p className="section-sub u-mt-3">
            Four steps, two of them human and both of them on the board. The job in the middle is a single read, a
            sort, and a send per person. The step cards below say exactly which cards make the list.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Cards Live on the Board', cadence: 'All day', actor: 'human', actorLabel: 'Team' },
              { num: '02', title: 'Open Cards Read', cadence: '08:15 daily', actor: 'system' },
              { num: '03', title: 'One Email per Person', cadence: 'Same minute', actor: 'system' },
              { num: '04', title: 'Cards Move', cadence: 'When the email is read', actor: 'human', actorLabel: 'Team' },
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
                title: 'Cards live on the board',
                actor: 'human',
                actorLabel: 'Team',
                body: (
                  <p>
                    The only input the digest has is the board as it stands. A card counts when it is assigned, not
                    done, not archived, and a top-level card rather than a subtask, on a board that is active and
                    not archived. A due date is optional; the digest orders by it when present.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Open cards read and grouped',
                actor: 'system',
                cadence: '08:15 (+07), every day',
                body: (
                  <p>
                    One query pulls every qualifying card with its board and its assignee&rsquo;s name and email. A second
                    read checks which assignees are active team members; anyone else is dropped. Cards are grouped by
                    person, sorted by due date ascending with undated cards last, and a card is flagged overdue when
                    its due date is before today&rsquo;s date. Someone with no qualifying cards is never in the map, so
                    they never get an email.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'One email per person',
                actor: 'system',
                cadence: 'Same run',
                body: (
                  <p>
                    Each person gets one transactional email: a greeting by preferred name, the count of open tasks,
                    then one line per card with its title linked to its board, the board name and the due date, red
                    and marked overdue when late, and a link to the Workboard. A send that is accepted is logged with
                    the kind and the card count; a rejected send is logged as an error and the loop moves on, so one
                    bad address never blocks the rest. The run returns recipients and emailed, and those two numbers
                    are what Settings → Agents shows.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'Cards move',
                actor: 'human',
                actorLabel: 'Team',
                body: (
                  <p>
                    The reply to the email is on the board: move the card, set a due date, close it. Tomorrow&rsquo;s
                    digest reads the result. The email carries no buttons and accepts no replies, because the board is
                    the system of record and the digest is only its mirror.
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
            Most rows here are filters rather than failures: the digest is deliberately narrow about which cards it
            reads out. The last four are the ones to watch on Settings → Agents.
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
                <li>Reads: tasks with their board and assignee; team members with status active</li>
                <li>Writes: nothing on the board. One sent-email log row per accepted send, one routine run row per run</li>
                <li>No idempotency key: the digest is a snapshot, and a second run the same day sends a second snapshot</li>
                <li>Today is the run&rsquo;s UTC date; a card due today is not overdue until tomorrow&rsquo;s run</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>The standing rules</h3>
              <ul>
                <li>The board is the to-do list; the email only reads it out</li>
                <li>Only active people, only active boards, only top-level open cards</li>
                <li>Oldest due first, undated last, late in red</li>
                <li>No cards, no email: an empty inbox means a clear board</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
