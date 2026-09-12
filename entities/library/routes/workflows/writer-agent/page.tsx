import type { Metadata } from 'next'
import Link from 'next/link'
import { WorkflowHero, FlowRail, StepCards, SevenElements, DetailFooter, type WorkflowElement } from '../ui'

const title = 'The Writer Agent | Edge8 Workflows'
const description =
  'One button on the campaign hub, or the schedule the day before a campaign date, starts a run that takes an idea to a finished, SEO-complete post and every channel post with it: draft, edit, SEO and AEO, exhibits, hero image, links, assemble, validate, channels, publish. Each step must pass its own check before the next starts, each hands the run on with one call, and each is its own run row with the tokens it cost. With auto-publish on the post goes live on its date and the campaign closes itself; without it the run parks at ready for a person.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/workflows/writer-agent/' },
  openGraph: { title, description, url: '/workflows/writer-agent/', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const ELEMENTS: WorkflowElement[] = [
  { name: 'Trigger', assignment: 'both', desc: 'A person presses Run the writer on a campaign that has a brand and a written idea, or the hourly schedule starts it the day before the campaign date. Either way a run starts because the idea was written and dated.' },
  { name: 'Inputs', assignment: 'both', desc: 'The idea and its sources, written by a person. The brand profile: voice, hard rules, editing lens, SEO lens, image style, channel rules and word range. The published post list for internal links.' },
  { name: 'Decision', assignment: 'both', desc: 'The model decides the words, the keyword, the figures and the quotes. The pipeline decides the order, refuses to skip, and rejects any output that breaks a house rule. A person decides whether the finished post goes live.' },
  { name: 'Routing', assignment: 'machine', desc: 'The step pointer lives on the campaign. After each passing step the function makes one authenticated call to its own route for the next step, so a run chains through with nothing polling.' },
  { name: 'Output', assignment: 'machine', desc: 'One blog asset: body, SEO package with five FAQ, two or more exhibits as PNG, a 16:9 hero, internal and source links, an Idea in Brief box and a verbatim pull quote. A dated change log on the asset, one block per step.' },
  { name: 'Delivery', assignment: 'both', desc: 'The run parks at ready and the ops channel hears once. A person opens the post from the hub and publishes it with the same button they always had. A brand with auto-publish switched on skips that step: a post dated today goes live at once, a post dated later is scheduled and the daily publish routine puts it live that morning.' },
  { name: 'Measurement', assignment: 'machine', desc: 'One routine run row per step on Settings → Agents, with the model tokens it cost, so the price of a post is a number per step, not a monthly surprise.' },
]

const EXCEPTIONS = [
  { when: 'The campaign has no brand or no written idea', then: 'The button is disabled; a run cannot start', heard: 'The hub, before anything runs' },
  { when: 'The brand profile states no blog word range', then: 'Draft fails with the text to add under Marketing > Brands', heard: 'Lark ops message, the hub' },
  { when: 'The draft misses a channel the brand asks for, or the blog is outside the word range', then: 'Draft fails; nothing is stored, so a retry drafts again rather than editing a short post into shape', heard: 'Lark ops message, the hub' },
  { when: 'Any step returns an em dash, audit or hiring language, or the brand name misspelled', then: 'That step fails with every rule it broke', heard: 'Lark ops message, the hub' },
  { when: 'The slug is invalid or another post already owns it', then: 'SEO fails; the package is not written', heard: 'Lark ops message, the hub' },
  { when: 'An exhibit shows a number the body never states', then: 'Exhibits fails; an exhibit illustrates, it never introduces a fact', heard: 'Lark ops message, the hub' },
  { when: 'An exhibit references external content (a script, an image, a URL)', then: 'Exhibits fails before rendering', heard: 'Lark ops message, the hub' },
  { when: 'Fewer than two internal links land on phrases already in the body', then: 'Links fails; the model never proposes new wording', heard: 'Lark ops message, the hub' },
  { when: 'No pull quote can be verified verbatim against the idea’s sources', then: 'Assemble fails', heard: 'Lark ops message, the hub' },
  { when: 'The sanitizer drops a block on render', then: 'Assemble fails naming the block, so a broken post never reaches validate', heard: 'Lark ops message, the hub' },
  { when: 'Validate finds any publish or process error', then: 'The run stops with every failure listed; nothing is parked at ready', heard: 'Lark ops message, the hub' },
  { when: 'A retry runs exhibits or assemble again', then: 'Old figures, brief, quotes and FAQ are stripped first; nothing stacks', heard: 'Nowhere, by design' },
  { when: 'A hand-off between steps is dropped', then: 'The run sits on its current step with no error; Continue hands it on again', heard: 'The hub shows the step, still marked running' },
  { when: 'A person presses Stop', then: 'The run ends; the assets keep what the steps so far wrote', heard: 'The hub' },
]

export default function WriterAgentWorkflowPage() {
  return (
    <main>
      <WorkflowHero
        category="Revenue"
        title="The Writer Agent"
        tldr="A good post is not one model call; it is eight passes, each with its own lens and its own check. This agent runs them in the brand&rsquo;s own order, one function per step, and refuses to move on until the step holds. What comes out is a post with figures, links, a FAQ and a hero, waiting on the hub for a person to read it and press Publish."
        status="built"
        meta={[
          { label: 'Trigger', value: 'Run the writer, on the campaign hub' },
          { label: 'Steps', value: 'Eleven, one function each' },
          { label: 'Human touchpoints', value: 'The idea, the Publish button' },
        ]}
      />

      {/* Orientation */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">The shape, in ten seconds</span>
          <h2 className="section-title section-title--sm">An idea in, a publishable post out</h2>
          <p className="section-sub u-mt-3">
            Seven model passes and one pure check between the button and the approver. The brand profile is the
            spec: the pipeline hard-codes no word count, no channel list and no lens; it reads them from the profile
            and fails a step whose rule is missing.
          </p>
          <FlowRail
            steps={[
              { num: '01', title: 'Idea and Brand', cadence: 'Written by a person', actor: 'human', actorLabel: 'Marketer' },
              { num: '02', title: 'Draft', cadence: 'Every active channel', actor: 'ai', actorLabel: 'Claude' },
              { num: '03', title: 'Edit', cadence: 'The editing lens', actor: 'ai', actorLabel: 'Claude' },
              { num: '04', title: 'SEO and AEO', cadence: 'Slug, keyword, five FAQ', actor: 'ai', actorLabel: 'Claude' },
              { num: '05', title: 'Exhibits', cadence: 'Two or three figures', actor: 'ai', actorLabel: 'Claude' },
              { num: '06', title: 'Hero Image', cadence: '16:9', actor: 'ai', actorLabel: 'Gemini' },
              { num: '07', title: 'Links', cadence: 'Internal and source', actor: 'ai', actorLabel: 'Claude' },
              { num: '08', title: 'Assemble', cadence: 'The house format', actor: 'ai', actorLabel: 'Claude' },
              { num: '09', title: 'Validate', cadence: 'Zero errors or stop', actor: 'system' },
              { num: '10', title: 'Channels', cadence: 'Email, LinkedIn, Facebook', actor: 'ai', actorLabel: 'Claude' },
              { num: '11', title: 'Publish', cadence: 'On the date, or by a person', actor: 'system' },
            ]}
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
                title: 'The idea and the brand',
                cadence: 'Before the button',
                actor: 'human',
                actorLabel: 'Marketer',
                body: (
                  <p>
                    A campaign needs two things before the button is live: a brand, whose profile carries the voice,
                    hard rules, lenses, image style and word range; and a written idea with its sources, which is the
                    only material the model may quote or cite. Pressing Run the writer sets the step pointer to draft
                    and runs the first step in the same request, so the hub shows movement at once.
                  </p>
                ),
              },
              {
                num: '02',
                title: 'Draft',
                cadence: 'Claude, one call',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    The brand writer drafts every channel the profile lists as active (the blog always, plus email,
                    LinkedIn or Facebook when the profile says so), each with an image brief. The step passes only when
                    every asked-for channel came back, the blog sits inside the brand&rsquo;s word range and carries no
                    em dash. Nothing is stored on a failed check, so a retry drafts again rather than editing a short
                    post into shape.
                  </p>
                ),
              },
              {
                num: '03',
                title: 'Edit',
                cadence: 'Claude, one call',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    One pass with the brand&rsquo;s editing lens: editor, not author. The model returns the edited body
                    and a change log of what was cut, moved or sharpened, and may add no fact that is not in the post
                    or its sources. The server checks the house rules and the word range and requires a non-empty log,
                    then writes the body and appends the log to the asset&rsquo;s notes.
                  </p>
                ),
              },
              {
                num: '04',
                title: 'SEO and AEO',
                cadence: 'Claude, one call',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    The search package as fields: a keyword-led title tag split from the H1, a meta description, a
                    kebab-case slug, primary and secondary keywords, an excerpt, a category, and five FAQ questions an
                    AI assistant would extract, the first starting with How or What and carrying the primary keyword
                    verbatim. The server writes it in the one labelled format the publish gate reads and fails the step
                    if the slug is taken, the title tag is the generic pattern, or the package does not parse back.
                  </p>
                ),
              },
              {
                num: '05',
                title: 'Exhibits',
                cadence: 'Claude, then resvg',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    Two or three figures as self-contained SVG in the brand palette, each anchored to an existing
                    heading. The server rejects any SVG that references external content, checks that every number in
                    the figure&rsquo;s text is stated in the body, renders each to PNG, uploads it, and places a figure
                    block under the named heading. A retry strips the old figures first, so nothing stacks.
                  </p>
                ),
              },
              {
                num: '06',
                title: 'Hero image',
                cadence: 'Gemini image model',
                actor: 'ai',
                actorLabel: 'Gemini',
                body: (
                  <p>
                    The hero at 16:9 from the image brief the draft wrote and the brand&rsquo;s image style, generated
                    by the image model the rest of the marketing hub uses. The step passes when the new version is
                    recorded and is the asset&rsquo;s selected image; a generated image that did not land as the
                    selection fails the step.
                  </p>
                ),
              },
              {
                num: '07',
                title: 'Links',
                cadence: 'Claude, one call',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    Two to four related published posts, each linked from a phrase already in a body paragraph, and one
                    link per source URL the idea supplies at its first mention. The model picks phrases; the server
                    does the wrapping, so the anchor text is always the author&rsquo;s words. The step fails if fewer
                    than two internal links could be placed, if any link points at an audit page, or if the reader&rsquo;s
                    text changed by a character.
                  </p>
                ),
              },
              {
                num: '08',
                title: 'Assemble',
                cadence: 'Claude, one call',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    The house format. An Idea in Brief box (problem, insight, way forward) before the first heading,
                    one to three pull quotes copied verbatim from the idea&rsquo;s sources and placed under the heading
                    that discusses them, and the five-item FAQ at the end. A quote the server cannot find verbatim in
                    the idea is dropped; if none survive, the step fails. The assembled body is then rendered through
                    the real sanitizer and the step passes only if every block came through: one brief, five FAQ items,
                    at least one blockquote, and every figure the exhibits step placed.
                  </p>
                ),
              },
              {
                num: '09',
                title: 'Validate',
                cadence: 'No model',
                actor: 'system',
                body: (
                  <p>
                    The publish gate plus the process checks, run once more on the finished body: presence of body,
                    SEO package and hero; a free slug; the word range; no em dash, no audit or hiring language, the
                    brand name spelled Edge8; exactly one Idea in Brief; at least two exhibits; a pull quote; at least
                    two bolded data points; and the FAQ rule. Zero errors, or the run stops here with every failure
                    listed. For a brand without the auto-publish switch the run parks at ready here and the ops
                    channel hears once; with the switch on, the run carries on.
                  </p>
                ),
              },
              {
                num: '10',
                title: 'Channels',
                cadence: 'Claude, then an image per channel',
                actor: 'ai',
                actorLabel: 'Claude',
                body: (
                  <p>
                    The email, LinkedIn and Facebook posts, written from the final validated article rather than the
                    first draft, each per its channel rules and each with an image from its own brief. The post&apos;s
                    URL is known from its slug, so the channels can link to it before it is live. With auto-publish on
                    the channel assets are approved as written, so the campaign reads as built.
                  </p>
                ),
              },
              {
                num: '11',
                title: 'Publish',
                cadence: 'On the date, or by a person',
                actor: 'system',
                body: (
                  <p>
                    Without the switch, a person reads the post on the hub and presses the same Publish button the hub
                    always had. With it, the pipeline finishes the job: a post dated today goes live at once and the
                    live URL is confirmed; a post dated later is scheduled and the daily publish routine puts it live
                    that morning. Either way the campaign is marked done on the day its post goes live.
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
            A run stops at the first step whose check fails, writes the error on the campaign, and tells the ops
            channel once. Nothing retries on its own. The hub offers three verbs: Retry step, Continue, Stop.
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
                <li>Reads: the campaign (idea, objective, brand, pillar); the brand profile; the campaign&rsquo;s blog asset; the published post list; existing slugs</li>
                <li>Writes: the blog asset&rsquo;s body, title, SEO package, image brief, hero and notes; exhibit PNGs in the asset&rsquo;s folder; the step pointer, error and start time on the campaign; one routine run row per step</li>
                <li>Models: seven steps run on the frontier tier with a structured-output schema at high effort; the hero runs on the image model; validate calls no model</li>
                <li>Every model call is structured output only: the pipeline, not the model, decides what runs next</li>
              </ul>
            </div>
            <div className="wf-info-card">
              <h3>Timing model</h3>
              <ul>
                <li>On demand only. There is no schedule; the route sits under the cron path because it shares the cron bearer and the run log</li>
                <li>The first step runs inside the button&rsquo;s request; each passing step then makes one authenticated call to its own route for the next</li>
                <li>One step per function call, so every step fits the platform&rsquo;s request limit and gets its own run row</li>
                <li>The run parks at ready; nothing moves it past that state except a person, or the brand&rsquo;s auto-publish switch</li>
                <li>Run the writer again restarts from draft and rewrites the post</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>How we know it works</h3>
              <ul>
                <li>Every check is a pure function over markdown with a test that proves it blocks</li>
                <li>The change log on the asset says what each pass did, so a bad edit can be traced to its step</li>
                <li>Settings → Agents shows the run per step with its tokens; the cost of a post is a sum, not a guess</li>
                <li>A run that stops is loud; a run that parks is loud once; silence means nobody pressed the button</li>
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
            The posts this agent finishes are what{' '}
            <Link href="/workflows/letter-agent" className="u-accent">
              the letter agent
            </Link>{' '}
            picks from every Monday, and the publish button it stops at is the one described in{' '}
            <Link href="/workflows/blog-publishing" className="u-accent">
              Blog Publishing
            </Link>
            . Same pattern in each: the machine does the passes, a person does the deciding.
          </p>
          <DetailFooter />
        </div>
      </section>
    </main>
  )
}
