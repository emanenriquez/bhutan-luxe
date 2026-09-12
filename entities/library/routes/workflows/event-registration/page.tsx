import type { Metadata } from 'next'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'both', desc: 'An admin creates the event once; from then on, each registration is triggered by an attendee.' },
  { name: 'Inputs', assignment: 'machine', desc: 'The event record: name, date, capacity, price. One definition drives everything downstream.' },
  { name: 'Decision', assignment: 'machine', desc: 'Is there a seat, and is the payment confirmed? The database reserves the seat atomically; for a paid ticket, Stripe answers the second question and only its answer confirms the seat.' },
  { name: 'Routing', assignment: 'machine', desc: 'A free ticket is confirmed on the spot. A paid ticket holds its seat while the attendee checks out, and the Stripe webhook confirms it seconds after payment.' },
  { name: 'Output', assignment: 'machine', desc: 'A confirmed seat with a ticket code, tied to a real payment when the ticket has a price. Attendance and revenue are the same number.' },
  { name: 'Delivery', assignment: 'machine', desc: 'Stripe sends the receipt; Edge8 emails the ticket link once per seat; the roster on the admin event page updates as it happens.' },
  { name: 'Measurement', assignment: 'machine', desc: 'Registered, pending, waitlisted and checked-in seats against capacity, plus revenue collected per event, read live from the roster.' },
]

const title = 'Event Registration | Edge8 Workflows'
const description =
  'Admin creates an event, the public signs up, Stripe takes payment for paid tickets, a webhook confirms the seat. No human in the middle of the money.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/event-registration/' },
  openGraph: { title, description, url: '/workflows/event-registration/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function EventRegistrationWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Revenue"
        title="Event Registration"
        tldr="An admin creates the event once. From there the public signs up, a paid ticket goes through Stripe checkout and a webhook confirms the seat, a free ticket is confirmed on the spot. No human touches the money path."
        meta={[
          { label: 'Admin effort', value: 'Create once' },
          { label: 'Payment', value: 'Stripe checkout' },
          { label: 'Confirmation', value: 'Webhook (paid), instant (free)' },
        ]}
        status="planned"
      />

      {/* The flow */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The flow</span>
          <h2 className="section-title section-title--sm">
            One setup step, then hands off
          </h2>
          <p className="section-sub u-mt-3">
            The only human step is the first one. Everything between a visitor clicking register and a confirmed seat
            in the admin hub is automated.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Create the Event', cadence: 'Admin hub', actor: 'human', actorLabel: 'Admin' },
              { num: '02', title: 'Public Signup Page', cadence: 'Instant', actor: 'system' },
              { num: '03', title: 'Stripe Checkout', cadence: 'Paid tickets', actor: 'contractor', actorLabel: 'Attendee' },
              { num: '04', title: 'Webhook Confirms', cadence: 'Seconds later', actor: 'system' },
              { num: '05', title: 'Registration in Hub', cadence: 'Live view', actor: 'system' },
            ]}
          />
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
                title: 'Admin creates the event',
                cadence: 'Once per event',
                actor: 'human',
                actorLabel: 'Admin',
                body: (
                  <p>
                    Name, dates, location, capacity, and one or more ticket tiers with a price (or none). The event is
                    defined once in the admin hub, and that definition drives everything downstream: the public page,
                    the checkout, and the roster.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'The public page exists immediately',
                actor: 'system',
                body: (
                  <p>
                    A public signup page is generated from the event record, and it only takes registrations while the
                    event is open. There is no second copy of the details to keep in sync, so the page can never disagree
                    with the event.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Attendee pays through Stripe',
                actor: 'contractor',
                actorLabel: 'Attendee',
                body: (
                  <p>
                    Registration and payment are one motion. Submitting the form reserves the seat atomically against
                    capacity (a full tier says so, a full event waitlists). A paid ticket holds that seat for 30 minutes
                    while the attendee checks out through Stripe, which handles cards, receipts, and compliance. A free
                    ticket skips Stripe and is confirmed immediately. Nobody at Edge8 ever sees or handles card details.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'A webhook confirms the seat',
                actor: 'system',
                body: (
                  <p>
                    When Stripe confirms the payment, its webhook flips the held registration to registered and emails
                    the ticket link, once. Every write is guarded by the row&apos;s current status, so a redelivered
                    webhook repeats nothing, and an expired checkout releases the hold so the seat frees up. A paid seat
                    is only counted when the money is real, so the attendee list and the revenue never diverge.
                  </p>
                ),
              },
              {
                num: '05',
                title: 'Admins watch it live',
                actor: 'system',
                body: (
                  <p>
                    Every registration appears on the admin event roster as it happens: registered, pending payment,
                    waitlisted, checked in, and revenue collected, with a CSV export. Each registrant also enters the
                    CRM lead queue. Event day starts with a list that is already correct.
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
                <li>The event record is the single source for page, price, and capacity</li>
                <li>No payment, no paid seat: a held seat only counts once Stripe confirms; free tickets confirm instantly</li>
                <li>Card details never touch Edge8 systems</li>
                <li>The attendee list is read from the system, never kept in a spreadsheet</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Why it works</h3>
              <ul>
                <li>One definition drives everything, so nothing goes out of sync</li>
                <li>Webhook confirmation makes revenue and attendance the same number, and redeliveries are harmless</li>
                <li>Zero manual steps between signup and seat means zero backlog</li>
                <li>Admins spend event week on the event, not on reconciliation</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
