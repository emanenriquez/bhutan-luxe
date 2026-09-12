import type { Metadata } from 'next'
import Link from 'next/link'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const title = 'The Letter Agent | Edge8 Workflows'
const description =
  'Every Monday at 07:00 an agent opens next Tuesday’s letter as a draft broadcast, gathers the last ten days from events, meeting summaries and the founder’s journal, picks three published posts no letter has featured, writes a 170-word note in the founder’s voice, rotates the call to action and the layout, checks every link is live, and sends one test to the approver. It parks there. A person approves and starts the send; the agent never mails the list.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/letter-agent/' },
  openGraph: { title, description, url: '/workflows/letter-agent/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'machine', desc: 'Time. Monday 07:00 (+07) opens the draft and starts the run. A person can also start, retry, continue or stop a run from the broadcast page.' },
  { name: 'Inputs', assignment: 'machine', desc: 'The last ten days of events, meeting summaries and journal pages; the brand profile for voice and rules; the published post list; the last four sent letters, so subjects and openings do not repeat.' },
  { name: 'Decision', assignment: 'both', desc: 'The model decides which facts are worth a sentence and how to say them. The pipeline decides everything else: which posts, which button, which layout, and whether the email is fit to send. The approver decides whether it goes.' },
  { name: 'Routing', assignment: 'machine', desc: 'One broadcast row carries the whole run. Each step hands itself on with one authenticated call to its own route, so nothing polls and no browser tab stays open.' },
  { name: 'Output', assignment: 'machine', desc: 'A draft broadcast with subject, preheader, body, three posts, a call to action and a layout; one [TEST] email in the approver’s inbox; one routine run row per step with the tokens it cost.' },
  { name: 'Delivery', assignment: 'human', desc: 'The approver reads the test as a real email, presses Approve on the broadcast page, then Start sending. The list is mailed in batches by the existing send routine, not by this agent.' },
  { name: 'Measurement', assignment: 'machine', desc: 'Every link carries a UTM content tag, so the results card on the broadcast shows which post and which button worked. The rotation reads that history to decide what the next letter carries.' },
]

const EXCEPTIONS = [
  { when: 'A draft the agent opened is still waiting from a previous week', then: 'Monday opens nothing new; the waiting draft is named', heard: 'The cron’s run row' },
  { when: 'Nothing happened in the last ten days (no events, summaries or journal pages)', then: 'Gather fails; the run stops', heard: 'Lark ops message, the broadcast page' },
  { when: 'The journal is not configured', then: 'It contributes nothing; events and meetings carry the week', heard: 'Nowhere, by design' },
  { when: 'Fewer than three usable data points, or none from the last seven days', then: 'Gather fails; the run stops', heard: 'Lark ops message, the broadcast page' },
  { when: 'Fewer than three unsent posts on the brand', then: 'The pick falls back to the posts featured longest ago and says so', heard: 'The step summary on the run row' },
  { when: 'The draft breaks a rule (over 220 words, an em dash, a client name, the subject repeated in the body, no greeting or sign-off)', then: 'Write fails with every rule it broke; nothing is saved', heard: 'Lark ops message, the broadcast page' },
  { when: 'A call to action has no landing page yet', then: 'Skipped in the rotation until its URL exists', heard: 'Nowhere, by design' },
  { when: 'A picked post lost its hero image, or its page or the button’s page does not answer', then: 'Assemble fails; the run stops', heard: 'Lark ops message, the broadcast page' },
  { when: 'The rendered HTML is over the Gmail clip limit, a link carries no tracking, or the unsubscribe secret is missing', then: 'Validate fails before any test is sent; the checklist is saved', heard: 'Lark ops message, the broadcast page' },
  { when: 'The test address has no CRM contact', then: 'Validate fails; the test cannot be addressed', heard: 'Lark ops message' },
  { when: 'The broadcast is no longer a draft', then: 'The step is skipped; the agent only works on drafts', heard: 'The run row' },
  { when: 'A hand-off between steps is dropped', then: 'The run sits on its current step; Continue hands it on again', heard: 'The broadcast page shows the step with no error' },
  { when: 'A step stops with an error', then: 'Retry step clears the error and runs that step again from its own inputs', heard: 'The broadcast page' },
]

export default function LetterAgentWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Revenue"
        title="The Letter Agent"
        tldr="A weekly letter is easy to promise and hard to keep writing. This agent does the Monday work: it reads what actually happened in the last ten days, picks three posts the list has not seen, writes a short note in the founder&rsquo;s voice, and puts a real test email in the approver&rsquo;s inbox before the day starts. The one thing it cannot do is send. That stays a button a person presses."
        status="built"
        meta={[
          { label: 'Cadence', value: 'Monday 07:00 (+07), then one step at a time' },
          { label: 'Sources', value: 'Events, meeting summaries, the founder’s journal' },
          { label: 'Human touchpoints', value: 'Read the test, Approve, Start sending' },
        ]}
      />

      {/* Orientation */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The shape, in ten seconds</span>
          <h2 className="section-title section-title--sm">Ten days in, one test email out</h2>
          <p className="section-sub u-mt-3">
            Six machine steps between the Monday trigger and the approver. Each one must pass its own check
            before the next starts, and the pipeline refuses to skip. There is no send step on purpose.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Draft Opened', cadence: 'Monday 07:00', actor: 'system' },
              { num: '02', title: 'Gather the Week', cadence: 'Last ten days', actor: 'ai', actorLabel: 'Claude' },
              { num: '03', title: 'Pick Three Posts', cadence: 'Unsent first', actor: 'system' },
              { num: '04', title: 'Write the Letter', cadence: 'About 170 words', actor: 'ai', actorLabel: 'Claude' },
              { num: '05', title: 'Rotate CTA and Layout', cadence: 'Round robin', actor: 'system' },
              { num: '06', title: 'Assemble', cadence: 'Every link checked', actor: 'system' },
              { num: '07', title: 'Validate and Test', cadence: 'One [TEST] email', actor: 'system' },
              { num: '08', title: 'Approve and Send', cadence: 'Tuesday', actor: 'human', actorLabel: 'Approver' },
            ]}
            repeatNote="Every Monday, unless last week&rsquo;s draft is still waiting for approval."
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
                title: 'Monday opens the draft',
                cadence: 'Monday 07:00 (+07)',
                actor: 'system',
                body: (
                  <p>
                    A scheduled routine inserts one draft broadcast for the house brand, named for the week, with the
                    agent as its author. If a draft the agent opened earlier is still waiting for approval, nothing
                    new is opened: the backlog is one letter, never two. Then it runs the first step in the same
                    request, so the run is moving before anyone is at a desk.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Gather the week',
                cadence: 'Claude, one call',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    Three sources, ten days back: events that ran, meeting summaries, and the founder&rsquo;s journal
                    (read from Notion when configured, silently absent when not). The model returns five to eight
                    dated data points, each tied to its source, written in the first person, with people described by
                    role and place, never by name. The step passes with at least three points and at least one from
                    the last seven days. Client names never leave this step.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Pick three posts',
                cadence: 'No model',
                actor: 'system',
                body: (
                  <p>
                    The sixty newest published posts on the brand, minus every post a sent letter has already
                    featured. Three are chosen newest first, with at most two from one pillar so the letter does not
                    make one argument three times. When fewer than three unsent posts exist the pick falls back to
                    the ones featured longest ago and says so in its summary.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'Write the letter',
                cadence: 'Claude, one call',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    A note from a person, not a newsletter. The model is given the data points, the three posts, the
                    brand profile and the subjects of the last four sent letters. It returns a subject of at most 60
                    characters, a preheader, and a body that opens with a first-name greeting, runs two or three short
                    paragraphs from the data points, ties the week to the three posts in one line, and signs off. The
                    server then checks every rule: at most 220 words, no em dash, no audit or hiring language, the
                    brand name spelled Edge8, no headings, lists or links, and the subject not repeated in the body.
                    Any failure stops the run with the full list; nothing half-right is saved.
                  </p>
                ),
              },
              {
                num: '05',
                title: 'Rotate the call to action and the layout',
                cadence: 'No model',
                actor: 'system',
                body: (
                  <p>
                    Strict round robin from whatever the last sent letter carried. Four calls to action are in the
                    catalogue (a conversation, a private retreat, LinkedIn, the book); an entry without a landing page
                    is skipped until its URL exists. Three layouts rotate the same way: list, feature, cards. The first
                    letter gets the list layout, the plainest one, with the conversation button.
                  </p>
                ),
              },
              {
                num: '06',
                title: 'Assemble',
                cadence: 'No model',
                actor: 'system',
                body: (
                  <p>
                    The posts and the button as the email will carry them. Every picked post must still resolve to a
                    published post with a slug and a hero image, and every post page and the call to action page must
                    answer over HTTP. A post that lost its hero since the pick is a hole in the email, so it fails the
                    step rather than raising a warning.
                  </p>
                ),
              },
              {
                num: '07',
                title: 'Validate and send the test',
                cadence: 'One [TEST] email',
                actor: 'system',
                body: (
                  <p>
                    The email is rendered exactly as the list would receive it, HTML and plain text, tracking on. The
                    step checks what a person would otherwise have to open the source to see: size under the Gmail clip
                    limit, a non-empty text part, every link tagged for tracking, the unsubscribe link signable, all
                    three posts resolved. Only when every check passes does it send one [TEST] email to the approver,
                    addressed by first name from the CRM. The run then parks at ready and stops calling itself.
                  </p>
                ),
              },
              {
                num: '08',
                title: 'Approve and start sending',
                cadence: 'Tuesday, by a person',
                actor: 'human',
                actorLabel: 'Approver',
                body: (
                  <p>
                    The approver reads the test in a real inbox, edits on the broadcast page if anything needs it,
                    presses Approve, then Start sending. The existing send routine mails the list in batches of fifty.
                    The agent has no send verb: there is no code path from the pipeline to the list.
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
            A run stops at the first step that fails its check, writes the error on the broadcast, and tells the ops
            channel once. Nothing is retried on its own; a person presses Retry step or Stop.
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

      {/* Contract */}
      <section className="section wf-section--tint">
        <div className="container">
          <span className="section-label wf-section--white">The contract</span>
          <h2 className="section-title section-title--sm">Data, timing, and how we know it works</h2>
          <div className="wf-info-grid">
            <div className="wf-info-card">
              <h3>Reads and writes</h3>
              <ul>
                <li>Reads: events, meeting summaries and journal pages from the last ten days; the brand profile; published posts and which ones sent letters featured; the last four sent letters; the CRM contact for the test address</li>
                <li>Writes: one draft broadcast (subject, preheader, body, posts, call to action, layout); the agent&rsquo;s step, error and notes on that row; one test email logged against the broadcast; one routine run row per step</li>
                <li>The step pointer lives on the broadcast, so a run can be inspected, retried or stopped from its page at any point</li>
                <li>Models: the gather and write steps run on the frontier tier with a structured-output schema; the other four steps call no model</li>
              </ul>
            </div>
            <div className="wf-info-card">
              <h3>Timing model</h3>
              <ul>
                <li>Monday 00:00 UTC, 07:00 in Ho Chi Minh City: the draft opens and the first step runs</li>
                <li>Each passing step makes one authenticated call to the step route for the next; a run finishes in minutes, one function per step</li>
                <li>The run parks at ready; nothing in the pipeline moves it past that state</li>
                <li>Tuesday is the send day by convention: the approver chooses the moment, or sets a send window on the broadcast</li>
                <li>One draft at a time: while an agent-opened draft waits, Monday opens nothing</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>How we know it works</h3>
              <ul>
                <li>A Monday morning with no [TEST] in the approver&rsquo;s inbox and no ops message is the alarm</li>
                <li>The step summary on each run row says what it did: how many data points, which posts, which button, the size of the email</li>
                <li>Every link carries a UTM content tag, so the broadcast&rsquo;s results card shows which post and which button was clicked</li>
                <li>The rotation reads the last sent letter, so a skipped week never breaks the sequence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Anatomy + closing */}
      <section className="section">
        <div className="container">
          <SevenElements elements={ELEMENTS} />
          <p className="wf-lead u-mt-6">
            The posts this letter carries are written by{' '}
            <Link href="/workflows/writer-agent" className="u-accent">
              the writer agent
            </Link>
            , which uses the same one-step-per-run pattern. Both agents stop at the same place: a person reads the
            real thing and decides.
          </p>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
