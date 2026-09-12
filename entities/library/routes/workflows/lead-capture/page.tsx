import type { Metadata } from 'next'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'machine', desc: 'A submission on the website contact form, the one front door for every inquiry.' },
  { name: 'Inputs', assignment: 'machine', desc: 'The form fields plus any existing CRM history for that person or company.' },
  { name: 'Decision', assignment: 'both', desc: 'The spam gate decides what enters; humans decide how qualified leads move through the pipeline.' },
  { name: 'Routing', assignment: 'machine', desc: 'Real inquiries route into the CRM; junk is dropped at the door with a line in the server log, and the bot is shown success so it moves on.' },
  { name: 'Output', assignment: 'machine', desc: 'A deduplicated person record with lead state, a 4-hour response clock, and the full inquiry attached.' },
  { name: 'Delivery', assignment: 'machine', desc: 'The lead appears in the admin pipeline views the moment it exists, the ops Lark channel gets a ping, and the admin inbox gets the inquiry by email.' },
  { name: 'Measurement', assignment: 'machine', desc: 'Lead stages and conversion through the funnel, read live from the CRM, never assembled by hand.' },
]

const title = 'Lead Capture to CRM | Edge8 Workflows'
const description =
  'From a form submission to a customer record: a spam gate drops the noise automatically, and every real inquiry becomes a tracked lead in the CRM.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/lead-capture/' },
  openGraph: { title, description, url: '/workflows/lead-capture/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function LeadCaptureWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Revenue"
        title="Lead Capture to CRM"
        tldr="From a form submission to a customer record. A spam gate drops the noise before a human ever sees it, and every real inquiry becomes a tracked lead with a lifecycle and a 4-hour response clock."
        meta={[
          { label: 'Spam handling', value: 'Automatic' },
          { label: 'Manual data entry', value: '0 fields' },
          { label: 'Customer =', value: 'Won deal' },
        ]}
        status="planned"
      />

      {/* The flow */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The flow</span>
          <h2 className="section-title section-title--sm">
            Six steps from form to customer
          </h2>
          <p className="section-sub u-mt-3">
            The gate does the dirty work up front. Everything that survives it is a real person, already in the CRM,
            already assigned a stage.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Form Submission', cadence: 'Website', actor: 'contractor', actorLabel: 'Visitor' },
              { num: '02', title: 'Spam Gate', cadence: 'Automatic', actor: 'system' },
              { num: '03', title: 'Inquiry Created', cadence: 'Automatic', actor: 'system' },
              { num: '04', title: 'Lead Record', cadence: 'Automatic', actor: 'system' },
              { num: '05', title: 'Lifecycle Stages', cadence: 'Human-driven', actor: 'human' },
              { num: '06', title: 'Won = Customer', cadence: 'Deal closes', actor: 'human' },
            ]}
          />
          <div className="wf-loop-note">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>
              Submissions that fail the gate are dropped, not stored: the gate is tuned for precision, so it only fires
              on the two tells a real person never produces (a random-token name, a non-deliverable Gmail address), and
              every block is written to the server log so the gate stays auditable.
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
            How each step works
          </h2>
          <StepCards
            steps={[
              {
                num: '01',
                title: 'A visitor submits the contact form',
                actor: 'contractor',
                actorLabel: 'Visitor',
                body: (
                  <p>
                    Every inquiry enters through one form on the website. One front door means one pipeline to secure,
                    measure, and improve.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'The spam gate decides',
                actor: 'system',
                body: (
                  <>
                    <p>
                      Before anything touches the CRM, two automatic checks evaluate the submission: a hidden honeypot
                      field for naive bots, and a precision-tuned gate for the form-spam wave that fills visible fields
                      with random tokens. Real inquiries pass through untouched. Junk gets a silent success response and
                      creates nothing, with a line in the server log.
                    </p>
                    <div className="wf-outcomes">
                      <span className="wf-outcome wf-outcome-approve">Pass → CRM</span>
                      <span className="wf-outcome wf-outcome-reject">Spam → Dropped, logged</span>
                    </div>
                  </>
                ),
              },
              {
                num: '03',
                title: 'An inquiry is created',
                actor: 'system',
                body: (
                  <p>
                    Passing submissions become inquiry records automatically: who wrote, their company and team size,
                    what they asked, and when. The same submission pings the ops Lark channel and is emailed to the admin
                    inbox, so nobody copy-pastes from an inbox, ever.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'The person becomes a lead',
                actor: 'system',
                body: (
                  <p>
                    The system finds or creates the person&apos;s CRM record by email and promotes them to a new lead with
                    a 4-hour speed-to-lead clock. If they are already an active lead, or already a customer with an open
                    or won deal, nothing is demoted; the inquiry just joins their history. One person, one record, no
                    duplicates.
                  </p>
                ),
              },
              {
                num: '05',
                title: 'The lead moves through lifecycle stages',
                actor: 'human',
                body: (
                  <p>
                    From here humans take over: qualify, converse, propose. The lead&apos;s stage is updated in the CRM
                    as it moves, so the pipeline view is always the truth, not a weekly guess.
                  </p>
                ),
              },
              {
                num: '06',
                title: 'A won deal makes a customer',
                actor: 'human',
                body: (
                  <p>
                    Customer is not a label anyone types. It is a state the company record earns when a deal is won.
                    The definition is structural, so reports never argue about who counts.
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
                <li>One form, one pipeline, no side doors</li>
                <li>Spam is dropped at the door and logged; the gate is tuned so a real inquiry is never dropped</li>
                <li>People are deduplicated by email, by the system, not by memory</li>
                <li>Customer status comes from won deals, not from a checkbox</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Why it works</h3>
              <ul>
                <li>Humans only ever see real inquiries, so response time stays fast</li>
                <li>Zero manual entry means the CRM never drifts from reality</li>
                <li>Every blocked submission is logged, so the gate is accountable</li>
                <li>Structural definitions make every pipeline report trustworthy</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
