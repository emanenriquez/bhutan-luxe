import { gatedMetadata, gatedPage } from '../../gate'
import { WorkflowHero, FlowRail } from '../../../ui'

export const generateMetadata = gatedMetadata({
  title: '8 Edges: Open Source System | Edge8',
  description:
    'How the 8 Edges repositories relate, which one is the source of truth, and how releases flow to demos, clients, and Edge8 itself.',
  robots: { index: false, follow: false },
})

const RULES: [string, string][] = [
  [
    'Customization lives in config and data, not in edited core files',
    'Every core file a fork edits turns the next upstream sync into a merge-conflict job. The public repo grows extension points (config, theme, env, plugin hooks) so full-service setups never touch core.',
  ],
  [
    'Releases are the only delivery vehicle',
    'Tagged versions on the public repo, a changelog, and migration scripts for anything touching the Supabase schema. Forks update from tag to tag, never from random commits on main.',
  ],
  [
    'Product fixes go upstream first',
    'A bug found in a client fork, or in our own, is fixed in the public repo, then flows back down through the next release. Fixing it only in the fork creates drift we pay for forever.',
  ],
  [
    'One fork per client, forever',
    'Clients are literal GitHub forks. The fork is the client record: its distance from the latest tag is the health metric.',
  ],
  [
    'Demos are full-service clients of ourselves',
    'Auto-synced on every release so sales never shows stale product.',
  ],
]

const TIERS: [string, string, string][] = [
  [
    'Free / DIY',
    'The repo, release notes, migration scripts, a documented one-command update flow.',
    'Nothing per client. Write good release notes once.',
  ],
  [
    'Community',
    'DIY plus a support channel and an installable GitHub Action that opens an "upstream sync" PR on their fork at each release.',
    'Answer questions. They merge their own sync PRs.',
  ],
  [
    'Full service',
    'We maintain the fork end to end.',
    'A scheduled job fans out sync PRs from a registry of full-service forks; we merge, run migrations, verify the deploy. This is the retainer on top of the $15k setup.',
  ],
  [
    'Demos',
    'Same machinery as full service, pointed at ourselves.',
    'Auto-merge the sync PR, reseed sample data if the schema moved.',
  ],
  [
    'Edge8 fork',
    'Same machinery as full service.',
    'Sync first, before any client. If our own upgrade hurts, the release is not ready to fan out.',
  ],
]

export default gatedPage(function OpenSourceSystemPage() {
  return (
    <main>
      <WorkflowHero
        category="8 Edges · System Design"
        title="The 8 Edges open source system"
        tldr="One public upstream repo, and everything else is a fork of it: demos, client deployments, and Edge8 itself. We run our own company on the spine, so we are downstream of the product we sell, and every release proves the client update path before a client touches it."
        meta={[
          { label: 'Owner', value: 'Dave (sponsor)' },
          { label: 'Status', value: 'Draft v1 for review' },
          { label: 'Home', value: '8 Edges · GitHub' },
          { label: 'Decision', value: 'Open-source-first' },
        ]}
      />

      {/* 01 THE MAP */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">01 · The map</span>
          <h2 className="section-title section-title--sm">
            One public upstream, everything else is a fork
          </h2>

          <div
            className="wf-info-card u-mt-6 u-p-5 u-x-scroll"
          >
            <svg
              viewBox="0 0 760 460"
              className="wf-diagram" // layout-ok: one-off SVG diagram, block display + min width for horizontal scroll
              xmlns="http://www.w3.org/2000/svg"
              fontFamily="var(--font-body)"
              role="img"
              aria-label="Fork topology: the public 8 Edges repo is upstream of the Edge8 fork, demo forks, and client forks, with clients split into free, community, and full service tiers"
            >
              <defs>
                <marker
                  id="arr"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--body-text)" />
                </marker>
              </defs>

              <rect x="240" y="12" width="280" height="78" rx="16" fill="var(--dark)" />
              <text x="380" y="45" textAnchor="middle" fill="var(--white)" fontSize="17" fontWeight="700">
                8 Edges Open Source
              </text>
              <text x="380" y="68" textAnchor="middle" fill="var(--mint)" fontSize="12.5">
                public GitHub repo · upstream · zero Edge8 references
              </text>

              <text x="380" y="120" textAnchor="middle" fill="var(--blue)" fontSize="11.5" fontWeight="700" letterSpacing="1.5">
                VERSIONED RELEASES: TAGS + CHANGELOG + MIGRATIONS
              </text>
              <path d="M380 90 L380 100 M130 100 L630 100 M130 100 L130 132 M630 100 L630 132" stroke="var(--body-text)" strokeWidth="1.5" fill="none" />
              <line x1="130" y1="132" x2="130" y2="172" stroke="var(--body-text)" strokeWidth="1.5" markerEnd="url(#arr)" />
              <line x1="380" y1="130" x2="380" y2="172" stroke="var(--body-text)" strokeWidth="1.5" markerEnd="url(#arr)" />
              <line x1="630" y1="132" x2="630" y2="172" stroke="var(--body-text)" strokeWidth="1.5" markerEnd="url(#arr)" />

              <rect x="30" y="174" width="200" height="86" rx="16" fill="var(--blue)" />
              <text x="130" y="205" textAnchor="middle" fill="var(--white)" fontSize="15" fontWeight="700">
                Edge8 fork (private)
              </text>
              <text x="130" y="226" textAnchor="middle" fill="var(--color-accent-line)" fontSize="12">
                runs the company on the spine
              </text>
              <text x="130" y="244" textAnchor="middle" fill="var(--color-accent-line)" fontSize="12">
                overlay: brand + config only
              </text>

              <rect x="280" y="174" width="200" height="86" rx="16" fill="var(--tint)" />
              <text x="380" y="205" textAnchor="middle" fill="var(--dark)" fontSize="15" fontWeight="700">
                Demo forks
              </text>
              <text x="380" y="226" textAnchor="middle" fill="var(--body-text)" fontSize="12">
                sample data, sales use
              </text>
              <text x="380" y="244" textAnchor="middle" fill="var(--body-text)" fontSize="12">
                auto-synced every release
              </text>

              <rect x="530" y="174" width="200" height="86" rx="16" fill="var(--tint)" />
              <text x="630" y="205" textAnchor="middle" fill="var(--dark)" fontSize="15" fontWeight="700">
                Client forks
              </text>
              <text x="630" y="226" textAnchor="middle" fill="var(--body-text)" fontSize="12">
                real customers, one fork each
              </text>
              <text x="630" y="244" textAnchor="middle" fill="var(--body-text)" fontSize="12">
                their data, their deploy
              </text>

              <path
                d="M96 174 C 56 122, 116 60, 238 44"
                fill="none"
                stroke="var(--blue)"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                markerEnd="url(#arr)"
              />
              <text x="44" y="106" fill="var(--blue)" fontSize="11.5" fontWeight="700">
                product fixes go
              </text>
              <text x="44" y="122" fill="var(--blue)" fontSize="11.5" fontWeight="700">
                upstream first
              </text>

              <line x1="565" y1="260" x2="565" y2="296" stroke="var(--body-text)" strokeWidth="1.5" markerEnd="url(#arr)" />
              <line x1="630" y1="260" x2="630" y2="296" stroke="var(--body-text)" strokeWidth="1.5" markerEnd="url(#arr)" />
              <line x1="695" y1="260" x2="695" y2="296" stroke="var(--body-text)" strokeWidth="1.5" markerEnd="url(#arr)" />

              <rect x="415" y="298" width="100" height="122" rx="14" fill="var(--white)" stroke="var(--card-border)" strokeWidth="1.5" />
              <text x="465" y="326" textAnchor="middle" fill="var(--dark)" fontSize="13.5" fontWeight="700">
                Free / DIY
              </text>
              <text x="465" y="348" textAnchor="middle" fill="var(--body-text)" fontSize="11.5">
                self-serve
              </text>
              <text x="465" y="365" textAnchor="middle" fill="var(--body-text)" fontSize="11.5">
                release notes
              </text>
              <text x="465" y="382" textAnchor="middle" fill="var(--body-text)" fontSize="11.5">
                only
              </text>

              <rect x="527" y="298" width="100" height="122" rx="14" fill="var(--white)" stroke="var(--card-border)" strokeWidth="1.5" />
              <text x="577" y="326" textAnchor="middle" fill="var(--dark)" fontSize="13.5" fontWeight="700">
                Community
              </text>
              <text x="577" y="348" textAnchor="middle" fill="var(--body-text)" fontSize="11.5">
                support channel
              </text>
              <text x="577" y="365" textAnchor="middle" fill="var(--body-text)" fontSize="11.5">
                sync-PR action,
              </text>
              <text x="577" y="382" textAnchor="middle" fill="var(--body-text)" fontSize="11.5">
                they merge
              </text>

              <rect x="639" y="298" width="100" height="122" rx="14" fill="var(--dark)" />
              <text x="689" y="326" textAnchor="middle" fill="var(--white)" fontSize="13.5" fontWeight="700">
                Full service
              </text>
              <text x="689" y="348" textAnchor="middle" fill="var(--color-grey-300)" fontSize="11.5">
                we sync, run
              </text>
              <text x="689" y="365" textAnchor="middle" fill="var(--color-grey-300)" fontSize="11.5">
                migrations,
              </text>
              <text x="689" y="382" textAnchor="middle" fill="var(--color-grey-300)" fontSize="11.5">
                verify deploy
              </text>
              <text x="689" y="406" textAnchor="middle" fill="var(--mint)" fontSize="10.5" fontWeight="700">
                $15k setup + retainer
              </text>
            </svg>
          </div>

          <div className="wf-info-grid u-mt-6">
            <div className="wf-info-card wf-info-card-mint">
              <h3>The one decision this doc makes</h3>
              <ul>
                <li>
                  The open source repo is upstream for the product. Everything else, including
                  Edge8&apos;s own deployment, is a downstream fork of it.
                </li>
                <li>
                  Generic product work lands in the public repo first; each fork carries only its
                  own overlay (branding, config, data, secrets).
                </li>
                <li>
                  Nothing Edge8-specific ever enters the public repo, so there is no scrubbing
                  pipeline to leak.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 02 THE DIRECTION DECISION */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">02 · The direction decision</span>
          <h2 className="section-title section-title--sm">
            Why open-source-first and not private-first
          </h2>

          <div className="wf-info-grid u-mt-6">
            <div className="wf-info-card">
              <h3>Private-first with a scrubbed export (rejected)</h3>
              <ul>
                <li>Build in private, filter and strip Edge8 references, push releases to the public repo.</li>
                <li>Keeps current speed, but community PRs against the public repo are painful to pull back in.</li>
                <li>The scrub step is a standing leak risk: one missed reference goes public.</li>
                <li>Quietly kills outside contribution.</li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>Open-source-first (chosen)</h3>
              <ul>
                <li>The public repo is the real codebase.</li>
                <li>Slightly more discipline: build clean first, customize second.</li>
                <li>One update path for everyone, including us.</li>
                <li>
                  We dogfood the exact experience clients get, because we run our company on the
                  same spine through the same sync flow.
                </li>
              </ul>
            </div>
          </div>

          <p className="section-sub u-mt-6">
            The fact that Edge8 itself runs on 8 Edges settles it. If we were private-first, our
            own production would sit upstream of the product we sell, and every client would be
            running an export of our internals. Open-source-first means our deployment proves the
            client path works, every single release.
          </p>
        </div>
      </section>

      {/* 03 THE RULES */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">03 · The rules</span>
          <h2 className="section-title section-title--sm">
            What keeps maintenance cheap
          </h2>

          <div className="wf-problems u-mt-5">
            {RULES.map(([rule, why]) => (
              <div key={rule} className="wf-problem wf-problem-ok">
                <strong>{rule}.</strong> {why}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 TIERS */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">04 · Tiers</span>
          <h2 className="section-title section-title--sm">
            Same machinery, different service level
          </h2>

          <div className="wf-table-wrap u-mt-5">
            <table className="wf-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>What they get</th>
                  <th>What we do per release</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map(([tier, gets, work]) => (
                  <tr key={tier}>
                    <td>
                      <strong>{tier}</strong>
                    </td>
                    <td>{gets}</td>
                    <td>{work}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 05 RELEASE FLOW */}
      <section className="section u-pb-8">
        <div className="container">
          <span className="section-label">05 · The release flow</span>
          <h2 className="section-title section-title--sm">
            Edge8 first, then demos, then clients
          </h2>

          <div className="u-mt-6">
            <FlowRail
              steps={[
                { num: '1', title: 'Cut the tag: changelog + migration scripts', cadence: 'Per release', actor: 'human' },
                { num: '2', title: 'Sync the Edge8 fork and live on it, the canary', cadence: 'Day one', actor: 'human' },
                { num: '3', title: 'Auto-sync demo forks, reseed sample data', cadence: 'Automatic', actor: 'system' },
                { num: '4', title: 'Fan out sync PRs to full-service forks; merge, migrate, verify', cadence: 'Within the week', actor: 'ai' },
                { num: '5', title: 'Community forks get their sync PR; announce in the channel', cadence: 'Automatic', actor: 'system' },
                { num: '6', title: 'DIY clients update themselves from the release notes', cadence: 'Their pace', actor: 'human' },
              ]}
              repeatNote="Repeats every release. If step 2 hurts, the release is not ready to fan out."
            />
          </div>

          <div className="wf-info-grid u-mt-6">
            <div className="wf-info-card wf-info-card-mint">
              <h3>Health metric</h3>
              <ul>
                <li>
                  For every fork we touch (Edge8, demos, full service), the number that matters is
                  tags behind latest. Target: zero within a week of each release.
                </li>
                <li>
                  A fork drifting more than two releases behind is a flag to investigate why,
                  usually a core-file edit that should have been an extension point.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 06 PRIVATE-ONLY FEATURES */}
      <section className="section">
        <div className="container">
          <span className="section-label">06 · Private-only features</span>
          <h2 className="section-title section-title--sm">
            Custom things the master repo will never have
          </h2>
          <p className="section-sub u-mt-3">
            The Edge8 fork will always carry features the master never gets: the CRM proposal
            flow, retreat ops, Lark integrations. That is the expected case, not an edge case.
            What breaks syncs is never the existence of private features, it is private changes
            to files upstream also changes. Three ways to hold private-only work, in order of
            preference:
          </p>

          <div className="wf-info-grid u-mt-5">
            <div className="wf-info-card">
              <h3>1. Namespaced directories upstream never touches (the default)</h3>
              <ul>
                <li>
                  Custom features live in paths that exist only in the fork: app/(edge8)/...,
                  lib/edge8/..., a private extensions folder.
                </li>
                <li>
                  Upstream releases merge cleanly forever, because git never sees both sides
                  touching the same file.
                </li>
                <li>
                  Same rule in the database: fork-only tables go in their own schema, so the
                  master&apos;s migrations and the fork&apos;s never collide.
                </li>
                <li>
                  This covers roughly 80% of custom work: new pages, new tables, new crons, new
                  integrations.
                </li>
              </ul>
            </div>
            <div className="wf-info-card">
              <h3>2. Hooks upstream, feature private</h3>
              <ul>
                <li>
                  The hard 20% is a custom feature that must change core behavior: inject a nav
                  item, add a step to an existing workflow, swap a component.
                </li>
                <li>
                  Editing the core file works once and costs every release after. Instead, the
                  hook goes upstream (a registry the sidebar reads, a plugin slot, config-driven
                  nav) and the Edge8-specific thing plugs into it privately.
                </li>
                <li>
                  The test for what goes upstream: would a full-service client plausibly want to
                  inject something here too? Almost always yes, which is why this is not charity
                  to the community: these are the extension points the $15k setups are sold on.
                </li>
              </ul>
            </div>
            <div className="wf-info-card">
              <h3>3. Carried patches (the escape hatch, use sparingly)</h3>
              <ul>
                <li>
                  For the rare change that is truly fork-only and must touch a core file, the
                  fork carries it as a small, known set of commits re-merged each release.
                </li>
                <li>Keep the list explicit: a PATCHES.md in the fork.</li>
                <li>
                  Every entry on that list is recurring merge cost. The list only ever growing is
                  the smell that the change needed approach 2 instead.
                </li>
              </ul>
            </div>
            <div className="wf-info-card wf-info-card-mint">
              <h3>The governing rule, applied to ourselves</h3>
              <ul>
                <li>
                  Our own fork gets to have the biggest overlay of anyone, but it plays by the
                  same rules as a client fork. That is the point: we are the canary for how
                  painful the rules are.
                </li>
                <li>
                  A fork more than two releases behind is usually a fork that edited core, ours
                  included.
                </li>
              </ul>
            </div>
          </div>

          <div className="wf-problems u-mt-6">
            <div className="wf-problem wf-problem-warn">
              <strong>The honest caveat:</strong> this all works if the master repo is genuinely
              extracted with extension points in mind. Today, Edge8-specific logic is braided
              through core files in edge8-web, so the real work is not the sync mechanics, it is
              the untangling: deciding feature by feature whether it is core, a hook, or private.
              That migration is the prerequisite for everything above.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
})
