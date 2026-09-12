import type { Metadata } from 'next'
import { WorkflowHero, ActorChip, StepCards, SevenElements, DetailFooter, type Actor, type WorkflowElement } from '../ui'

const title = 'Ideas Backlog | Edge8 Workflows'
const description =
  'Anyone on the team submits an idea through the 5D framework, AI turns it into a full product plan, and admins triage a backlog that arrives pre-thought.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/ideas-backlog/' },
  openGraph: { title, description, url: '/workflows/ideas-backlog/', type: 'website' },
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
    actorLabel: 'Team member',
    title: 'Submit an idea through 5D',
    desc: 'The team form walks the idea through the first four Ds, from the problem it solves to the return it could produce. Deploy waits until there is something to deploy.',
  },
  {
    num: '2',
    lane: 'system',
    actor: 'ai',
    actorLabel: 'Claude',
    title: 'AI writes the product plan',
    desc: 'Claude expands the structured idea into a full product plan and files it under one of the four offices. The submitter can edit the plan afterwards.',
  },
  {
    num: '3',
    lane: 'system',
    actor: 'system',
    actorLabel: 'System',
    title: 'Idea lands in the backlog',
    desc: 'The idea and its plan arrive in the innovation backlog together, ready to be judged.',
  },
  {
    num: '4',
    lane: 'admin',
    actor: 'human',
    actorLabel: 'Admin',
    title: 'Triage the backlog',
    desc: 'Admins review ideas with the plan already attached and set the status: approve it, keep it in review, or decline it.',
    outcomes: [
      { label: 'Approved', kind: 'approve' },
      { label: 'In review', kind: 'info' },
      { label: 'Declined', kind: 'reject' },
    ],
  },
  {
    num: '5',
    lane: 'contractor',
    actor: 'contractor',
    actorLabel: 'Team member',
    title: 'See the outcome',
    desc: 'The submitter sees the status of every idea they submitted on their own ideas page. A declined idea keeps its plan.',
  },
]

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'human', desc: 'A team member has an idea. The system makes sure having one is never the hard part of sharing one.' },
  { name: 'Inputs', assignment: 'human', desc: 'The 5D form, first four Ds: the problem, the data involved, the shape of the workflow, and the return. Deployment is left for later.' },
  { name: 'Decision', assignment: 'human', desc: 'Approve, keep in review, or decline. Admins decide; the AI plan informs the call but never makes it.' },
  { name: 'Routing', assignment: 'machine', desc: 'Ideas flow to the backlog with their plan attached, a daily digest carries them to the founder and the ops channel, and statuses flow back to the submitter.' },
  { name: 'Output', assignment: 'machine', desc: 'A full product plan per idea, generated the moment the idea is submitted, and a weekly summary of the themes running across recent ideas.' },
  { name: 'Delivery', assignment: 'machine', desc: 'The innovation backlog page, where every idea and plan is reviewable in one place, plus the 08:00 digest by email and Lark.' },
  { name: 'Measurement', assignment: 'machine', desc: 'Ideas submitted, in review, approved and declined, and the trends card on the Innovation cockpit, so the pipeline from suggestion to decision is visible.' },
]

export default function IdeasBacklogWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Innovation"
        title="Ideas Backlog"
        tldr="Anyone on the team submits an idea through the 5D framework, AI expands it into a full product plan, and admins triage a backlog where every idea arrives pre-thought."
        meta={[
          { label: 'Who can submit', value: 'Everyone' },
          { label: 'Plan per idea', value: 'AI-generated' },
          { label: 'Triage', value: 'Approve · Review · Decline' },
        ]}
        status="built"
      />

      {/* Swimlane */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The flow</span>
          <h2 className="section-title section-title--sm">
            From suggestion to decision
          </h2>
          <p className="section-sub u-mt-3">
            Most idea programs die between the suggestion and the evaluation, because evaluating raw ideas is
            expensive. Here the expansion work happens automatically, so triage is cheap and nothing rots in the inbox.
          </p>

          <div className="wf-lanes-head">
            <div className="wf-lane-label wf-lane-label-admin">Admin</div>
            <div className="wf-lane-label wf-lane-label-system">System + AI</div>
            <div className="wf-lane-label wf-lane-label-contractor">Team member</div>
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
                title: 'An idea goes through the 5Ds',
                actor: 'contractor',
                actorLabel: 'Team member',
                body: (
                  <p>
                    The submission form is the 5D framework we use for every AI program, one step per D: define the
                    problem, discover the data, design the workflow, and determine the return. Deploy is deliberately
                    skipped, because nobody knows deployment details at the backlog stage. Each step teaches its D and
                    takes voice dictation. A lighter form captures learnings (&ldquo;what have I learned?&rdquo;) for
                    the team feed. Structure at the front door means quality in the backlog.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Claude writes the product plan',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    The moment an idea is submitted, Claude expands it into a full product plan: a sharpened problem,
                    the simplest program type that solves it, the workflow, the data it needs, a FAST goal with a real
                    number, a first slice, and open questions. It also files the idea under one of the four offices
                    (revenue, talent, operations, innovation). If generation fails the idea is still safe in the backlog
                    and an admin can retry. The thinking that used to make evaluation expensive now costs nothing.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'The backlog assembles itself',
                actor: 'system',
                body: (
                  <p>
                    Idea and plan land in the innovation backlog together. Nothing needs to be chased, formatted, or
                    forwarded before it can be judged.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'Admins set the status',
                actor: 'human',
                actorLabel: 'Admin',
                body: (
                  <p>
                    Every idea moves from new to one of three calls: approved, in review, or declined. An admin can also
                    archive an idea, which hides it from everyone but its submitter. A declined idea keeps its plan, so
                    reviving it later starts from a draft instead of from zero.
                  </p>
                ),
              },
              {
                num: '05',
                title: 'The submitter sees the outcome',
                actor: 'contractor',
                actorLabel: 'Team member',
                body: (
                  <p>
                    The status of every idea is visible to the person who submitted it, on their own ideas page. People
                    keep contributing ideas when they can see the ideas going somewhere, and stop when they vanish into
                    a suggestion box.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* The routines */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The routines</span>
          <h2 className="section-title section-title--sm">
            Two agents keep the backlog in front of people
          </h2>
          <p className="section-sub u-mt-3">
            Both run as scheduled routines on Settings &rarr; Agents, and every run is recorded there. Times are Ho Chi
            Minh City.
          </p>
          <StepCards
            steps={[
              {
                num: '01',
                title: 'Ideas digest',
                cadence: 'Daily, 08:00',
                actor: 'system',
                body: (
                  <p>
                    Reads everything submitted to the backlog in the last 24 hours, build ideas and learnings, skipping
                    archived rows. If there is anything, it emails the founder a list with each submitter and takeaway
                    and a link to the backlog, and posts the same summary (first ten items) to the ops Lark channel. An
                    empty day sends nothing, so every message means something.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Idea trends',
                cadence: 'Weekly, Monday 10:00',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    Reads up to 80 ideas and learnings from the last 60 days and asks Claude for two to four themes
                    that run across multiple items, each a plain sentence with a rough count. The result is stored as a
                    new trends report and the Innovation cockpit renders the newest one. Fewer than three items, no
                    key, or an API error leaves the last report in place rather than overwriting it with nothing.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Anatomy + rules */}
      <section className="section">
        <div className="container">
          <SevenElements elements={ELEMENTS} />
          <div className="wf-info-grid">
            <div className="wf-info-card">
              <h3>The standing rules</h3>
              <ul>
                <li>Every idea goes through the first four Ds, no free-form pitches</li>
                <li>Every idea gets a full AI plan before any human evaluates it</li>
                <li>Triage is approve, keep in review, or decline; archive only hides</li>
                <li>Submitters always see the status of their own ideas</li>
                <li>The digest is silent on an empty day; the trends card is never blanked by a failed run</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Why it works</h3>
              <ul>
                <li>Cheap evaluation means no idea waits months for attention</li>
                <li>The 5D form filters vague wishes into real proposals</li>
                <li>Declined ideas keep their plans, so nothing is ever wasted work</li>
                <li>Visible outcomes keep the idea pipeline full</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
