"use client";

import { useEffect } from "react";

// ── Kickoff checklist (reusable template) ─────────────────────────────
// To spin up a new client: copy this page, change CLIENT_NAME, the survey
// link, and adjust CHECKLIST groups/items + dates as needed. Access is NOT
// configured here — add a scope to lib/access-gate.ts, an unlock action
// reading its own <SCOPE>_ACCESS_CODE env var, and a layout that calls
// verifyGate. Never put the code in this file: it is a client component and
// anything in it ships to the browser.
const CLIENT_NAME = "Bstore";
const CHECKLIST_STORAGE_KEY = "bstore-kickoff-checklist";
const SURVEY_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/surveys/ai-journey`;

type CheckItem = { key: string; label: string; note?: string };
type CheckGroup = { title: string; tag: "Client" | "Edge8"; items: CheckItem[] };

const CHECKLIST: CheckGroup[] = [
  {
    title: `${CLIENT_NAME} to complete`,
    tag: "Client",
    items: [
      { key: "contract", label: "Sign the service agreement" },
      { key: "payment", label: "Pay the initial payment" },
      {
        key: "survey",
        label: 'Complete the "Begin Your AI Journey With Us" survey',
        note: `<a href="${SURVEY_URL}" target="_blank" rel="noopener">${SURVEY_URL.replace("https://", "")} &rarr;</a>`,
      },
      {
        key: "datamap",
        label: "Send a data map of the systems you use",
        note: "So we understand your tech stack and how data flows between tools.",
      },
      {
        key: "docs",
        label: "Share any workflow / process documentation you follow",
        note: "Dump whatever exists, however rough.",
      },
      {
        key: "portal-people",
        label: "Give us everyone who should get client-portal access",
        note: "Names + emails, so we can send portal invites.",
      },
      {
        key: "cert-date",
        label: "Pick a certification kickoff date",
        note: "Week of Aug 17 &mdash; choose <strong>Aug 17, 18, or 21</strong> (any time).",
      },
    ],
  },
  {
    title: "Edge8 to deliver",
    tag: "Edge8",
    items: [
      {
        key: "infra",
        label: "Set up GitHub, Vercel & Supabase accounts and install the company database",
        note: "Week of Aug 3 &mdash; complete before Aug 14.",
      },
      {
        key: "portal-invites",
        label: "Send client-portal invites",
        note: "Once we have your access list.",
      },
      {
        key: "program-plan",
        label: "Create a program plan for the first workflows",
        note: "Identified together.",
      },
      {
        key: "review",
        label: "Review meeting to review progress and continue",
        note: "Week of Aug 10.",
      },
    ],
  },
];

function checklistHtml(): string {
  const groups = CHECKLIST.map((g) => {
    const tagClass = g.tag === "Edge8" ? "ck-tag--edge8" : "ck-tag--client";
    const items = g.items
      .map(
        (it) => `
        <label class="ck-item" for="ck-${it.key}">
          <input type="checkbox" class="ck" id="ck-${it.key}" data-key="${it.key}">
          <span class="ck-box" aria-hidden="true"></span>
          <span class="ck-text"><span class="ck-label">${it.label}</span>${
            it.note ? `<span class="ck-note">${it.note}</span>` : ""
          }</span>
        </label>`,
      )
      .join("");
    return `
      <div class="ck-group">
        <div class="ck-group-head"><span class="ck-tag ${tagClass}">${g.tag}</span><span class="ck-group-title">${g.title}</span></div>
        ${items}
      </div>`;
  }).join("");

  return `
  <section class="ck-section">
    <h2><span class="num">&#10003;</span>Kickoff Checklist</h2>
    <p>Everything to get ${CLIENT_NAME} started. Tick items off as you go &mdash; your progress is saved in this browser.</p>
    <div class="ck-progress"><div class="ck-bar"><div class="ck-bar-fill" id="ck-bar-fill"></div></div><span class="ck-count" id="ck-count"></span></div>
    ${groups}
  </section>`;
}

const CONTENT_HTML = `
<div class="wrap">

  <header>
    <h1>Bstore &middot; Project Scope Summary</h1>
    <div class="meta">
      <strong>Meeting:</strong> Project Scope Call<br>
      <strong>Date:</strong> 2026-07-31<br>
      <strong>Attendees:</strong> David Hajdu (Edge8) &middot; Quan (Edge8, process &amp; database) &middot; Sean Rohald (Bstore, founder)
    </div>
  </header>

  ${checklistHtml()}

  <section>
    <h2><span class="num">&#9733;</span>Resources</h2>
    <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
      <div style="flex:1 1 260px;">
        <strong>AI Program &amp; Roadmap</strong><br>
        <span style="color:var(--muted); font-size:14px;">Every opportunity from your Step 1 audits, grouped and prioritised &mdash; adjust the priorities and send them back.</span>
      </div>
      <a href="/private/bstore/backlog" style="flex:none; background:var(--accent); color:var(--color-bg-primary); font-weight:600; font-size:14px; padding:10px 18px; border-radius:40px;">Open the roadmap &rarr;</a>
    </div>
  </section>

  <section>
    <h2><span class="num">1</span>Core Problem We Are Trying to Solve</h2>
    <p>Bstore's staff are already using AI (ChatGPT, Claude) after 18-24 months on the journey, but the effort has become fragmented and risky:</p>
    <ul>
      <li><strong>Disparate, ungoverned AI systems.</strong> People build their own Claude artifacts and custom GPTs with no central home. Outputs live on desktops, in spreadsheets, or in individual accounts with no visibility into where sensitive data ends up.</li>
      <li><strong>Data security exposure.</strong> The only way staff can get data into AI today is to export a CSV and upload it into Claude/ChatGPT, including sensitive financial and personal information. Sean is putting up roadblocks because there is no secure environment.</li>
      <li><strong>No single source of truth.</strong> Data is locked inside separate systems (ERP, time &amp; attendance, Shopify, Metronome) with no central database to link it together or report across it.</li>
      <li><strong>Time and labor cost pressure.</strong> Labor requirement and cost are rising. Revenue is hard to grow without opening new stores, so the lever is cost control and efficiency. The refrain across the business: "we don't have enough time."</li>
    </ul>
    <p class="lead"><strong>The foundation to fix all of this:</strong> build a single, secure, company-owned central database that holds the information in one place, so systems (not people) move data, and AI can query it in real time.</p>
  </section>

  <section>
    <h2><span class="num">2</span>Business Goals</h2>
    <ol>
      <li><strong>Give everyone time back and make them more efficient</strong> - reduce the "too much on our plate, nothing gets done properly" problem.</li>
      <li><strong>Control costs</strong>, especially rising labor cost, since revenue growth depends on opening new stores.</li>
      <li><strong>Secure the data</strong> - stop staff manually uploading sensitive financial/personal data into public AI tools; provide a governed environment.</li>
      <li><strong>Own the stack</strong> - a company-owned database and apps (no SaaS lock-in, no per-user fees, no vendor owning the data), with the option to retire some SaaS tools over time.</li>
      <li><strong>Automate reporting and streamline workflows</strong> - free up staff from repetitive manual reporting and step-heavy processes.</li>
    </ol>
  </section>

  <section>
    <h2><span class="num">3</span>Data Map</h2>
    <p>The data map lists every source system, what data lives where, and how it flows into the new central database. Sean will send the full tech-stack list by email to complete this.</p>

    <h3>Tech Stack / Sources</h3>
    <div class="table-scroll">
      <table>
        <thead><tr><th>System</th><th>Role</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><strong>MYOB Acumatica</strong> (Acumatica, branded via Australian partner)</td><td>Central ERP - financial data, inventory, payroll, trading data</td><td>System of record. Everything ultimately flows here. <a href="https://www.myob.com/au/erp-software/products/myob-acumatica" target="_blank" rel="noopener">Product page &rarr;</a></td></tr>
          <tr><td><strong>WageLoch</strong> (time &amp; attendance)</td><td>Labor / hours data</td><td>Integrates into Acumatica. Priority sync alongside ERP.</td></tr>
          <tr><td><strong>Shopify</strong></td><td>E-commerce transactions</td><td>Flows into Acumatica; not independent. Can move later.</td></tr>
          <tr><td><strong>Metronome</strong> (Shannon Susko / Canadian)</td><td>Strategic tracking - scorecards, KPIs, company metrics, quarterly &amp; annual priorities</td><td>Consumes data, does not produce it. Used to run meetings (facilitated by Brad Charles). Candidate to eventually replace / build in-house.</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Priorities for the central database</h3>
    <ol>
      <li><strong>Master &amp; hierarchical data first</strong> (Quan): employees, stores, organizations, customers and their relationships. "You can live without sales data, but you can't live without employee/organizational data."</li>
      <li><strong>Employee data</strong> - lives in the ERP and time &amp; attendance. Focus on salaried employees first (low churn); defer casual/retail staff (high churn).</li>
      <li><strong>ERP financial + time &amp; attendance sync</strong> - the two key sync targets Sean named.</li>
    </ol>

    <h3>Data handling / security approach</h3>
    <ul>
      <li>Data is <strong>obfuscated (masked) in transit</strong> - the pipeline is first proven with masked/simulated data so no real personal or payment data is exposed. Relationships between records are broken in transit and re-established only "at rest" in the owned database.</li>
      <li><strong>Row-level security</strong> in the database controls access.</li>
      <li>Claude only needs the <em>process</em>, not the real data - so process design happens on masked data, and staff apply it to real data inside the secure DB.</li>
    </ul>

    <h3>Hosting / Ownership</h3>
    <ul>
      <li><strong>Supabase</strong> (Postgres on AWS) for the database - hosted in-region.</li>
      <li><strong>Vercel</strong> (on AWS) for any apps/portals built on top.</li>
      <li><strong>GitHub</strong> as the code repository.</li>
      <li><strong>Bstore owns everything</strong> - the account is set up under Bstore as code owner from the start. No SaaS fees to Edge8; only modest infra costs (tens of dollars/month for the DB, ~$10/user/month for Vercel until real transaction volume).</li>
    </ul>
  </section>

  <section>
    <h2><span class="num">&#9733;</span>Systems &amp; API Reference</h2>
    <p>Every system referenced above, with a link to its product overview and its API / developer documentation.</p>
    <div class="table-scroll">
      <table>
        <thead><tr><th>System</th><th>Role</th><th>Product overview</th><th>API / developer docs</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>MYOB Acumatica</strong></td>
            <td>Central ERP</td>
            <td><a href="https://www.myob.com/au/erp-software/products/myob-acumatica" target="_blank" rel="noopener">myob.com &rarr;</a></td>
            <td><a href="https://help.acumatica.com/" target="_blank" rel="noopener">Acumatica contract-based REST API &rarr;</a></td>
          </tr>
          <tr>
            <td><strong>WageLoch</strong></td>
            <td>Time &amp; attendance</td>
            <td><a href="https://wageloch.com.au/" target="_blank" rel="noopener">wageloch.com.au &rarr;</a></td>
            <td><a href="https://wageloch.com.au/solutions/time-attendance/" target="_blank" rel="noopener">Integrations (API on request)</a> - no public API docs</td>
          </tr>
          <tr>
            <td><strong>Shopify</strong></td>
            <td>E-commerce</td>
            <td><a href="https://www.shopify.com/" target="_blank" rel="noopener">shopify.com &rarr;</a></td>
            <td><a href="https://shopify.dev/docs/api" target="_blank" rel="noopener">shopify.dev/docs/api &rarr;</a></td>
          </tr>
          <tr>
            <td><strong>Metronomics</strong> (Metronome Growth Systems)</td>
            <td>Strategic tracking</td>
            <td><a href="https://www.metronomics.com/" target="_blank" rel="noopener">metronomics.com &rarr;</a></td>
            <td>No public API - export / manual sync only</td>
          </tr>
          <tr>
            <td><strong>Supabase</strong></td>
            <td>Central database (Postgres)</td>
            <td><a href="https://supabase.com/" target="_blank" rel="noopener">supabase.com &rarr;</a></td>
            <td><a href="https://supabase.com/docs/reference" target="_blank" rel="noopener">supabase.com/docs/reference &rarr;</a></td>
          </tr>
          <tr>
            <td><strong>Vercel</strong></td>
            <td>App / portal hosting</td>
            <td><a href="https://vercel.com/" target="_blank" rel="noopener">vercel.com &rarr;</a></td>
            <td><a href="https://vercel.com/docs/rest-api" target="_blank" rel="noopener">vercel.com/docs/rest-api &rarr;</a></td>
          </tr>
          <tr>
            <td><strong>GitHub</strong></td>
            <td>Code repository</td>
            <td><a href="https://github.com/" target="_blank" rel="noopener">github.com &rarr;</a></td>
            <td><a href="https://docs.github.com/en/rest" target="_blank" rel="noopener">docs.github.com/en/rest &rarr;</a></td>
          </tr>
          <tr>
            <td><strong>Claude / Anthropic API</strong></td>
            <td>AI engine (chatbot, real-time DB queries)</td>
            <td><a href="https://www.anthropic.com/claude" target="_blank" rel="noopener">anthropic.com/claude &rarr;</a></td>
            <td><a href="https://docs.anthropic.com/en/api" target="_blank" rel="noopener">docs.anthropic.com/en/api &rarr;</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2><span class="num">4</span>Workflows</h2>
    <p>Two workflow types drive early value: <strong>reporting automation</strong> and <strong>process streamlining</strong>. The taught method is a 7-step workflow design: trigger &rarr; inputs needed &rarr; decision routing &rarr; output &rarr; delivery &rarr; measurement.</p>

    <h3>Priority Workflow 1 - Weekly Monday retail report</h3>
    <ul>
      <li><strong>Current state:</strong> Sean spends ~3 hours every Monday building an Excel report. ~50% auto-pulls via an ODBC connection to the ERP; the other ~50% is manual Excel formulas and data entry. Used in Monday meetings and to update Metronome.</li>
      <li><strong>Target state:</strong> An agent prepares the full report automatically every Monday from the central database (financial/trading data from ERP + labor data from time &amp; attendance).</li>
      <li><strong>Approach:</strong> Work backwards from the decision the report supports &rarr; identify feeding data &rarr; find the gaps &rarr; get all sources into the central DB &rarr; automate. The "one-hour build" is the report; the "day's build" is the data mapping.</li>
    </ul>

    <h3>Priority Workflow 2 - Auto-update Metronome</h3>
    <ul>
      <li>Today ~10 people each spend an hour updating Metronome from that Monday report. An agent should update Metronome automatically from the report data.</li>
    </ul>

    <h3>Broader workflow opportunity</h3>
    <ul>
      <li>Map the <strong>value chain</strong> (Quan): overlay the tech stack onto major processes, separating what is genuinely critical/differentiated ("secret sauce") from standard practice that can simply be automated in the background.</li>
      <li>Workflows are documented visually and confirmed by humans <em>before</em> engineers build them - captures tribal knowledge.</li>
      <li>The portal supports experimenting with new workflows on a small group - something the ERP cannot do.</li>
    </ul>

    <h3>The North Star (what an owned central DB unlocks)</h3>
    <p>A "Bstore portal" with role- and org-based access control (vertical + horizontal slicing), e.g.:</p>
    <ul>
      <li>Revenue / Talent / Operations / Innovation views with an embedded chatbot querying the DB in real time via the Claude API.</li>
      <li>CRM (HubSpot-style, no fees), applicant tracking with AI resume scoring, surveys, onboarding, performance reviews, analytics.</li>
      <li>Financial reports with restricted access.</li>
    </ul>
  </section>

  <section>
    <h2><span class="num">5</span>AI Officer Training (Certification)</h2>

    <h3>Scope for Phase 1</h3>
    <ul>
      <li><strong>Head office only</strong> - ~13-14 people. Retail stores deferred to Phase 2 (too much to do everyone at once). David agrees this is the recommended approach.</li>
    </ul>

    <h3>How it works</h3>
    <ul>
      <li><strong>Kickoff:</strong> Bstore provides a whitelist of emails and a start date. Edge8 invoices, then runs a <strong>1-hour live intro session</strong> (tour + three foundational skills: workflow design, information architecture, creating instructions for AI).</li>
      <li><strong>Self-paced learning:</strong> Portal access + "learn by doing" - each level has a challenge (e.g. the first agentic level requires creating a real AI program plan, stored as an artifact).</li>
      <li><strong>Secure environment:</strong> All work happens inside Edge8's secure team Claude account; artifacts and company data are protected.</li>
      <li><strong>Founder dashboard:</strong> Sean gets a manager view of progress, homework, and (rolling out) insights on who is strong at workflow design vs. the data part.</li>
      <li><strong>Weekly support:</strong> Office hours (Thursdays) + optional live "micro-sessions" on new tools (Claude, Opus 5, GPT, etc.).</li>
    </ul>

    <h3>Structure &amp; timeline</h3>
    <ul>
      <li><strong>~6 agentic + 4 generative</strong> modules, each with a challenge.</li>
      <li>Typical completion <strong>~90 days</strong>; <strong>30 days or less</strong> for the highly motivated; fast movers in 1-2 weeks.</li>
      <li><strong>Outcome:</strong> graduates can create program plans, design workflows, and convert workflows into AI-followable instructions.</li>
    </ul>

    <h3>Optional add-ons</h3>
    <ul>
      <li><strong>4-hour "Four Offices of the Future" workshop</strong> - hands-on roadmap and workflow design across revenue, talent, operations (saving money), and innovation.</li>
      <li><strong>AI Engineering track</strong> (+30-60 days) - for people who will build/touch code. Requires the "infinite leverage" stack (Claude + GitHub + Vercel + Supabase). Builders go prototype &rarr; production.</li>
      <li><strong>Co-developing retreats</strong> - pairing with an engineer to learn the build stack (recommended once ready to commit to a paired engineer).</li>
    </ul>

    <h3>Teaching philosophy</h3>
    <ul>
      <li>No longer teaching prompt engineering - instead the <strong>application of real academic &amp; business frameworks</strong> (Jobs to be Done, McKinsey 7S, GROW coaching, OCEAN profiles, etc.). The hard part is workflow design and information architecture, not "using AI."</li>
    </ul>
  </section>

  <section>
    <h2><span class="num">6</span>How We Start the Project</h2>
    <ol>
      <li><strong>Sign the service agreement.</strong> David sends it for preview; on approval Sean DocuSigns, Edge8 invoices, work begins.</li>
      <li><strong>Sean sends the tech-stack list by email</strong> - each tool and its purpose - plus the pre-prepared department workflows.</li>
      <li><strong>NDA / ERP access.</strong> A basic NDA is built into the contract (a detailed one can be signed if needed). Edge8 gets ERP access.</li>
      <li><strong>Stand up the central database.</strong> Copy the Edge8 template (~80 tables, ~80% of use cases) into a new Bstore-owned Supabase account; add/remove tables to fit.</li>
      <li><strong>Build the data map &amp; pipeline.</strong> Match ERP / time-and-attendance structures, adjust schema, mask data, build the sync (likely daily). Prove on masked data first, then move real data.</li>
      <li><strong>Replicate the Monday report</strong> as the first workflow using Sean's latest report as the sample, then automate. (Then Workflow 2: auto-update Metronome.)</li>
      <li><strong>Kick off AI Officer training in parallel.</strong> Pick an intro date (~2nd week of August, via Doodle). Provide the whitelist of ~13-14 participants.</li>
      <li><strong>Client portal setup.</strong> Edge8 sets Sean up and uploads the first workflows to track all submitted work (includes the "Human Token Tracker" - human vs. AI time vs. things built).</li>
    </ol>

    <h3>First concrete deliverables</h3>
    <ul>
      <li>Secure, Bstore-owned central database (Supabase/AWS).</li>
      <li>ERP + time &amp; attendance data synced (masked in transit).</li>
      <li>Automated Monday retail report reproduced from the sample.</li>
      <li>~13-14 head-office staff enrolled in AI Officer certification, starting with a 1-hour live intro.</li>
    </ul>
  </section>

  <section>
    <div class="grid2">
      <div>
        <h2 style="font-size:16px;">Sean's To-Dos</h2>
        <ul class="todo">
          <li>Review and DocuSign the service agreement.</li>
          <li>Email the full tech-stack list (tools + purpose).</li>
          <li>Send the pre-prepared department workflows.</li>
          <li>Provide the whitelist of ~13-14 head-office emails.</li>
          <li>Confirm the intro session date (~week 2 of August).</li>
        </ul>
      </div>
      <div>
        <h2 style="font-size:16px;">Edge8's To-Dos</h2>
        <ul class="todo">
          <li>Send service agreement; invoice on signature.</li>
          <li>Set up Bstore-owned Supabase account + copy DB template.</li>
          <li>Build data map from the tech-stack list.</li>
          <li>Set Sean up in the client portal + upload first workflows.</li>
          <li>Send Doodle; schedule certification kickoff.</li>
        </ul>
      </div>
    </div>
  </section>

  <footer>Prepared from the project scope call transcript &middot; 2026-07-31</footer>

</div>
`;

export default function BstoreScopePage() {
  // Wire up checklist checkboxes + progress bar, persisting to localStorage.
  // The markup is injected as HTML, so the listeners are attached after mount
  // rather than through React props.
  useEffect(() => {
    const root = document.querySelector(".bstore-doc");
    if (!root) return;
    const boxes = Array.from(root.querySelectorAll<HTMLInputElement>("input.ck"));
    if (boxes.length === 0) return;
    const fill = root.querySelector<HTMLElement>("#ck-bar-fill");
    const count = root.querySelector<HTMLElement>("#ck-count");

    let saved: Record<string, boolean> = {};
    try {
      saved = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || "{}");
    } catch {
      saved = {};
    }

    const update = () => {
      const done = boxes.filter((b) => b.checked).length;
      if (fill) fill.style.width = `${(done / boxes.length) * 100}%`;
      if (count) count.textContent = `${done} / ${boxes.length} done`;
    };

    const handlers: Array<() => void> = [];
    boxes.forEach((b) => {
      const key = b.dataset.key || "";
      b.checked = !!saved[key];
      const onChange = () => {
        saved[key] = b.checked;
        try {
          localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(saved));
        } catch {
          /* ignore */
        }
        update();
      };
      b.addEventListener("change", onChange);
      handlers.push(() => b.removeEventListener("change", onChange));
    });
    update();

    return () => handlers.forEach((off) => off());
  }, []);

  return (
    <div
      className="bstore-doc"
      dangerouslySetInnerHTML={{ __html: CONTENT_HTML }}
    />
  );
}
