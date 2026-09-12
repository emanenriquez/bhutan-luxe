import type { Metadata } from 'next'
import Link from 'next/link'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'human', desc: 'The content calendar or an ad hoc idea. Content starts with a human wanting to say something.' },
  { name: 'Inputs', assignment: 'both', desc: 'The approved copy, the hero image, and the SEO plan (slug, title tag, meta description) the writer agent drafted and a human signed off.' },
  { name: 'Decision', assignment: 'human', desc: 'The approval gate: a human reviews the post, sets its publish date, and moves it to scheduled. Nothing ships without it.' },
  { name: 'Routing', assignment: 'machine', desc: 'The asset’s brand decides the destination site. A brand without a live blog is refused, never published to the wrong domain.' },
  { name: 'Output', assignment: 'machine', desc: 'A live post page, a refreshed blog index, sitemap and llms.txt, and the asset stamped published with its live URL.' },
  { name: 'Delivery', assignment: 'machine', desc: 'A daily routine publishes whatever is scheduled and due, then fetches the live URL to prove it. No manual upload, no deploy.' },
  { name: 'Measurement', assignment: 'machine', desc: 'The run log on Settings → Agents (checked, published, failed per run), the audit row per post, and the ops Lark message naming every post that went live or was held.' },
]

const title = 'How We Publish | Edge8 Workflows'
const description =
  'The four-stage pipeline behind every post on this site. A human creates and approves the content, a scheduled routine validates, publishes, verifies and reports the rest.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/blog-publishing/' },
  openGraph: { title, description, url: '/workflows/blog-publishing/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function BlogPublishingWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Operations"
        title="How We Publish"
        status="built"
        tldr="Four stages from idea to live post. A human creates the content and gives one approval: a publish date and a move to scheduled. A daily routine handles everything after that: validation, the live page, the index, and the report."
        meta={[
          { label: 'Human steps', value: '2' },
          { label: 'Automated steps', value: '2' },
          { label: 'Publish run', value: 'Daily, 11:00 (+07)' },
        ]}
      />

      {/* The pipeline */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The pipeline</span>
          <h2 className="section-title section-title--sm">
            Human in front, routine behind
          </h2>
          <p className="section-sub u-mt-3">
            The handoff is a status change: a human sets the publish date and moves the post to scheduled. Everything
            before it is human judgment. Everything after it is automated.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Content Creation', cadence: 'Calendar or ad hoc', actor: 'human' },
              { num: '02', title: 'Content Approval', cadence: 'The handoff', actor: 'human' },
              { num: '03', title: 'Scheduled Publish', cadence: 'Daily, 11:00 (+07)', actor: 'system' },
              { num: '04', title: 'Verify & Report', cadence: 'Same run', actor: 'system' },
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
            The four stages
          </h2>
          <StepCards
            steps={[
              {
                num: '01',
                title: 'Content Creation',
                cadence: 'Calendar or ad hoc',
                actor: 'human',
                body: (
                  <p>
                    Posts start as blog entries on the marketing calendar, from the content plan or an ad hoc idea. The
                    drafting itself is the <Link href="/workflows/writer-agent">writer agent</Link>&apos;s job: it
                    drafts, edits, optimises, illustrates and assembles the post step by step, and hands the result to a
                    human. No publishing happens here, just the asset taking shape.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Content Approval',
                cadence: 'The handoff',
                actor: 'human',
                body: (
                  <p>
                    The final human review. The reviewer reads the copy, checks the hero image and the SEO plan, sets
                    the publish date, and moves the asset to <strong>scheduled</strong>. That status is the approval;
                    the routine never touches a post that is not scheduled. An admin who wants it live now can press
                    Publish instead, which runs the same core the routine does.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Scheduled Publish',
                cadence: 'Daily, 11:00 (+07)',
                actor: 'system',
                body: (
                  <>
                    <p>Once a day the routine picks up every scheduled blog asset whose publish date has arrived and runs each through the same deterministic publish:</p>
                    <ul>
                      <li>Resolves the destination site from the asset&apos;s brand; a brand without a live blog is refused</li>
                      <li>Validates: body copy of at least 600 words, a hero image, an FAQ, and an SEO plan with a unique kebab-case slug, a title tag and a meta description</li>
                      <li>Normalises the SEO plan into columns (slug, title tag, excerpt, keyword, category, read time) and flips the status to published</li>
                      <li>Revalidates the post page, the blog index, the sitemap and llms.txt, so the post is live the moment the run ends</li>
                    </ul>
                    <p className="u-mt-3">
                      A post that fails validation stays scheduled, is retried on the next run, and is named in the
                      report. A bad post never silently disappears.
                    </p>
                  </>
                ),
              },
              {
                num: '04',
                title: 'Verify & Report',
                cadence: 'Same run',
                actor: 'system',
                body: (
                  <p>
                    After publishing, the routine fetches the live URL and stamps it on the asset when it answers. Each
                    run is recorded on Settings &rarr; Agents with how many posts it checked, published and failed,
                    and every published post gets an audit row. When anything happened, the ops Lark chat gets one
                    message listing what went live with its URL and what was held back with the reasons. When nothing
                    is due, the run says so and sends nothing.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Quality gates */}
      <section className="section">
        <div className="container">
          <SevenElements elements={ELEMENTS} />
          <div className="wf-info-grid">
            <div className="wf-info-card">
              <h3>Quality gates before anything ships</h3>
              <ul>
                <li>Only blog assets, only when scheduled and due</li>
                <li>A hero image, at least 600 words, and an FAQ block for structured data</li>
                <li>A valid slug nobody else is using, a title tag and a meta description</li>
                <li>A brand with a live blog to publish to, or the post is refused</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Why it works</h3>
              <ul>
                <li>One approval gate keeps humans in control of what gets said</li>
                <li>The button and the routine share one publish core, so the result is identical either way</li>
                <li>The run log and the audit row mean every post can be traced to a run</li>
                <li>Writers write. Nobody hand-edits pages or deploys anything.</li>
              </ul>
            </div>
          </div>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
