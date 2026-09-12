// Built means a routine on Settings → Agents runs it today; planned means the
// workflow is designed and documented but no scheduled agent stands behind it
// yet. `routines` names the Agents page ids (the cron path, or the local job id)
// that run a built workflow; scripts/workflows-directory.test.mjs proves every
// routine on that page is named by at least one workflow here,
// so the two lists cannot drift apart.
export type WorkflowStatus = 'built' | 'planned'

export type Workflow = {
  slug: string
  title: string
  category: 'Talent' | 'Operations' | 'Revenue' | 'Innovation'
  excerpt: string
  date: string
  steps: number
  status: WorkflowStatus
  routines?: string[]
}

export const allWorkflows: Workflow[] = [
  {
    slug: 'review-requests',
    title: 'Review Requests: Any Reviewer, One Link',
    category: 'Talent',
    excerpt:
      'Talent opens a probation or performance review for anyone, adds reviewers beyond the manager (a second lead, a client contact), and hands each one a link, from the team assistant or one Reviews screen. The manager keeps the decision.',
    date: '2026-09-09',
    steps: 7,
    status: 'built',
    routines: ['/api/cron/probation-reviews/', '/api/cron/performance-reviews/'],
  },
  {
    slug: 'one-on-one-coaching',
    title: 'The Biweekly 1-1 Coaching Cycle',
    category: 'Talent',
    excerpt:
      'AI preps every 1-1, a human holds it, and AI drafts a two-tier recap that publishes only after the coach reviews it. Check-ins loop into the next prep, and a trend report after each 1-1 feeds the coaching focus back in.',
    date: '2026-08-10',
    steps: 5,
    status: 'built',
    routines: ['/api/cron/coaching-cycle/', '/api/cron/coaching-recaps/'],
  },
  {
    slug: 'leadership-coach-program',
    title: 'The Leadership Coach: AI Program Plan',
    category: 'Talent',
    excerpt:
      'The 5D program plan behind our coaching system: the problem, the data, the workflow design, the ROI, and the deployment, with two-tier privacy enforced in code instead of discipline.',
    date: '2026-08-10',
    steps: 5,
    status: 'built',
    routines: ['/api/cron/coaching-cycle/', '/api/cron/coaching-recaps/'],
  },
  {
    slug: 'blog-publishing',
    title: 'How We Publish',
    category: 'Operations',
    excerpt:
      'The four-stage pipeline behind every post on this site. A human creates and approves, Claude builds and logs.',
    date: '2026-04-12',
    steps: 4,
    status: 'built',
    routines: ['/api/cron/blog-publish/'],
  },
  {
    slug: 'monthly-invoicing',
    title: 'Monthly Invoicing',
    category: 'Operations',
    excerpt:
      'One billing cycle, four dates, zero chasing. Created on the 31st, dated to the 1st, due on the 20th, escalated after.',
    date: '2026-03-20',
    steps: 5,
    status: 'planned',
  },
  {
    slug: 'contractor-payments',
    title: 'Contractor Hours + Payment',
    category: 'Operations',
    excerpt:
      'Every piece of contractor work moves through one loop: request, estimate, approval, delivery, and a monthly payment run.',
    date: '2026-07-16',
    steps: 7,
    status: 'built',
    routines: ['/api/cron/contractor-payments/'],
  },
  {
    slug: 'recruitment',
    title: 'Recruitment: Three Loops, One Pool',
    category: 'Talent',
    excerpt:
      'Not a pipeline: demand, sourcing, and selection run as continuous loops around one candidate pool that never forgets. Backward moves are normal, and every exit is a pool entry.',
    date: '2026-08-10',
    steps: 14,
    status: 'planned',
  },
  {
    slug: 'new-member-onboarding',
    title: 'New Member Onboarding',
    category: 'Talent',
    excerpt:
      'A recruiter marks an applicant hired, and the new member walks themselves in: one form turns an applicant into an employee on probation with a portal account waiting.',
    date: '2026-07-20',
    steps: 7,
    status: 'planned',
  },
  {
    slug: 'edge8-onboarding-cycle',
    title: 'Edge8 Onboarding Cycle',
    category: 'Talent',
    excerpt:
      'Every new hire moves through six stages on a kanban board that runs itself: the system chases the plan, sends the surveys, and flips the status. Managers make one decision, at Day 45.',
    date: '2026-07-22',
    steps: 6,
    status: 'built',
    routines: ['/api/cron/onboarding-cycle/'],
  },
  {
    slug: 'time-off',
    title: 'Time Off',
    category: 'Operations',
    excerpt:
      'Leave requests move from the team portal to an admin decision to an updated balance without a single chat message.',
    date: '2026-07-16',
    steps: 5,
    status: 'planned',
  },
  {
    slug: 'event-registration',
    title: 'Event Registration',
    category: 'Revenue',
    excerpt:
      'Admin creates an event, the public signs up, Stripe takes payment, a webhook confirms the seat. No human in the middle.',
    date: '2026-07-16',
    steps: 5,
    status: 'planned',
  },
  {
    slug: 'invoice-sync',
    title: 'QuickBooks Invoice Sync',
    category: 'Operations',
    excerpt:
      'A weekly sync pulls every invoice out of QuickBooks and maps it to the CRM, so revenue truth lives in one place.',
    date: '2026-07-16',
    steps: 4,
    status: 'built',
    routines: ['/api/cron/qbo-invoice-sync/', '/api/cron/qbo-refresh/'],
  },
  {
    slug: 'monthly-expenses',
    title: 'Monthly Expense Entry',
    category: 'Operations',
    excerpt:
      'Bank transactions become a categorized finance sheet, the sheet becomes QuickBooks entries, and the P&L confirms the month. Every expense entered, every pass-through billed.',
    date: '2026-07-18',
    steps: 8,
    status: 'planned',
  },
  {
    slug: 'monthly-pnl',
    title: 'Monthly P&L',
    category: 'Operations',
    excerpt:
      'Invoices sync from QuickBooks all month and expenses are entered by hand, then the month closes into a published P&L days after month end.',
    date: '2026-07-16',
    steps: 4,
    status: 'planned',
  },
  {
    slug: 'surveys',
    title: 'Survey Collection',
    category: 'Operations',
    excerpt:
      'Create a survey, share one link, and see every response in the admin the moment it is submitted. Feedback without the spreadsheet.',
    date: '2026-07-16',
    steps: 4,
    status: 'planned',
  },
  {
    slug: 'ideas-backlog',
    title: 'Ideas Backlog',
    category: 'Innovation',
    excerpt:
      'Anyone on the team submits an idea through the 5D framework, AI turns it into a full product plan, and admins triage a ready backlog.',
    date: '2026-07-16',
    steps: 5,
    status: 'built',
    routines: ['/api/cron/ideas-digest/', '/api/cron/idea-trends/'],
  },
  {
    slug: 'daily-check-in-agent',
    title: 'Daily Check-in Agent',
    category: 'Operations',
    excerpt:
      'The stand-up, read off the Workboard: a 09:00 reminder, then a 09:30 agent that posts done yesterday, doing today and blockers per team to Lark, naming anyone whose cards went quiet and anyone off that day.',
    date: '2026-09-08',
    steps: 5,
    status: 'built',
    routines: ['/api/cron/check-in-reminder/', '/api/cron/daily-check-in/'],
  },
  {
    slug: 'lark-scheduler-to-crm-updates',
    title: 'Lark Scheduler to CRM Updates',
    category: 'Revenue',
    excerpt:
      'Two scheduled tasks on the founder\u2019s machine bracket every sales call: bookings become CRM leads before the call, and recorded calls become complete CRM records, drafted follow-ups, and coaching notes after it.',
    date: '2026-08-14',
    steps: 7,
    status: 'planned',
  },
  {
    slug: 'certification',
    title: 'Challenge-Based Certification',
    category: 'Innovation',
    excerpt:
      'Certification earned through submitted proof of real work, challenge by challenge. Attendance proves nothing; artifacts do.',
    date: '2026-07-16',
    steps: 5,
    status: 'built',
    routines: ['/api/cron/certifications-sync/'],
  },
  {
    slug: 'client-work-requests',
    title: 'Client Work Requests',
    category: 'Revenue',
    excerpt:
      'Clients brief a contractor in the portal, approve the estimate, and accept the finished work. The invoice sends itself the moment they do.',
    date: '2026-07-18',
    steps: 6,
    status: 'planned',
  },
  {
    slug: 'lead-capture',
    title: 'Lead Capture to CRM',
    category: 'Revenue',
    excerpt:
      'From a form submission to a customer record: a spam gate filters the noise, and every real inquiry becomes a tracked lead.',
    date: '2026-07-16',
    steps: 6,
    status: 'planned',
  },
  {
    slug: 'infinite-leverage-retreats',
    title: 'Infinite Leverage Retreats',
    category: 'Operations',
    excerpt:
      'A founder ships real AI programs alongside the team in a few days. People run the room; the admin runs the money, capturing every cost live so profit is known the day the retreat ends.',
    date: '2026-07-24',
    steps: 5,
    status: 'planned',
  },
  {
    slug: 'performance',
    title: 'How We Think About Speed',
    category: 'Innovation',
    excerpt:
      'When the product feels slow, we measure before we optimize and prove the win after. A human sets the target and owns the risk; AI finds the real bottleneck and adversarially verifies every fix before it ships.',
    date: '2026-07-20',
    steps: 7,
    status: 'planned',
  },
  {
    slug: 'email-broadcasts',
    title: 'Email Broadcasts',
    category: 'Revenue',
    excerpt:
      'A scheduled broadcast sends itself in batches, one call per recipient, and three days later a settled summary with a one-line takeaway lands in the Marketing chat.',
    date: '2026-09-12',
    steps: 6,
    status: 'built',
    routines: ['/api/cron/email-campaign-send/', '/api/cron/broadcast-summary/'],
  },
  {
    slug: 'marketing-reporting',
    title: 'Marketing Reporting',
    category: 'Revenue',
    excerpt:
      'Three agents keep marketing honest: a daily reminder of posts due, a Monday facts-only pulse, and a monthly recap that asks Claude what to write next.',
    date: '2026-09-12',
    steps: 5,
    status: 'built',
    routines: ['/api/cron/marketing-digest/', '/api/cron/marketing-weekly-pulse/', '/api/cron/marketing-recap/'],
  },
  {
    slug: 'letter-agent',
    title: 'The Letter Agent',
    category: 'Revenue',
    excerpt:
      'Every Monday at 07:00 an agent gathers the last ten days, picks three unsent posts, writes the Tuesday letter in the founder\u2019s voice, checks every link, and parks it as a draft with a test in the approver\u2019s inbox. It never sends to the list.',
    date: '2026-09-12',
    steps: 8,
    status: 'built',
    routines: ['/api/cron/letter-weekly/', '/api/cron/letter-agent/'],
  },
  {
    slug: 'writer-agent',
    title: 'The Writer Agent',
    category: 'Revenue',
    excerpt:
      'One button on the campaign hub, or the hourly schedule the day before a campaign date, starts a run that drafts, edits, optimises, illustrates, links, assembles and validates a post one step per function, handing itself on until it parks for a person to publish or schedules itself for its date.',
    date: '2026-09-12',
    steps: 10,
    status: 'built',
    routines: ['/api/cron/writer-agent/', '/api/cron/writer-schedule/'],
  },
  {
    slug: 'human-token-tracker',
    title: 'Human Token Tracker',
    category: 'Innovation',
    excerpt:
      'Nightly agents pull pull requests, effort logs and Claude session telemetry from every tracked repo into one ledger, so the human and AI effort behind each project is a number, not a feeling.',
    date: '2026-09-12',
    steps: 5,
    status: 'built',
    routines: ['/api/cron/htt-sync-prs/', '/api/cron/htt-ingest-effort-logs/', '/api/cron/htt-refresh-summaries/', 'mac-mini:htt-nightly-sync'],
  },
  {
    slug: 'board-digest',
    title: 'Board Digest',
    category: 'Operations',
    excerpt:
      'Every morning each team member gets one email with their open board cards, grouped by board, oldest due first, overdue flagged. The board is the to-do list; the digest is the reminder.',
    date: '2026-09-12',
    steps: 4,
    status: 'built',
    routines: ['/api/cron/board-digest/'],
  },
  {
    slug: 'key-result-sync',
    title: 'Key Result Sync',
    category: 'Operations',
    excerpt:
      'A nightly agent reads the numbers the company already produces, writes them into the key results that track them, and logs each value, so an agent-sourced KR never waits on a manual check-in.',
    date: '2026-09-12',
    steps: 4,
    status: 'built',
    routines: ['/api/cron/kr-agent-sync/'],
  },
]
