import { gatedMetadata, gatedPage } from '../../gate'
import Link from 'next/link'

export const generateMetadata = gatedMetadata({
  title: 'Coaching Module — Plan | AI Officer Institute | Edge8',
  description:
    'Build plan for the Open Coaching module: surfaces, core flows, data model, rules and states, architecture fit, and phased delivery.',
  robots: { index: false, follow: false },
})

const DATA_MODEL: { entity: string; fields: string; notes: React.ReactNode }[] = [
  {
    entity: 'coaching_session',
    fields: 'id, starts_at, timezone, status, coach, focus_topic, recording_url, duration',
    notes: (
      <>
        status: <code className="app-code">scheduled → live → published</code>. A recurring slot
        generates these.
      </>
    ),
  },
  {
    entity: 'challenge',
    fields: 'id, session_id, member_id, title, description, vote_count, status, coached',
    notes: (
      <>
        Max 8 <code className="app-code">accepted</code> per session.{' '}
        <code className="app-code">member_id</code> = &ldquo;submitted by&rdquo;.{' '}
        <code className="app-code">coached</code> = did the submitter attend and get it discussed
        live (drives the coached / not-coached indicator).
      </>
    ),
  },
  {
    entity: 'challenge_vote',
    fields: 'challenge_id, member_id',
    notes: 'One vote per member per challenge; drives ranking.',
  },
  {
    entity: 'signup',
    fields: 'session_id, member_id, created_at',
    notes: 'Independent of submitting a challenge.',
  },
  {
    entity: 'attendance',
    fields: 'session_id, member_id, joined',
    notes: 'Populates the Archive attendee list.',
  },
  {
    entity: 'session_learning',
    fields: 'session_id, order, text',
    notes: 'Key learnings. Can be many → the detail page shows a preview and expands to a dedicated learnings page.',
  },
  {
    entity: 'session_resource',
    fields: 'session_id, label, kind, url',
    notes: 'kind: doc / slides / code / link.',
  },
]

const PHASES: { n: string; scope: string; status: React.ReactNode }[] = [
  {
    n: '0',
    scope: 'Static prototype — all three surfaces, interactions, session detail',
    status: <span className="app-badge app-badge-ok">Done ✓</span>,
  },
  { n: '1', scope: 'Read-only Upcoming + Archive wired to real sessions (no auth actions yet)', status: 'Next' },
  { n: '2', scope: 'Sign-up (one tap) + calendar invite / join link', status: 'Planned' },
  { n: '3', scope: 'Challenge submission + voting, with the 8-topic cap enforced server-side', status: 'Planned' },
  { n: '4', scope: 'Recording ingest → auto-publish, session detail (learnings, resources, attendees)', status: 'Planned' },
  { n: '5', scope: 'Second US time slot + weekly / published notifications', status: 'Later' },
]

const Flow = ({ steps }: { steps: string[] }) => (
  <div className="app-flow">
    {steps.map((s, i) => (
      <span key={s} className="u-contents">
        <span className="step">{s}</span>
        {i < steps.length - 1 && <span className="arrow">→</span>}
      </span>
    ))}
  </div>
)

export default gatedPage(function CoachingModulePlanPage() {
  return (
    <main>

      <section className="wf-hero">
        <div className="container">
          <div className="wf-hero-inner">
            <div className="wf-breadcrumb">
              <Link href="/workflows">Workflows</Link>
              <span>/</span>
              <Link href="/workflows/private">Private</Link>
              <span>/</span>
              <Link href="/workflows/private/ai-officer-institute">AI Officer Institute</Link>
              <span>/</span>
              <span>Coaching Module</span>
            </div>
            <h1 className="section-title">Coaching Module — build plan</h1>
            <p className="wf-hero-sub">
              Turning the Open Coaching prototype into a real product module: surfaces, core
              flows, the data model, rules and states, architecture fit in aiolabz-fe, and phased
              delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container u-max-8">
          {/* Goal */}
          <div className="app-section">
            <div className="app-kicker">Goal</div>
            <h2 className="app-h2">What we&rsquo;re building, and what &ldquo;done&rdquo; means</h2>
            <p className="app-lead">
              A coaching feature that lets any member sign up for the weekly session in one tap,
              optionally submit a challenge, and vote up the challenges they most want coached. The
              top topics get coached live; the recording lands in the Archive automatically with
              attendees, key learnings, video, and resources attached.
            </p>
            <ul className="app-list">
              <li>
                <strong>Cadence:</strong> every Thursday, 11:00 AM GMT+7. A second US-friendly time
                is expected later — the model must support multiple recurring slots.
              </li>
              <li>
                <strong>Open to all members:</strong> attendees can listen in and ask questions.
                Signing up does <em>not</em> require submitting a challenge.
              </li>
              <li>
                <strong>Max 8 topics per session:</strong> submissions are capped; the
                highest-voted are coached that day.
              </li>
              <li>
                <strong>Recorded &amp; published:</strong> each session is recorded and
                automatically added to the Archive.
              </li>
            </ul>
          </div>

          {/* Surfaces */}
          <div className="app-section">
            <div className="app-kicker">Surfaces</div>
            <h2 className="app-h2">Three screens, mirroring micro-sessions</h2>
            <div className="app-cards">
              <div className="app-card">
                <h3>Upcoming</h3>
                <p>
                  The next session: date/time, the running list of submitted challenges with vote
                  counts (0–8), a one-tap <em>Sign up</em>, and an optional{' '}
                  <em>Submit a challenge</em>. Shows the 8/8 &ldquo;full&rdquo; state.
                </p>
                <span className="tag">Prototype ✓</span>
              </div>
              <div className="app-card">
                <h3>Archive</h3>
                <p>
                  Every past session as a card — number, date, coach, topic count, attendee count —
                  filterable/searchable. Each opens a session detail page.
                </p>
                <span className="tag">Prototype ✓</span>
              </div>
              <div className="app-card">
                <h3>Session detail</h3>
                <p>
                  Recording (video); <strong>key learnings</strong> in a box that expands to its
                  own page when there are many; <strong>topics coached</strong> shown in full —
                  name, description, who submitted it, and a coached / not-coached indicator; then{' '}
                  <strong>attendees</strong> with <strong>additional resources beneath</strong>.
                </p>
                <span className="tag">Prototype ✓</span>
              </div>
            </div>
            <div className="app-callout">
              <strong>The prototype already covers all three surfaces</strong> and the core
              interactions (voting, 8-topic cap, sign-up without name/email, session detail). It is
              the visual spec for this build — see the Open Coaching prototype in the Prototypes
              tab.
            </div>
          </div>

          {/* Core flows */}
          <div className="app-section">
            <div className="app-kicker">Core flows</div>
            <h2 className="app-h2">The member journeys</h2>

            <p className="app-p">
              <strong>Sign up</strong> (member is already logged in — no name/email):
            </p>
            <Flow steps={['Open Upcoming', 'Tap “Sign up”', 'Pick session', 'Confirm', 'Calendar invite + join link']} />

            <p className="app-p">
              <strong>Submit &amp; vote</strong> (optional):
            </p>
            <Flow steps={['Submit challenge', 'Appears in list (if < 8)', 'Members upvote', 'Top topics coached live']} />

            <p className="app-p">
              <strong>After the session</strong> (mostly automated):
            </p>
            <Flow steps={['Session ends', 'Recording ingested', 'Auto-published to Archive', 'Learnings + resources added']} />
          </div>

          {/* Data model */}
          <div className="app-section">
            <div className="app-kicker">Data model</div>
            <h2 className="app-h2">Entities the backend needs</h2>
            <div className="app-table-scroll">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Entity</th>
                    <th>Key fields</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_MODEL.map((row) => (
                    <tr key={row.entity}>
                      <td>
                        <code className="app-code">{row.entity}</code>
                      </td>
                      <td>{row.fields}</td>
                      <td>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rules & states */}
          <div className="app-section">
            <div className="app-kicker">Rules &amp; states</div>
            <h2 className="app-h2">The edges that must be handled</h2>
            <ul className="app-list">
              <li>
                <strong>Topic cap:</strong> once 8 challenges are accepted, hide
                &ldquo;submit&rdquo; and show the full-session notice (submit for a later
                Thursday).
              </li>
              <li>
                <strong>Voting window:</strong> voting closes when the session goes live; ranking
                freezes for the record.
              </li>
              <li>
                <strong>Session lifecycle:</strong>{' '}
                <code className="app-code">scheduled → live → published</code>. Only published
                sessions appear in Archive.
              </li>
              <li>
                <strong>Members-only:</strong> the whole module is gated to signed-in members;
                respect iframe vs full-app auth.
              </li>
              <li>
                <strong>Loading &amp; error states:</strong> every query must render{' '}
                <code className="app-code">&lt;QueryErrorState onRetry /&gt;</code> on error (per
                repo rule) — never a blank Upcoming/Archive.
              </li>
              <li>
                <strong>Empty states:</strong> &ldquo;no challenges yet — be the first&rdquo;,
                &ldquo;no sessions archived yet&rdquo;.
              </li>
            </ul>
          </div>

          {/* Architecture fit */}
          <div className="app-section">
            <div className="app-kicker">Architecture fit</div>
            <h2 className="app-h2">Where it lives in aiolabz-fe</h2>
            <ul className="app-list">
              <li>
                <strong>Feature module:</strong>{' '}
                <code className="app-code">src/features/coaching/</code> — components, hooks
                (TanStack Query), services, types, stores,{' '}
                <code className="app-code">CoachingView.tsx</code>, following the existing feature
                pattern.
              </li>
              <li>
                <strong>Routes:</strong> a dashboard route for Upcoming/Archive and a
                session-detail route; reuse the micro-sessions layout so the two feel like
                siblings.
              </li>
              <li>
                <strong>Server state:</strong> TanStack Query only; UI state in a focused Zustand
                store if needed.
              </li>
              <li>
                <strong>Recording:</strong> video needs an authenticated signed-URL path — note the
                recently removed unauthenticated{' '}
                <code className="app-code">/api/videos/signed-url</code> route; the coaching player
                must use the secure pattern, not reintroduce that hole.
              </li>
              <li>
                <strong>Notifications:</strong> weekly reminder + &ldquo;recording published&rdquo;
                via the existing notifications feature.
              </li>
            </ul>
          </div>

          {/* Delivery */}
          <div className="app-section">
            <div className="app-kicker">Delivery</div>
            <h2 className="app-h2">Build in phases</h2>
            <div className="app-table-scroll">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Phase</th>
                    <th>Scope</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PHASES.map((p) => (
                    <tr key={p.n}>
                      <td>
                        <span className="app-num">{p.n}</span>
                      </td>
                      <td>{p.scope}</td>
                      <td>{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scope note */}
          <div className="app-section">
            <div className="app-callout">
              <strong>Companion documents.</strong> This is the build plan for the Open Coaching
              prototype (Prototypes tab) and a companion to the{' '}
              <Link
                href="/workflows/private/ai-officer-institute/ai-program-plan"
                className="wf-link-accent"
              >
                Video, Micro Sessions and Coaching
              </Link>{' '}
              program plan.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
})
