import type { Metadata } from 'next'
import Link from 'next/link'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const title = 'QuickBooks Invoice Sync | Edge8 Workflows'
const description =
  'A weekly sync pulls every invoice out of QuickBooks and maps it to the CRM, so revenue truth lives in one place instead of two tabs.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/invoice-sync/' },
  openGraph: { title, description, url: '/workflows/invoice-sync/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'machine', desc: 'Two routines fire every Monday: the token keepalive at 12:00 (+07), the invoice sync at 12:30. No one remembers to run them because no one has to.' },
  { name: 'Inputs', assignment: 'machine', desc: 'Invoices since January 2025 from each connected QuickBooks company (Edge8 and AIO), and the customer-to-company mapping kept on each CRM company record.' },
  { name: 'Decision', assignment: 'both', desc: 'Which QuickBooks customer belongs to which CRM company. Mapped by a human once, from the invoices page, applied by the machine forever.' },
  { name: 'Routing', assignment: 'machine', desc: 'Every invoice is upserted by its QuickBooks id, nothing is ever deleted, and an unmapped customer is stored with no company and reported rather than guessed.' },
  { name: 'Output', assignment: 'machine', desc: 'A complete, current invoice ledger inside the admin, attached to the right companies, with paid, open, overdue and voided derived from the balance.' },
  { name: 'Delivery', assignment: 'machine', desc: 'The revenue dashboard and the invoices page read directly from the synced ledger. No exports, no spreadsheets.' },
  { name: 'Measurement', assignment: 'machine', desc: 'Every run logs fetched, upserted and unmapped counts per company on Settings → Agents; a failed sync or a dying token warns the ops Lark chat.' },
]

export default function InvoiceSyncWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Operations"
        title="QuickBooks Invoice Sync"
        status="built"
        tldr="A weekly sync pulls every invoice out of QuickBooks and maps it to the CRM, so revenue truth lives in one place. The books stay the source of truth; the CRM stays current without anyone copying numbers."
        meta={[
          { label: 'Cadence', value: 'Every Monday, 12:30 (+07)' },
          { label: 'Manual copying', value: '0' },
          { label: 'Source of truth', value: 'QuickBooks' },
        ]}
      />

      {/* The flow */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The flow</span>
          <h2 className="section-title section-title--sm">
            Four steps, once a week, unattended
          </h2>
          <p className="section-sub u-mt-3">
            This is the automation behind our <Link href="/workflows/monthly-invoicing">Monthly Invoicing</Link>{' '}
            cadence: humans run the billing rhythm, the sync keeps every system telling the same story.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Monday Sync Fires', cadence: '12:30 (+07), after the token keepalive', actor: 'system' },
              { num: '02', title: 'Pull from QuickBooks', cadence: 'Automatic', actor: 'system' },
              { num: '03', title: 'Map to CRM Companies', cadence: 'Automatic', actor: 'system' },
              { num: '04', title: 'Revenue Dashboard', cadence: 'Always current', actor: 'system' },
            ]}
            repeatNote="Runs every week. Unmapped customers are the only thing a human ever touches."
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
                title: 'The sync fires on schedule',
                cadence: 'Monday, 12:30 (+07)',
                actor: 'system',
                body: (
                  <p>
                    Two routines run every Monday. At 12:00 a token keepalive refreshes each connected company&apos;s
                    QuickBooks connection, because Intuit retires an idle refresh token after about a hundred days; it
                    warns the ops Lark chat if a refresh fails or the token has under two weeks left. At 12:30 the
                    invoice sync runs on the fresh tokens. Weekly is deliberate: fresh enough that the dashboard is
                    trusted, calm enough that the books close before the numbers move. An admin can also press Sync on
                    the invoices page between runs.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Invoices come out of QuickBooks',
                actor: 'system',
                body: (
                  <p>
                    Every invoice dated since January 2025 is pulled from each connected company, Edge8 and AIO: new
                    ones, updated ones, payments applied. Each is upserted by its QuickBooks id and its status is
                    derived from the balance and due date, so nothing is ever deleted and a paid invoice flips on the
                    next pass. QuickBooks remains the accounting source of truth. The sync never writes back to it.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Each invoice maps to a CRM company',
                actor: 'system',
                body: (
                  <p>
                    The mapping from QuickBooks customer to CRM company lives on the company record, set once by an
                    admin from the invoices page, so each invoice lands on the right company&apos;s page. A customer
                    without a mapping is stored with no company and counted in the run result instead of being
                    guessed; mapping it later attaches its invoices on the next pass. Most AIO customers are
                    individuals and stay unmapped by design.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'Revenue reads from one place',
                actor: 'system',
                body: (
                  <p>
                    Dashboards, client pages, and revenue reviews all read from the synced ledger. When someone asks
                    what a client is worth this year, the answer comes from one system, and it agrees with the books.
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
                <li>QuickBooks is the source of truth; the sync only reads</li>
                <li>Mapping decisions are made by humans, once, and remembered</li>
                <li>Unmapped customers get reported, never guessed; a company that is not connected stays quiet</li>
                <li>Nobody copies invoice numbers between systems, ever</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Why it works</h3>
              <ul>
                <li>One truth ends the weekly &ldquo;which number is right?&rdquo; conversation</li>
                <li>Client revenue history sits next to the relationship, where decisions happen</li>
                <li>A weekly pass catches drift the week it appears, not at year end</li>
                <li>The finance team&apos;s tool stays theirs; everyone else gets a live view</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
