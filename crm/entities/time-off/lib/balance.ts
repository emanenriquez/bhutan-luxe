// Leave balance arithmetic, computed from a policy's rules instead of read from
// the Day Off snapshot (plan: private-docs/workflows/private/e8/pto-policies-plan.html).
//
// A policy is a small set of rules: how the service year is counted (calendar
// year or the anniversary of the day probation ended), how often hours post
// (monthly or twice a month), an entitlement per service year that steps up
// with tenure, a carry-over cap applied once a year, and which leave types draw
// from the bank. Everything here is pure: dates in, numbers out, so a test can
// ask "what was this person's balance on a given day" and a page can ask the
// same question for today. Nothing is stored; the ledger is the approved
// time_off rows plus manual leave_adjustments, and the balance is recomputed
// from them on every read.
//
// Hours are the unit inside, because the client policy that motivated this
// accrues 3.34 hours a period; days are hours divided by the policy's day
// length and appear only at the edge, in the numbers a page shows.
import { countWorkingDays } from "./leave";

export type YearBasis = "calendar" | "anniversary";
export type AccrualCadence = "none" | "monthly" | "semi_monthly";

export type AccrualTier = { fromYear: number; hoursPerYear: number };

export type AccrualPolicy = {
  yearBasis: YearBasis;
  cadence: AccrualCadence;
  // Ordered by fromYear ascending; the tier in force is the last one whose
  // fromYear is at or below the current service year.
  tiers: AccrualTier[];
  hoursPerDay: number;
  // Null means unused hours carry without limit; 0 means nothing carries.
  carryCapHours: number | null;
  minIncrementHours: number;
  bankLeaveTypes: string[];
};

export type UsageRow = {
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  status: string;
  leaveType: string;
  hours: number | null;
};

export type AdjustmentRow = {
  effectiveDate: string;
  deltaDays: number;
};

export type BalanceInput = {
  policy: AccrualPolicy;
  // The day accrual starts and the service year is counted from: the day the
  // person passed probation (their first labour contract), falling back to
  // their start date when probation is not recorded.
  anniversaryDate: string | null;
  asOf: string;
  usage: UsageRow[];
  adjustments: AdjustmentRow[];
  // A known balance on a given day, in hours. When present, nothing dated on or
  // before that day is walked: the anchor stands in for all of it. This is how
  // the Day Off opening balances are honoured for people whose history the
  // import did not carry in full.
  anchor?: { date: string; hours: number } | null;
};

export type LeaveBalance = {
  // False when the policy has no accrual rules, so callers can fall back.
  hasRules: boolean;
  serviceYear: number;
  // The Day Off opening balance the walk started from, if any.
  anchorHours: number;
  tier: { hoursPerYear: number; hoursPerPeriod: number } | null;
  accruedHours: number;
  adjustedHours: number;
  usedHours: number;
  forfeitedHours: number;
  remainingHours: number;
  pendingHours: number;
  nextAccrual: { date: string; hours: number } | null;
  nextStepUp: { date: string; hoursPerYear: number } | null;
  nextCapCheck: { date: string; atRiskHours: number } | null;
};

const DEDUCTING_STATUSES = new Set(["approved", "taken"]);

// Date helpers on ISO `YYYY-MM-DD` strings. Everything is done in UTC so a
// server in any zone gets the same calendar day; the inputs are dates, not
// instants, and the arithmetic never crosses a day boundary.
function parse(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}
function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function lastDayOfMonth(year: number, monthIndex: number): string {
  return iso(new Date(Date.UTC(year, monthIndex + 1, 0)));
}
function addYears(isoDate: string, years: number): string {
  const d = parse(isoDate);
  const target = new Date(Date.UTC(d.getUTCFullYear() + years, d.getUTCMonth(), d.getUTCDate()));
  // 29 February rolls to 1 March in a non-leap year; that is the right day for
  // an anniversary and matches what a person would expect.
  return iso(target);
}

// Service year N covers the N-th twelve months after the anniversary date:
// year 1 is the day probation ended up to the day before the first anniversary.
export function serviceYearOn(anniversaryDate: string, onDate: string): number {
  if (onDate < anniversaryDate) return 0;
  let year = 1;
  while (addYears(anniversaryDate, year) <= onDate) year += 1;
  return year;
}

export function tierFor(policy: AccrualPolicy, serviceYear: number): AccrualTier | null {
  let current: AccrualTier | null = null;
  for (const t of policy.tiers) {
    if (t.fromYear <= serviceYear) current = t;
  }
  return current;
}

function periodsPerYear(cadence: AccrualCadence): number {
  return cadence === "semi_monthly" ? 24 : cadence === "monthly" ? 12 : 0;
}

// Every posting date strictly after `from` and at or before `to`.
function accrualDates(cadence: AccrualCadence, from: string, to: string): string[] {
  if (cadence === "none" || to <= from) return [];
  const out: string[] = [];
  const start = parse(from);
  const end = parse(to);
  for (let y = start.getUTCFullYear(); y <= end.getUTCFullYear(); y += 1) {
    const m0 = y === start.getUTCFullYear() ? start.getUTCMonth() : 0;
    const m1 = y === end.getUTCFullYear() ? end.getUTCMonth() : 11;
    for (let m = m0; m <= m1; m += 1) {
      const dates = cadence === "semi_monthly"
        ? [iso(new Date(Date.UTC(y, m, 15))), lastDayOfMonth(y, m)]
        : [lastDayOfMonth(y, m)];
      for (const d of dates) if (d > from && d <= to) out.push(d);
    }
  }
  return out;
}

// Cap-check dates strictly after `from` and at or before `to`: each anniversary
// for anniversary policies, each 1 January for calendar ones.
function capCheckDates(policy: AccrualPolicy, anniversaryDate: string, from: string, to: string): string[] {
  const out: string[] = [];
  if (policy.yearBasis === "anniversary") {
    for (let n = 1; ; n += 1) {
      const d = addYears(anniversaryDate, n);
      if (d > to) break;
      if (d > from) out.push(d);
    }
  } else {
    for (let y = parse(from).getUTCFullYear() + 1; ; y += 1) {
      const d = `${y}-01-01`;
      if (d > to) break;
      if (d > from) out.push(d);
    }
  }
  return out;
}

export function usageHours(row: UsageRow, hoursPerDay: number): number {
  if (row.hours !== null && Number.isFinite(row.hours)) return row.hours;
  return countWorkingDays(row.startDate, row.endDate, row.isHalfDay) * hoursPerDay;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeLeaveBalance(input: BalanceInput): LeaveBalance {
  const { policy, asOf } = input;
  const empty: LeaveBalance = {
    hasRules: false,
    serviceYear: 0,
    anchorHours: 0,
    tier: null,
    accruedHours: 0,
    adjustedHours: 0,
    usedHours: 0,
    forfeitedHours: 0,
    remainingHours: 0,
    pendingHours: 0,
    nextAccrual: null,
    nextStepUp: null,
    nextCapCheck: null,
  };
  if (policy.cadence === "none" || policy.tiers.length === 0 || !input.anniversaryDate) return empty;
  const anniversary = input.anniversaryDate;
  const bank = new Set(policy.bankLeaveTypes);
  const perYear = periodsPerYear(policy.cadence);
  const anchor = input.anchor ?? null;
  // Nothing dated on or before the anchor is walked; the walk starts there.
  const from = anchor && anchor.date > anniversary ? anchor.date : anniversary;

  // One ordered stream of events. On the same day, hours post before leave is
  // deducted and the cap is checked last, so a person who takes leave on an
  // accrual day is never short by that day's posting and the cap sees the
  // balance the year actually ended with.
  type Ev = { date: string; order: number; hours: number; kind: "accrual" | "adjustment" | "usage" | "cap" };
  const events: Ev[] = [];
  let accrued = 0;
  for (const d of accrualDates(policy.cadence, from, asOf)) {
    const tier = tierFor(policy, serviceYearOn(anniversary, d));
    if (!tier) continue;
    events.push({ date: d, order: 0, hours: tier.hoursPerYear / perYear, kind: "accrual" });
  }
  for (const a of input.adjustments) {
    if (a.effectiveDate > asOf || a.effectiveDate <= from) continue;
    events.push({ date: a.effectiveDate, order: 1, hours: a.deltaDays * policy.hoursPerDay, kind: "adjustment" });
  }
  let pending = 0;
  for (const u of input.usage) {
    if (!bank.has(u.leaveType)) continue;
    if (u.status === "requested") {
      pending += usageHours(u, policy.hoursPerDay);
      continue;
    }
    if (!DEDUCTING_STATUSES.has(u.status) || u.startDate > asOf || u.startDate <= from) continue;
    events.push({ date: u.startDate, order: 2, hours: -usageHours(u, policy.hoursPerDay), kind: "usage" });
  }
  for (const d of capCheckDates(policy, anniversary, from, asOf)) {
    events.push({ date: d, order: 3, hours: 0, kind: "cap" });
  }
  events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.order - b.order));

  let balance = anchor?.hours ?? 0;
  let adjusted = 0;
  let used = 0;
  let forfeited = 0;
  for (const e of events) {
    if (e.kind === "cap") {
      if (policy.carryCapHours !== null && balance > policy.carryCapHours) {
        forfeited += balance - policy.carryCapHours;
        balance = policy.carryCapHours;
      }
      continue;
    }
    balance += e.hours;
    if (e.kind === "accrual") accrued += e.hours;
    else if (e.kind === "adjustment") adjusted += e.hours;
    else used += -e.hours;
  }

  const serviceYear = serviceYearOn(anniversary, asOf);
  const tierNow = tierFor(policy, serviceYear);

  // What comes next, for the card: the next posting, the next tier change and
  // the next cap check with the hours that would be lost if nothing were taken.
  const horizon = addYears(asOf, 2);
  const nextAccrualDate = accrualDates(policy.cadence, asOf, horizon)[0] ?? null;
  const nextAccrualTier = nextAccrualDate ? tierFor(policy, serviceYearOn(anniversary, nextAccrualDate)) : null;
  let nextStepUp: LeaveBalance["nextStepUp"] = null;
  for (const t of policy.tiers) {
    if (t.fromYear > serviceYear) {
      nextStepUp = { date: addYears(anniversary, t.fromYear - 1), hoursPerYear: t.hoursPerYear };
      break;
    }
  }
  const nextCapDate = policy.carryCapHours === null
    ? null
    : (capCheckDates(policy, anniversary, asOf, horizon)[0] ?? null);

  return {
    hasRules: true,
    serviceYear,
    anchorHours: round2(anchor?.hours ?? 0),
    tier: tierNow ? { hoursPerYear: tierNow.hoursPerYear, hoursPerPeriod: round2(tierNow.hoursPerYear / perYear) } : null,
    accruedHours: round2(accrued),
    adjustedHours: round2(adjusted),
    usedHours: round2(used),
    forfeitedHours: round2(forfeited),
    remainingHours: round2(balance),
    pendingHours: round2(pending),
    nextAccrual: nextAccrualDate && nextAccrualTier
      ? { date: nextAccrualDate, hours: round2(nextAccrualTier.hoursPerYear / perYear) }
      : null,
    nextStepUp,
    nextCapCheck: nextCapDate
      ? { date: nextCapDate, atRiskHours: round2(Math.max(0, balance - (policy.carryCapHours ?? 0))) }
      : null,
  };
}

export function hoursToDays(hours: number, hoursPerDay: number): number {
  return hoursPerDay > 0 ? Math.round((hours / hoursPerDay) * 100) / 100 : 0;
}
