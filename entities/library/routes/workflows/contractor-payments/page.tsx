import type { Metadata } from 'next'
import { WorkflowHero, ActorChip, StepCards, SevenElements, DetailFooter, type Actor, type WorkflowElement } from '../ui'

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'human', desc: 'An admin creates a written work request. No verbal assignments, so there is always a record.' },
  { name: 'Inputs', assignment: 'both', desc: 'The request scope from the admin; the estimate and plan, then the actual hours, summary, and work link from the contractor.' },
  { name: 'Decision', assignment: 'human', desc: 'Three human gates: approve the estimate before work starts, accept the work when it ships, decide the payment on the 1st.' },
  { name: 'Routing', assignment: 'machine', desc: 'Every decision emails the contractor, looping the request until it is approved or closed; the ops Lark chat hears when a client raises or decides one.' },
  { name: 'Output', assignment: 'machine', desc: 'A monthly payment request per contractor, with the accepted work linked and the hours priced at their current rates.' },
  { name: 'Delivery', assignment: 'machine', desc: 'One admin page listing every payment request, plus an email back to the contractor when it is paid or needs more information.' },
  { name: 'Measurement', assignment: 'machine', desc: 'Estimates versus actuals per contractor over time, the number that makes the next estimate honest.' },
]

const title = 'Contractor Hours + Payment | Edge8 Workflows'
const description =
  'Every piece of contractor work moves through one loop: request, estimate, approval, delivery, and a monthly payment run. The contractor is emailed at every step; ops hears in Lark.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/contractor-payments/' },
  openGraph: { title, description, url: '/workflows/contractor-payments/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

type LaneNode = {
  num: string
  lane: 'admin' | 'system' | 'contractor'
  actor: Actor
  actorLabel: string
  title: string
  desc: string
  outcomes?: { label: string; kind: 'approve' | 'reject' | 'info' }[]
}

const NODES: LaneNode[] = [
  {
    num: '1',
    lane: 'admin',
    actor: 'human',
    actorLabel: 'Admin',
    title: 'Create a work request',
    desc: 'The admin writes up the work: what it is, the context, and what done looks like.',
  },
  {
    num: '2',
    lane: 'system',
    actor: 'system',
    actorLabel: 'System',
    title: 'Notify the contractor',
    desc: 'An email goes out automatically with a link to respond. When a client raised the request, the ops Lark chat is told too.',
  },
  {
    num: '3',
    lane: 'contractor',
    actor: 'contractor',
    actorLabel: 'Contractor',
    title: 'Submit an estimate',
    desc: 'The link opens a form asking for their hour estimate and their plan to complete the work.',
  },
  {
    num: '4',
    lane: 'admin',
    actor: 'human',
    actorLabel: 'Admin',
    title: 'Review the estimate',
    desc: 'The admin (or the client who raised it) makes a call. Every decision emails the contractor.',
    outcomes: [
      { label: 'Approve', kind: 'approve' },
      { label: 'Reject', kind: 'reject' },
      { label: 'Request changes', kind: 'info' },
    ],
  },
  {
    num: '5',
    lane: 'contractor',
    actor: 'contractor',
    actorLabel: 'Contractor',
    title: 'Do the work, submit actuals',
    desc: 'Once approved, the contractor does the work and submits actual hours, a summary, and a link. The admin accepts it or asks for a revision.',
  },
  {
    num: '6',
    lane: 'system',
    actor: 'system',
    actorLabel: 'System',
    title: 'Monthly payment run',
    desc: 'On the 1st of the month, a routine rolls the previous month\u2019s accepted work into one payment request per contractor.',
  },
  {
    num: '7',
    lane: 'admin',
    actor: 'human',
    actorLabel: 'Admin',
    title: 'Review the payment request',
    desc: 'Admins see every payment request on one page and mark each one.',
    outcomes: [
      { label: 'Paid', kind: 'approve' },
      { label: 'Rejected', kind: 'reject' },
      { label: 'More info', kind: 'info' },
    ],
  },
]

export default function ContractorPaymentsWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Operations"
        title="Contractor Hours + Payment"
        status="built"
        tldr="Every piece of contractor work moves through one loop: request, estimate, approval, delivery, and a monthly payment run. The contractor is emailed at every step, ops hears in Lark, and admins decide from one page."
        meta={[
          { label: 'Actors', value: 'Admin · System · Contractor' },
          { label: 'Payment run', value: '1st of the month, 13:00 (+07)' },
          { label: 'Approval gates', value: '3' },
        ]}
      />

      {/* Swimlane diagram */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The flow</span>
          <h2 className="section-title section-title--sm">
            Three lanes, seven steps
          </h2>
          <p className="section-sub u-mt-3">
            Work passes between the admin, the system, and the contractor. The system carries every handoff, so nobody
            has to remember to follow up.
          </p>

          <div className="wf-lanes-head">
            <div className="wf-lane-label wf-lane-label-admin">Admin</div>
            <div className="wf-lane-label wf-lane-label-system">System</div>
            <div className="wf-lane-label wf-lane-label-contractor">Contractor</div>
          </div>
          <div className="wf-lanes">
            {NODES.map((n) => (
              <div key={n.num} className={`wf-node wf-node-${n.lane}`}>
                <span className="wf-node-badge">{n.num}</span>
                <div className="u-mb-2">
                  <ActorChip actor={n.actor} label={n.actorLabel} />
                </div>
                <div className="wf-node-title">{n.title}</div>
                <p className="wf-node-desc">{n.desc}</p>
                {n.outcomes && (
                  <div className="wf-outcomes">
                    {n.outcomes.map((o) => (
                      <span key={o.label} className={`wf-outcome wf-outcome-${o.kind}`}>
                        {o.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="wf-loop-note">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 2l4 4-4 4" />
              <path d="M3 11v-1a4 4 0 014-4h14" />
              <path d="M7 22l-4-4 4-4" />
              <path d="M21 13v1a4 4 0 01-4 4H3" />
            </svg>
            <span>
              Reject and request-changes decisions loop back to the contractor with an email, so a request keeps moving
              until it is approved or closed. Nothing gets paid without an approved estimate, submitted actuals, and an
              admin accepting the work.
            </span>
          </div>
        </div>
      </section>

      {/* Step detail */}
      <section className="section wf-section--tint">
        <div className="container">
          <span className="section-label wf-section--white">
            Step by step
          </span>
          <h2 className="section-title section-title--sm">
            From request to paid
          </h2>
          <StepCards
            steps={[
              {
                num: '01',
                title: 'Create a work request',
                actor: 'human',
                actorLabel: 'Admin',
                body: (
                  <p>
                    Everything starts with a written request from the admin: the work to be done, the context, and what
                    done looks like. No verbal assignments, so there is always a record to estimate against.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Notify the contractor',
                actor: 'system',
                body: (
                  <p>
                    The moment a request is sent, the contractor gets an email carrying a link to their response form.
                    A request raised by a client from the portal also pings the ops Lark chat, so the admin sees it
                    without being asked.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Submit an estimate',
                actor: 'contractor',
                body: (
                  <p>
                    The link asks the contractor for two things: their estimate in hours and their plan to complete the
                    work. Both go on the record before any work starts.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'Review the estimate',
                actor: 'human',
                actorLabel: 'Admin',
                body: (
                  <>
                    <p>The admin, or the client who raised the request, reviews the estimate and picks one of three outcomes:</p>
                    <ul>
                      <li>
                        <strong>Approve</strong>: the contractor is cleared to start
                      </li>
                      <li>
                        <strong>Reject</strong>: the request is closed
                      </li>
                      <li>
                        <strong>Request changes</strong>: the contractor gets a note and submits a new estimate
                      </li>
                    </ul>
                    <p className="u-mt-3">
                      Every decision emails the contractor, and a reject or a change request must carry a note, so the
                      loop never stalls waiting on a status update. Scope added mid-flight sends the request back for a
                      fresh estimate the same way.
                    </p>
                  </>
                ),
              },
              {
                num: '05',
                title: 'Do the work, submit actuals',
                actor: 'contractor',
                body: (
                  <p>
                    Once approved, the contractor does the work. When it is done they submit their actual hours (regular
                    and overtime), a summary of what was delivered, and a link to the work. The admin, or the client,
                    accepts it or asks for a revision; only accepted work reaches the payment run.
                  </p>
                ),
              },
              {
                num: '06',
                title: 'Monthly payment run',
                cadence: '1st of the month, 13:00 (+07)',
                actor: 'system',
                body: (
                  <p>
                    On the 1st, a scheduled routine rolls every piece of work accepted in the previous month into one
                    payment request per contractor, pricing the hours at their current hourly and overtime rates and
                    linking the work requests to it. Re-running is safe: a still-pending payment is recomputed, a paid or
                    rejected one is never touched, and a contractor with no rate on file is skipped and named. The ops
                    Lark chat gets the tally and a link to review, and an admin can run the same roll-up by hand.
                  </p>
                ),
              },
              {
                num: '07',
                title: 'Review the payment request',
                actor: 'human',
                actorLabel: 'Admin',
                body: (
                  <p>
                    Admins get one page listing every payment request, with the linked work and an amount they can
                    adjust while it is undecided. Each one is marked <strong>paid</strong>,{' '}
                    <strong>rejected</strong>, or <strong>more information required</strong>. Paid and more-information
                    email the contractor; rejected is an internal note and sends nothing.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Rules */}
      <section className="section">
        <div className="container">
          <SevenElements elements={ELEMENTS} />
          <div className="wf-info-grid">
            <div className="wf-info-card">
              <h3>The standing rules</h3>
              <ul>
                <li>No work starts without a written request and an approved estimate</li>
                <li>Every decision emails the contractor; ops hears in Lark</li>
                <li>Actuals need a summary and a link to the work, not just hours</li>
                <li>Payments batch monthly on the 1st, reviewed on one page</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Why it works</h3>
              <ul>
                <li>Estimates before work means no surprise invoices</li>
                <li>The system owns the handoffs, so nothing waits on a human memory</li>
                <li>Work links make every payment auditable months later</li>
                <li>One monthly run replaces ad hoc payment requests all month long</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
