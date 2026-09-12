import type { Metadata } from 'next'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const title = 'Email Broadcasts | Edge8 Workflows'
const description =
  'An approved broadcast sends itself: every 15 minutes a routine claims the next batch, re-checks each person against the live CRM, and makes one Resend call per recipient. Three days after the last batch, a daily routine posts the settled numbers to the Marketing chat with a one-line Claude takeaway, once per broadcast.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/email-broadcasts/' },
  openGraph: { title, description, url: '/workflows/email-broadcasts/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'both', desc: 'A human approves and starts the broadcast. From then on it is time: a tick every 15 minutes for the batches, a daily run at 10:20 (+07) for the summary.' },
  { name: 'Inputs', assignment: 'machine', desc: 'The broadcast row (subject, body, featured posts, batch size, optional schedule), its recipient list, the live CRM record of each person, and the bounce and complaint history from Resend.' },
  { name: 'Decision', assignment: 'both', desc: 'Humans decide the content, the segment, and when to go. The sender decides, per recipient and at the moment of send, whether that person may still be mailed. It never decides who to add.' },
  { name: 'Routing', assignment: 'machine', desc: 'One campaign at a time, oldest due first. One batch per tick. The summary goes to the Marketing Lark channel; the results page holds the detail.' },
  { name: 'Output', assignment: 'machine', desc: 'One email per eligible recipient, a status on every recipient row (sent, skipped with a reason, failed with the error), and one Lark recap per broadcast.' },
  { name: 'Delivery', assignment: 'machine', desc: 'Resend carries the mail with one-click unsubscribe headers. Delivery, open, click and bounce events flow back by webhook and are linked to the broadcast.' },
  { name: 'Measurement', assignment: 'both', desc: 'The machine waits 72 hours, then reports sent, delivered, open, click, unsubscribes and the top topic. A human reads the takeaway and decides what the next letter does differently.' },
]

const EXCEPTIONS = [
  { when: 'Person unsubscribed, archived, marked do not contact, or lost consent after the list was built', then: 'Row marked skipped with the reason; no mail sent', heard: 'The recipient table on the broadcast page' },
  { when: 'Address previously hard-bounced or reported spam', then: 'Row marked skipped; a transient bounce (full mailbox) does not count', heard: 'The recipient table' },
  { when: 'CRM lookup fails mid-batch', then: 'Row returned to pending and retried next tick; a timeout is never treated as a suppression', heard: 'Run log, as deferred' },
  { when: 'Resend rejects a send', then: 'Row marked failed with the error; never retried, so a bad address cannot burn reputation', heard: 'The recipient table' },
  { when: 'Mail accepted but the row update fails', then: 'Counted as a write failure; the mail is not resent', heard: 'Run log, as writeFailures' },
  { when: 'A tick dies mid-batch', then: 'Rows claimed more than 30 minutes ago go back to pending; the next tick takes them', heard: 'Nowhere, by design' },
  { when: 'Two ticks overlap', then: 'Rows are claimed and selected in one statement; the second tick finds nothing to take', heard: 'Nowhere, by design' },
  { when: 'Broadcast scheduled for later', then: 'Ignored by the picker until its time arrives, so it never blocks another campaign', heard: 'The broadcast page shows the schedule' },
  { when: 'A send window is set (weekday and hour in the contact’s zone)', then: 'Each recipient carries its own earliest moment; the claim skips rows whose moment has not come', heard: 'The broadcast page' },
  { when: 'Claude unavailable for the takeaway', then: 'Summary posts with the numbers and no takeaway line', heard: 'The Lark post, shorter' },
  { when: 'Summary posted but the latch write fails', then: 'Logged; the broadcast is picked up again tomorrow, so a second post is possible', heard: 'Run log; the duplicate in Lark' },
  { when: 'Marketing webhook unset or Lark down', then: 'Logged and swallowed; the latch still sets, so the recap is not re-attempted', heard: 'Run log only' },
]

export default function EmailBroadcastsWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Revenue"
        title="Email Broadcasts"
        tldr="A marketing email is a list, a body, and an approval. Everything after the approval is a routine: batches go out every 15 minutes, each person is re-checked against the CRM the moment before their send, and the campaign closes itself when nothing is left. Seventy-two hours after that, a second routine posts the settled numbers to the Marketing chat with one sentence from Claude on what they mean, exactly once."
        status="built"
        meta={[
          { label: 'Send tick', value: 'Every 15 minutes' },
          { label: 'Batch', value: '150 per tick by default' },
          { label: 'Summary', value: '72h after send, daily 10:20 (+07)' },
          { label: 'Channel', value: 'Marketing Lark chat' },
        ]}
      />

      {/* The flow */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The flow</span>
          <h2 className="section-title section-title--sm">Three human clicks, then the machine</h2>
          <p className="section-sub u-mt-3">
            Nobody presses send on a person. The human decisions are the content, the audience and the go; the
            routine owns every individual delivery and the report that follows.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Draft and Build the List', cadence: 'Minutes', actor: 'human', actorLabel: 'Admin' },
              { num: '02', title: 'Test and Approve', cadence: 'One click', actor: 'human', actorLabel: 'Approver' },
              { num: '03', title: 'Start Sending', cadence: 'Now or scheduled', actor: 'human', actorLabel: 'Admin' },
              { num: '04', title: 'Batches Go Out', cadence: 'Every 15 minutes', actor: 'system' },
              { num: '05', title: 'Campaign Closes', cadence: 'When nothing is left', actor: 'system' },
              { num: '06', title: 'Settled Summary', cadence: '72h later, daily 10:20', actor: 'ai', actorLabel: 'Claude' },
            ]}
            repeatNote="Step 04 repeats every tick until the list is empty; step 06 runs once per broadcast, ever."
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
                title: 'Draft the broadcast and build the list',
                actor: 'human',
                actorLabel: 'Admin',
                body: (
                  <p>
                    A broadcast is a row: name, subject, preheader, a Markdown body, the featured posts and call to
                    action as blocks, a sender and reply-to, a batch size (150 by default), an optional schedule and
                    an optional segment. &ldquo;Build the list&rdquo; resolves the audience from the CRM through one
                    function that every sending path shares: only people who are subscribed, not marked do not
                    contact, not archived and not in a blocked persona (job seekers never get marketing mail). A
                    guest brand is scoped to its own contacts and can never draw from the house list. The list is
                    paged explicitly so a large CRM cannot be silently truncated.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Send a test, then approve',
                actor: 'human',
                actorLabel: 'Approver',
                body: (
                  <p>
                    A test goes to the approver&rsquo;s own inbox (or any address that matches a CRM contact),
                    personalised from that record so the greeting and unsubscribe link are real. Approval is refused if the body is empty or the recipient list has
                    not been built. If the segment carries a send window (a weekday and hour in the contact&rsquo;s
                    own time zone), approval stamps every recipient with their next such moment, counted from the
                    approval, so &ldquo;Tuesday 08:00&rdquo; means the Tuesday after someone said go.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Start sending',
                actor: 'human',
                actorLabel: 'Admin',
                body: (
                  <p>
                    One more click moves the broadcast from approved to sending. Nothing goes out from the button
                    itself; it only makes the campaign eligible for the routine. A scheduled time, if set, holds the
                    campaign until it arrives without blocking any other campaign behind it. A broadcast can be
                    cancelled at any point before it is marked sent.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'The sender claims a batch and mails it',
                cadence: 'Every 15 minutes',
                actor: 'system',
                body: (
                  <>
                    <p>
                      Each tick picks the oldest campaign that is sending and due, then claims up to one batch of
                      pending recipients in a single database statement (rows whose send window has not arrived are
                      left alone). Claiming and selecting together means an overlapping tick finds nothing to take
                      and cannot double-send; rows claimed by an invocation that died more than 30 minutes ago are
                      returned to pending first.
                    </p>
                    <p>
                      Then, one recipient at a time: re-check the person against the live CRM (consent, do not
                      contact, archived, persona) and against the bounce and complaint history; skip with a reason if
                      any gate fails; otherwise make one Resend call with the shared blocks, the person&rsquo;s first
                      name, a single utm_campaign for the whole send and RFC 8058 one-click unsubscribe headers. Sent
                      rows get the Resend id and a timestamp; failed rows keep the error and are not retried.
                      Finally, any webhook events that arrived before the row was stamped are linked back to the
                      campaign.
                    </p>
                  </>
                ),
              },
              {
                num: '05',
                title: 'The campaign closes itself',
                cadence: 'The tick after the last batch',
                actor: 'system',
                body: (
                  <p>
                    When a tick finds nothing to claim it counts the rows still pending or claimed. Only when that
                    count is zero does it mark the campaign sent with a timestamp; a batch held by a slower
                    invocation is never abandoned. The pacing is deliberate: the sending domain builds reputation
                    gradually, and a bad list shows up as bounces on the first batch instead of after the whole run.
                  </p>
                ),
              },
              {
                num: '06',
                title: 'The settled summary',
                cadence: 'Daily 10:20 (+07), once per broadcast',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <>
                    <p>
                      Every morning the summary routine looks for broadcasts marked sent at least 72 hours ago that
                      have no summary yet (at most 20 per run). For each it reads sent, delivered, opened and clicked
                      from the event ledger, clicks by topic from the utm_content tag on each link, and unsubscribes
                      attributed by time since approval. Claude gets those numbers and returns one sentence on the
                      single most useful thing they say; if it is unavailable the post goes out without the line.
                    </p>
                    <p>
                      The post lands in the Marketing Lark channel with a link to the results page, and only then is
                      the broadcast latched as summarised, so a failed run is retried the next day and a successful
                      one is never repeated.
                    </p>
                  </>
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
            Sending mail is the one automation where a mistake reaches a stranger&rsquo;s inbox, so most of the code
            is the off-path. Each row is a real condition, what the routine does, and where a human hears about it.
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

      {/* Anatomy + rules */}
      <section className="section wf-section--tint">
        <div className="container">
          <SevenElements elements={ELEMENTS} />
          <div className="wf-info-grid">
            <div className="wf-info-card">
              <h3>The standing rules</h3>
              <ul>
                <li>One function decides who may receive marketing mail; the sender and the audience count both call it</li>
                <li>Every recipient is re-checked at send time, never trusted from the list</li>
                <li>A database error is a retry, never a suppression</li>
                <li>A send failure is recorded, never retried</li>
                <li>One campaign at a time, one batch per tick, oldest due first</li>
                <li>A summary is posted once; the latch is set only after the post</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>How we know it works</h3>
              <ul>
                <li>Every run writes a row to the routine log with sent, skipped, failed, deferred and write-failure counts</li>
                <li>The results page reconciles recipient statuses against the event ledger</li>
                <li>A broadcast still pending the morning after its last batch is the alarm</li>
                <li>A summary that never arrives means the latch or the webhook, both visible in the run log</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
