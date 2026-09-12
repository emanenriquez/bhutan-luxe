import { describe, it, expect } from "vitest";
import { cardsFromMarkdown, markdownFromCards } from "@/entities/org/lib/company/strategy-doc";
import { parseSections, parseSubsections } from "@/entities/org/lib/company/strategy";
describe("strategy-doc", () => {
  it("round-trips and hides", () => {
    const md = "## Mission\nBe kind.\n\n## Business Lines\n### A\n<!-- hidden -->\nx\n\n### B\ny\n\n## Overview\n<!-- hidden -->\nhello\n";
    const cards = cardsFromMarkdown(md);
    expect(cards.map((c) => [c.kind, c.heading, c.hidden])).toEqual([["statement","Mission",false],["line","A",true],["line","B",false],["overview","Overview",true]]);
    const out = markdownFromCards(cards);
    expect(cardsFromMarkdown(out).map((c) => [c.kind, c.hidden])).toEqual(cards.map((c) => [c.kind, c.hidden]));
    expect(parseSections(out).map((s) => s.heading)).toEqual(["Mission", "Business Lines"]);
    expect(parseSubsections(parseSections(out)[1].body).map((s) => s.heading)).toEqual(["B"]);
  });
});
