// The strategy as a list of cards, round-tripped to and from the `body_md`
// markdown the shared StrategyView and the team page read. Storage stays a
// single markdown column; this module is the only place that knows the shape.
//
//   ## Heading            a top-level card (statement, overview, themes, custom)
//   <!-- hidden -->       optional first line: the card is kept but not shown
//   ## Business Lines     the one section whose `###` children are line cards
//
// Hidden cards survive a save and reappear when un-hidden, so nothing an
// operator writes is lost by toggling it off.
export const HIDDEN_MARK = "<!-- hidden -->";

export type CardKind = "statement" | "overview" | "themes" | "line" | "custom";

export type StrategyCard = {
  id: string;
  kind: CardKind;
  heading: string;
  body: string;
  hidden: boolean;
};

export const STATEMENT_HEADINGS = ["Mission", "Vision", "Ambition", "Purpose", "Value Proposition", "Positioning", "Promise"];

const isStatement = (h: string) => STATEMENT_HEADINGS.some((s) => s.toLowerCase() === h.toLowerCase());

let seq = 0;
export const newId = () => `c${Date.now().toString(36)}${(seq++).toString(36)}`;

function splitHidden(body: string): { hidden: boolean; body: string } {
  const lines = body.split("\n");
  if (lines[0]?.trim() === HIDDEN_MARK) return { hidden: true, body: lines.slice(1).join("\n").trim() };
  return { hidden: false, body: body.trim() };
}

function sectionsOf(md: string, level: 2 | 3): { heading: string; body: string }[] {
  const re = level === 2 ? /^##\s+(.+)$/ : /^###\s+(.+)$/;
  const out: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string } | null = null;
  for (const line of md.split("\n")) {
    const h = line.match(re);
    if (h) {
      if (current) out.push(current);
      current = { heading: h[1].trim(), body: "" };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) out.push(current);
  return out;
}

/** Markdown → cards, hidden ones included (this is the editor's model). */
export function cardsFromMarkdown(md: string): StrategyCard[] {
  const cards: StrategyCard[] = [];
  for (const s of sectionsOf(md, 2)) {
    const key = s.heading.toLowerCase();
    if (key === "business lines") {
      const { hidden: groupHidden, body } = splitHidden(s.body);
      for (const line of sectionsOf(body, 3)) {
        const { hidden, body: lb } = splitHidden(line.body);
        cards.push({ id: newId(), kind: "line", heading: line.heading, body: lb, hidden: hidden || groupHidden });
      }
      continue;
    }
    const { hidden, body } = splitHidden(s.body);
    const kind: CardKind = key === "overview" ? "overview" : key === "themes" ? "themes" : isStatement(s.heading) ? "statement" : "custom";
    cards.push({ id: newId(), kind, heading: s.heading, body, hidden });
  }
  return cards;
}

/** Cards → markdown. Business lines are grouped where the first one sits. */
export function markdownFromCards(cards: StrategyCard[]): string {
  const parts: string[] = [];
  let linesEmitted = false;
  for (const c of cards) {
    if (c.kind === "line") {
      if (linesEmitted) continue;
      linesEmitted = true;
      const lines = cards
        .filter((x) => x.kind === "line")
        .map((x) => `### ${x.heading.trim() || "Untitled"}\n${x.hidden ? HIDDEN_MARK + "\n" : ""}${x.body.trim()}`)
        .join("\n\n");
      parts.push(`## Business Lines\n${lines}`);
      continue;
    }
    const heading = c.kind === "overview" ? "Overview" : c.kind === "themes" ? "Themes" : c.heading.trim() || "Untitled";
    parts.push(`## ${heading}\n${c.hidden ? HIDDEN_MARK + "\n" : ""}${c.body.trim()}`);
  }
  return parts.join("\n\n") + "\n";
}

export const KIND_LABEL: Record<CardKind, string> = {
  statement: "Statement",
  overview: "Overview",
  themes: "Themes by year",
  line: "Business line",
  custom: "Custom section",
};

export function blankCard(kind: CardKind): StrategyCard {
  const heading = kind === "overview" ? "Overview" : kind === "themes" ? "Themes" : kind === "statement" ? "Mission" : kind === "line" ? "New business line" : "New section";
  const body = kind === "themes" ? `- ${new Date().getFullYear()}: ` : "";
  return { id: newId(), kind, heading, body, hidden: false };
}
