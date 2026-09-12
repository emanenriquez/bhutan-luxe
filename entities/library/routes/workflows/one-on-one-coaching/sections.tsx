// The Tooling and Model sections of the 1-1 coaching workflow page, lifted out
// of ./page so that file stays under the size ratchet (scripts/check-file-sizes.mjs).
// Content only: these take no props and hold no state, so they read as the page
// continued in another file.

export function ToolingSection() {
  return (
    <>
    {/* Tooling */}
    <section className="section">
      <div className="container">
        <span className="section-label">The tooling</span>
        <h2 className="section-title section-title--sm">
          What runs it
        </h2>
        <div className="wf-table-wrap">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Role in the cycle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Two routines</td>
                <td>
                  The clock behind everything: a daily 07:45 run rolls next dates forward, writes preps, sends
                  mid-cycle check-ins, refreshes trends, and auto-detects Minutes; an hourly run drafts one recap.
                </td>
              </tr>
              <tr>
                <td>Lark DMs + email</td>
                <td>
                  Every nudge goes out twice: a Lark DM and an email twin, so nothing is missed. Links always land on
                  the portal, where the data lives.
                </td>
              </tr>
              <tr>
                <td>Lark Minutes</td>
                <td>
                  The transcript source. Recordings are matched to 1-1s by name in the title and date; the fallback is a paste.
                </td>
              </tr>
              <tr>
                <td>Claude Opus 5</td>
                <td>
                  Prep, recap drafting, and trend analysis. Every call fails soft: an AI error lands on the record
                  and never blocks the meeting from happening. Every record stores the model that wrote it.
                </td>
              </tr>
              <tr>
                <td>The team portal</td>
                <td>
                  The interface for both tiers: a coaching dashboard for the coach, a my-coaching view for the
                  member, goals visible on team profiles.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    </>
  )
}

export function ModelSection() {
  return (
    <>
    {/* The model */}
    <section className="section wf-section--tint">
      <div className="container">
        <span className="section-label wf-section--white">The model</span>
        <h2 className="section-title section-title--sm">
          Why Claude Opus 5 writes the recaps
        </h2>
        <p className="section-sub u-mt-3">
          Every coaching generation, the prep, the recap, the check-in, and the per-person trend report, runs on Claude
          Opus 5. The model is named in exactly one place in our code, and every record stores which model produced
          it, so there is never a question about what wrote what. A full recap costs us under thirty cents.
        </p>
        <div className="wf-table-wrap">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Why, or why not</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Claude Opus 5, what we run</td>
                <td>
                  The recap is the deliverable here, not a step towards it: a person reads it about their own work,
                  and their coach acts on it. So we buy the model that reads half an hour of transcript most
                  carefully. At one 1-1 per person per fortnight, the model bill is never the constraint. What the
                  coach reads is.
                </td>
              </tr>
              <tr>
                <td>Claude Sonnet 5, why not</td>
                <td>
                  Cheaper, and genuinely capable. We ran it head to head against Opus 5 on the same meeting with the
                  same prompt: it returned the same sections with roughly half the detail. Saving eighteen cents on
                  the one document the member actually reads is a bad trade.
                </td>
              </tr>
              <tr>
                <td>Claude Fable 5.1, why not</td>
                <td>
                  Anthropic&apos;s most capable model, and more than this job needs. It costs twice Opus 5, and its
                  reasoning cannot be turned down, so it spends tokens thinking about a task that does not need
                  them and pushes against the output budget a recap has to fit inside. Summarising one honest
                  conversation is not the hardest thing a model can do. We would rather spend the difference on
                  more coaching than on more tokens.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="section-sub u-mt-5">
          We re-check this choice rather than assume it. The model tier is a one line change, every run logs its own
          token cost, and a pilot can re-summarise a past 1-1 on a different model and put the record back untouched,
          so a comparison never costs anyone their history.
        </p>
      </div>
    </section>
    </>
  )
}
