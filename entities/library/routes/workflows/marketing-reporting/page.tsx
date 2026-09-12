import type { Metadata } from 'next'
import Link from 'next/link'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const title = 'Marketing Reporting | Edge8 Workflows'
const description =
  'Three routines keep marketing honest without a meeting. Every morning a digest reminds the founder of blog, LinkedIn and Facebook posts due or overdue. Every Monday a facts-only pulse posts site traffic with week-over-week, posts published and broadcasts sent to the Marketing chat, no AI. On the 4th of each month a recap grades the prior month’s email, asks Claude what to produce next, stores it, posts it, and emails the founder.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/marketing-reporting/' },
  openGraph: { title, description, url: '/workflows/marketing-reporting/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'machine', desc: 'Time, three ways: 09:00 (+07) daily for the digest, Monday 09:30 for the pulse, the 4th of the month at 13:00 for the recap. Nobody asks for a report.' },
  { name: 'Inputs', assignment: 'machine', desc: 'The marketing calendar (title, channel, publish date, status), the broadcast table and its event ledger, and Vercel Web Analytics for the public site. All of it already exists; the routines add no data entry.' },
  { name: 'Decision', assignment: 'both', desc: 'The digest and the pulse decide nothing; they read and report. The recap asks Claude for a readout and three to five suggestions, grounded in which topics earned clicks. The founder decides what actually gets written.' },
  { name: 'Routing', assignment: 'machine', desc: 'The digest goes to the founder by email and to the Ops Lark channel. The pulse and the recap go to the Marketing Lark channel; the recap also emails the founder and is stored for the recaps page.' },
  { name: 'Output', assignment: 'machine', desc: 'A list of posts due, a five-line weekly heartbeat, and a stored monthly recap with metrics, readout, suggestions and the model that wrote it.' },
  { name: 'Delivery', assignment: 'machine', desc: 'Lark text messages and transactional email through Resend, each with a link back to the calendar, the marketing hub or the recaps page.' },
  { name: 'Measurement', assignment: 'human', desc: 'A Monday with no pulse is itself the signal. The recap’s numbers are read against last month’s; whether a suggestion was taken is a human call, visible on next month’s calendar.' },
]

const EXCEPTIONS = [
  { when: 'Nothing due today', then: 'Digest sends nothing at all, no email and no Lark post', heard: 'Nowhere, by design' },
  { when: 'More than ten posts due', then: 'Lark shows the first ten and a count of the rest; the email lists them all', heard: 'The Lark post' },
  { when: 'An email-channel item on the calendar', then: 'Never in the digest; email sends itself through the broadcast engine', heard: 'The broadcasts page' },
  { when: 'Vercel Analytics slow or down', then: 'Pulse posts with a “Traffic: unavailable” line; the rest of the post is unaffected', heard: 'The Monday post' },
  { when: 'No prior week of traffic', then: 'Week-over-week reads “no prior week” instead of a percentage', heard: 'The Monday post' },
  { when: 'Quiet week, nothing shipped', then: 'Pulse still posts, with zero posts and “Emails: none sent”', heard: 'The Monday post' },
  { when: 'A calendar or broadcast read fails during the pulse', then: 'Logged; that section reports zero and the post still goes out', heard: 'Run log' },
  { when: 'No broadcasts sent last month', then: 'Recap skips cleanly: nothing stored, nothing posted, nothing emailed', heard: 'Run log, as skipped' },
  { when: 'Claude unavailable for the recap', then: 'Same clean skip; the recap has no fallback without the readout', heard: 'Run log, as skipped' },
  { when: 'Recap run twice for the same month', then: 'The stored row is replaced in place; Lark and email go out again', heard: 'A second Lark post and email' },
  { when: 'Recap stored but the Lark post or email fails', then: 'The row is already saved; email failure is reported in the run result, Lark failure is logged only', heard: 'The recaps page; run log' },
  { when: 'A Lark webhook is not configured', then: 'The message is skipped with a warning; the run still reports success', heard: 'Run log only' },
]

export default function MarketingReportingWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Revenue"
        title="Marketing Reporting"
        tldr="Marketing at a small company fails quietly: the post that never went up, the week nobody looked at traffic, the month nobody asked what worked. These three routines make the silence loud. A daily reminder of what is due, a Monday pulse with only facts, and a monthly recap where Claude reads the email numbers and proposes what to write next. Humans post the content and pick the ideas; the machine keeps the calendar."
        status="built"
        meta={[
          { label: 'Digest', value: 'Daily 09:00 (+07)' },
          { label: 'Pulse', value: 'Monday 09:30 (+07)' },
          { label: 'Recap', value: '4th of the month, 13:00 (+07)' },
          { label: 'AI', value: 'Recap only' },
        ]}
      />

      {/* The flow */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The flow</span>
          <h2 className="section-title section-title--sm">Three cadences, one calendar</h2>
          <p className="section-sub u-mt-3">
            The routines never create content and never post it. They read what humans put on the marketing calendar
            and what the <Link href="/workflows/email-broadcasts">broadcast engine</Link> already sent, and report on
            it at three speeds.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Calendar Holds the Plan', cadence: 'Continuous', actor: 'human', actorLabel: 'Team' },
              { num: '02', title: 'Daily Digest', cadence: '09:00 daily', actor: 'system' },
              { num: '03', title: 'Post and Mark Published', cadence: 'Same day', actor: 'human', actorLabel: 'Founder' },
              { num: '04', title: 'Monday Pulse', cadence: 'Monday 09:30', actor: 'system' },
              { num: '05', title: 'Monthly Recap', cadence: '4th of the month', actor: 'ai', actorLabel: 'Claude' },
            ]}
            repeatNote="Steps 02 and 03 repeat every day something is due; 04 every Monday; 05 once a month."
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
                title: 'The calendar holds the plan',
                actor: 'human',
                actorLabel: 'Team',
                body: (
                  <p>
                    Every piece of content is a row on the marketing calendar: a title, a channel (blog, LinkedIn,
                    Facebook or email), a brand, a publish date and a status. Email rows are produced and sent by the
                    broadcast engine; the other three channels are posted by hand. The routines below read this table
                    and the broadcast table; they never write to either.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'The daily digest',
                cadence: '09:00 (+07) every day',
                actor: 'system',
                body: (
                  <>
                    <p>
                      The digest selects blog, LinkedIn and Facebook rows whose publish date is today or earlier and
                      whose status is not published or skipped, oldest first. Anything dated before today is tagged
                      overdue. If the list is empty the run ends without sending anything.
                    </p>
                    <p>
                      Otherwise it does two things: emails the founder a list with a link to the calendar and a
                      one-line instruction (mark each one posted once it is live), and posts the same list, capped at
                      ten with a count of the rest, to the Ops Lark channel. The day boundary is UTC, so a post dated
                      today in Ho Chi Minh City appears in the digest that same morning.
                    </p>
                  </>
                ),
              },
              {
                num: '03',
                title: 'Post it, then mark it published',
                actor: 'human',
                actorLabel: 'Founder',
                body: (
                  <p>
                    The human step is the only one that touches a social platform. The founder publishes the post
                    wherever it goes, then marks the row published (or skipped) on the calendar. That status change is
                    what stops the digest repeating it tomorrow and what makes it count in Monday&rsquo;s pulse; the
                    routines cannot tell a post went up any other way.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'The Monday pulse',
                cadence: 'Monday 09:30 (+07)',
                actor: 'system',
                body: (
                  <>
                    <p>
                      The pulse is a heartbeat, facts only, no model in the loop. It reads the public site&rsquo;s
                      last seven days from Vercel Web Analytics (page views, visitors, top three pages, top four
                      channels) and the seven days before that for a week-over-week line. Internal traffic behind the
                      login is excluded so the marketing number is not flattered by the team using the admin.
                    </p>
                    <p>
                      Then what shipped: calendar rows marked published in the window, broken down by channel (email
                      excluded, since it is counted as broadcasts), and every broadcast marked sent in the window with
                      its sent count, open rate and click rate. The post goes to the Marketing Lark channel with a
                      link to the marketing hub. It always posts, even on a quiet week, so a missing Monday post is a
                      real signal rather than a normal one. The window is rolling seven days from the run, not a
                      calendar week.
                    </p>
                  </>
                ),
              },
              {
                num: '05',
                title: 'The monthly recap',
                cadence: '4th of the month, 13:00 (+07)',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <>
                    <p>
                      On the 4th (not the 1st, so every broadcast from the prior month is past the 72-hour settle
                      window the <Link href="/workflows/email-broadcasts">broadcast summary</Link> uses) the recap
                      reads every broadcast marked sent in the previous calendar month. For each it gathers sent,
                      delivered, opened, clicked, unsubscribes attributed since approval, and clicks by topic from the
                      utm_content tags. Those become a month total, a per-broadcast line, and a ranked list of topics
                      by unique clickers.
                    </p>
                    <p>
                      Claude gets that material and returns a two-to-four sentence readout and three to five content
                      suggestions, each with a one-line rationale tied to the numbers. The recap is stored first
                      (keyed on the month, replaced in place on a re-run) so it exists even if delivery fails, then
                      posted to the Marketing Lark channel, then emailed to the founder with a link to past recaps.
                      A month with no sends, or no model available, is a clean skip: nothing stored, nothing posted.
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
            Reporting routines fail in two ways: they say nothing when they should, or they say something wrong. Each
            row is a real condition, what the routine does, and where a human hears about it. The silent cases are
            listed so they are deliberate.
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
                <li>The routines read the calendar and the broadcast table; they never write to either</li>
                <li>The digest is silent when nothing is due; the pulse is never silent</li>
                <li>No AI in the daily or weekly report; a single week is too thin to advise on</li>
                <li>The recap is stored before it is delivered, so a delivery failure loses nothing</li>
                <li>A month with no sends produces no recap, not an empty one</li>
                <li>Every run writes a row to the routine log with what it counted</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Why it works</h3>
              <ul>
                <li>The digest turns a forgotten post into an overdue line the founder sees every morning until it clears</li>
                <li>The pulse makes the marketing number public inside the company every week, with its trend</li>
                <li>The recap grounds next month&rsquo;s content in which topics actually pulled clicks, not in taste</li>
                <li>Three cadences mean three different questions get answered without anyone asking</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
