"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { updateStrategy } from "../actions";
import {
  blankCard,
  cardsFromMarkdown,
  markdownFromCards,
  KIND_LABEL,
  STATEMENT_HEADINGS,
  type CardKind,
  type StrategyCard,
} from "@/entities/org/lib/company/strategy-doc";

// The edit shell around the read-only StrategyView. Editing shows the strategy
// as cards: add one of any kind, edit its heading and body, reorder, and show
// or hide it. Hidden cards stay in the document and come back when shown.
// Everything serialises to the same `body_md` markdown the view renders.
export function StrategyEditor({
  id,
  initialTitle,
  initialBody,
  children,
}: {
  id: string;
  initialTitle: string;
  initialBody: string;
  children: ReactNode; // the read-only StrategyView
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [cards, setCards] = useState<StrategyCard[]>(() => cardsFromMarkdown(initialBody));
  const [addKind, setAddKind] = useState<CardKind>("statement");
  const [banner, setBanner] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const hiddenCount = cardsFromMarkdown(initialBody).filter((c) => c.hidden).length;

  function patch(cardId: string, changes: Partial<StrategyCard>) {
    setCards((cs) => cs.map((c) => (c.id === cardId ? { ...c, ...changes } : c)));
  }
  function move(cardId: string, dir: -1 | 1) {
    setCards((cs) => {
      const i = cs.findIndex((c) => c.id === cardId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cs.length) return cs;
      const next = [...cs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function remove(cardId: string) {
    setCards((cs) => cs.filter((c) => c.id !== cardId));
  }
  function add() {
    setCards((cs) => [...cs, blankCard(addKind)]);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);
    startTransition(async () => {
      const res = await updateStrategy(id, { title, body_md: markdownFromCards(cards) });
      if (res.ok) {
        setBanner({ tone: "ok", text: "Strategy saved." });
        setEditing(false);
        router.refresh();
      } else {
        setBanner({ tone: "err", text: res.error });
      }
    });
  }

  function cancel() {
    setTitle(initialTitle);
    setCards(cardsFromMarkdown(initialBody));
    setEditing(false);
    setBanner(null);
  }

  return (
    <>
      {banner && <div className={`admin-alert admin-alert--${banner.tone === "ok" ? "ok" : "err"}`}>{banner.text}</div>}

      <div className="admin-form-actions u-mb-4">
        {editing ? (
          <button className="admin-btn" onClick={cancel} disabled={pending}>
            Cancel
          </button>
        ) : (
          <>
            <button className="admin-btn admin-btn--primary" onClick={() => setEditing(true)}>
              Edit strategy
            </button>
            {hiddenCount > 0 && (
              <span className="admin-cell-muted u-sm">
                {hiddenCount} hidden {hiddenCount === 1 ? "card" : "cards"}
              </span>
            )}
          </>
        )}
      </div>

      {editing ? (
        <form className="admin-form" onSubmit={save}>
          <div className="admin-field">
            <label className="admin-label" htmlFor="strat-title">
              The aspirational line
            </label>
            <input
              id="strat-title"
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
              required
            />
          </div>

          {cards.map((card, i) => (
            <section
              key={card.id}
              className={`admin-card admin-section-card u-mb-3${card.hidden ? " admin-row-archived" : ""}`}
            >
              <div className="admin-card-head">
                <div className="admin-label-row">
                  <span className="admin-section-label">{KIND_LABEL[card.kind]}</span>
                  {card.hidden && <span className="admin-cell-muted u-sm">hidden</span>}
                </div>
                <div className="admin-form-actions">
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => move(card.id, -1)} disabled={i === 0} aria-label="Move up">
                    ↑
                  </button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => move(card.id, 1)} disabled={i === cards.length - 1} aria-label="Move down">
                    ↓
                  </button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => patch(card.id, { hidden: !card.hidden })}>
                    {card.hidden ? "Show" : "Hide"}
                  </button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(card.id)}>
                    Remove
                  </button>
                </div>
              </div>

              {(card.kind === "statement" || card.kind === "line" || card.kind === "custom") && (
                <div className="admin-field">
                  <label className="admin-label" htmlFor={`h-${card.id}`}>
                    Heading
                  </label>
                  {card.kind === "statement" ? (
                    <select
                      id={`h-${card.id}`}
                      className="admin-select"
                      value={card.heading}
                      onChange={(e) => patch(card.id, { heading: e.target.value })}
                    >
                      {STATEMENT_HEADINGS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`h-${card.id}`}
                      className="admin-input"
                      value={card.heading}
                      onChange={(e) => patch(card.id, { heading: e.target.value })}
                      maxLength={120}
                    />
                  )}
                </div>
              )}

              <div className="admin-field">
                <label className="admin-label" htmlFor={`b-${card.id}`}>
                  {card.kind === "themes" ? "One theme per line, as `- 2026: Theme`" : "Text (markdown)"}
                </label>
                <textarea
                  id={`b-${card.id}`}
                  className="admin-textarea"
                  rows={card.kind === "statement" ? 3 : 6}
                  value={card.body}
                  onChange={(e) => patch(card.id, { body: e.target.value })}
                />
              </div>
            </section>
          ))}

          <div className="admin-form-row u-mb-4">
            <select className="admin-select admin-select--sm" value={addKind} onChange={(e) => setAddKind(e.target.value as CardKind)}>
              {(Object.keys(KIND_LABEL) as CardKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </select>
            <button type="button" className="admin-btn" onClick={add}>
              Add card
            </button>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
              {pending ? "Saving…" : "Save strategy"}
            </button>
            <button type="button" className="admin-btn" onClick={cancel} disabled={pending}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        children
      )}
    </>
  );
}
