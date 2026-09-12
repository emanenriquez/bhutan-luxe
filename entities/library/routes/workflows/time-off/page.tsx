import type { Metadata } from 'next'
import { WorkflowHero, ActorChip, StepCards, SevenElements, DetailFooter, type Actor, type WorkflowElement } from '../ui'

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'human', desc: 'An employee submits a leave request in the team portal.' },
  { name: 'Inputs', assignment: 'machine', desc: 'The current balance, leave history, and team calendar, shown with the request.' },
  { name: 'Decision', assignment: 'both', desc: 'Approve or reject. The leave policy decides who decides: some policies auto-approve, the rest wait for a person.' },
  { name: 'Routing', assignment: 'machine', desc: 'Requests route to the approver, the Edge8 manager or the client manager on the placement, by email; the ops Lark chat sees every request.' },
  { name: 'Output', assignment: 'machine', desc: 'A decided leave record on the shared calendar, and a balance synced from the HR system rather than hand-tracked.' },
  { name: 'Delivery', assignment: 'machine', desc: 'The decision shows in the team portal; the client portal shows who is out when.' },
  { name: 'Measurement', assignment: 'machine', desc: 'Balances and usage across the team, read from one synced source instead of a spreadsheet.' },
]

const title = 'Time Off | Edge8 Workflows'
const description =
  'Leave requests move from the team portal to an admin decision to an updated balance without a single chat message.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/time-off/' },
  openGraph: { title, description, url: '/workflows/time-off/', type: 'website' },
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
    lane: 'contractor',
    actor: 'contractor',
    actorLabel: 'Employee',
    title: 'Request time off',
    desc: 'The employee picks dates and a leave type in the team portal. Their current balance is right there on the form.',
  },
  {
    num: '2',
    lane: 'system',
    actor: 'system',
    actorLabel: 'System',
    title: 'Route to admin',
    desc: 'A policy that auto-approves closes it on the spot. Otherwise the approver is emailed and the request waits in the admin or client-portal queue.',
  },
  {
    num: '3',
    lane: 'admin',
    actor: 'human',
    actorLabel: 'Admin',
    title: 'Decide',
    desc: 'The admin, or the client manager on the placement, sees the request in context: team calendar, remaining balance, overlapping leave.',
    outcomes: [
      { label: 'Approve', kind: 'approve' },
      { label: 'Reject', kind: 'reject' },
    ],
  },
  {
    num: '4',
    lane: 'system',
    actor: 'system',
    actorLabel: 'System',
    title: 'Record the leave',
    desc: 'On approval the leave shows on the team and client calendars. Balances are synced from the HR system, not deducted by hand.',
  },
  {
    num: '5',
    lane: 'contractor',
    actor: 'contractor',
    actorLabel: 'Employee',
    title: 'See the outcome',
    desc: 'The employee sees the decision and their updated balance in the portal. No follow-up message needed.',
  },
]

export default function TimeOffWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Operations"
        title="Time Off"
        status="planned"
        tldr="Leave requests move from the team portal to a decision to a recorded balance without anyone chasing anyone. The system carries the request, the context, and the outcome."
        meta={[
          { label: 'Actors', value: 'Employee · System · Approver' },
          { label: 'Human chasing', value: '0' },
          { label: 'Balances', value: 'Synced from HR' },
        ]}
      />

      {/* Swimlane */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The flow</span>
          <h2 className="section-title section-title--sm">
            Request to decision in five steps
          </h2>
          <p className="section-sub u-mt-3">
            The whole loop is request, decide, record. Nobody chases anybody, and the balance math never gets done by
            hand.
          </p>

          <div className="wf-lanes-head">
            <div className="wf-lane-label wf-lane-label-admin">Admin</div>
            <div className="wf-lane-label wf-lane-label-system">System</div>
            <div className="wf-lane-label wf-lane-label-contractor">Employee</div>
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
        </div>
      </section>

      {/* Step detail */}
      <section className="section wf-section--tint">
        <div className="container">
          <span className="section-label wf-section--white">
            Step by step
          </span>
          <h2 className="section-title section-title--sm">
            How each step works
          </h2>
          <StepCards
            steps={[
              {
                num: '01',
                title: 'Request in the portal',
                actor: 'contractor',
                actorLabel: 'Employee',
                body: (
                  <p>
                    The employee opens the team portal, picks dates and a leave type, and submits. Their remaining
                    balance is shown on the form, so nobody requests days they do not have.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'The system routes it',
                actor: 'system',
                body: (
                  <p>
                    The leave policy sets the path. A policy marked auto-approve approves the request on the spot,
                    stamped as approved by policy rather than a person. Otherwise the approver (the client manager on
                    the placement, else the Edge8 manager) gets an email with the reason, the client&apos;s portal admins
                    get a copy without it, and the ops Lark chat gets one line. The request waits in the queue with the
                    balance, the history, and any team overlap on those dates.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Approver decides',
                actor: 'human',
                actorLabel: 'Approver',
                body: (
                  <p>
                    Approve or reject, one click either way, in the admin or in the client portal. Because the context
                    travels with the request, the decision takes seconds instead of a back-and-forth thread. An admin can
                    also deny leave that a policy approved automatically.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'The record is the calendar',
                actor: 'system',
                body: (
                  <p>
                    On approval the leave appears on the shared calendar, and the daily check-in agent treats those days
                    as off. Balances are not computed here: they are synced from the HR system the company already runs
                    leave in, so the portal shows one number and nobody reconciles it by hand.
                  </p>
                ),
              },
              {
                num: '05',
                title: 'Employee sees the outcome',
                actor: 'contractor',
                actorLabel: 'Employee',
                body: (
                  <p>
                    The decision shows in the team portal immediately, next to the synced balance. The whole loop closes
                    without a single &ldquo;did you see my request?&rdquo; message.
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
                <li>All leave goes through the portal, never through chat</li>
                <li>Balances are synced from the HR system, never hand-tracked</li>
                <li>Every request is decided with the team calendar in view</li>
                <li>The decision and the record are the same thing</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Why it works</h3>
              <ul>
                <li>One queue means requests cannot get lost in a thread</li>
                <li>Context attached to the request makes decisions fast</li>
                <li>One synced balance kills the year-end balance argument</li>
                <li>Everyone sees the same calendar, so coverage gaps surface early</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
