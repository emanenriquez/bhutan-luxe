'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { LibraryCategory, LibraryItem } from '@/entities/library/lib/privateLibraryData'

export type { LibraryCategory, LibraryItem }

const TABS: { key: LibraryCategory; label: string }[] = [
  { key: 'plan', label: 'Plans' },
  { key: 'workflow', label: 'Workflows' },
  { key: 'prototype', label: 'Prototypes' },
  { key: 'data', label: 'Data' },
]

const EMPTY_COPY: Record<LibraryCategory, string> = {
  plan: 'No plans here yet. Coming soon.',
  workflow: 'No workflows here yet. Coming soon.',
  prototype: 'No prototypes here yet. Coming soon.',
  data: 'No data views here yet. Coming soon.',
}

export default function PrivateLibrary({ items }: { items: LibraryItem[] }) {
  const counts = useMemo(() => {
    return TABS.reduce(
      (acc, t) => ({ ...acc, [t.key]: items.filter((i) => i.category === t.key).length }),
      {} as Record<LibraryCategory, number>,
    )
  }, [items])

  // Default to the first tab that has content, else Plans.
  const firstNonEmpty = TABS.find((t) => counts[t.key] > 0)?.key ?? 'plan'
  const [tab, setTab] = useState<LibraryCategory>(firstNonEmpty)
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const visible = useMemo(() => {
    return items
      .filter((i) => i.category === tab)
      .filter(
        (i) =>
          q === '' ||
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      )
  }, [items, tab, q])

  const inTabCount = counts[tab]

  return (
    <>

      <div className="plib-controls">
        <div className="plib-tabs" role="tablist" aria-label="Library category">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={`plib-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              <span className="count">{counts[t.key]}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          className="plib-search"
          placeholder="Search this library…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search library"
        />
      </div>

      {inTabCount === 0 ? (
        <p className="plib-empty">{EMPTY_COPY[tab]}</p>
      ) : visible.length === 0 ? (
        <p className="plib-empty">No matches for &ldquo;{query}&rdquo; in this tab.</p>
      ) : (
        <div className="plib-grid">
          {visible.map((i) => (
            <Link key={i.href} href={i.href} className="wf-problem u-block">
              <strong>{i.title}</strong> {i.description}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
