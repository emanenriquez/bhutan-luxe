"use client";

import Link from "next/link";
import { useState } from "react";

const paths = [
  { label: "Discovery Path", href: "/itinerary/discovery", price: "from $11,500" },
  { label: "Immersion Path", href: "/itinerary/immersion", price: "from $18,000" },
  { label: "Extraordinary Path", href: "/itinerary/extraordinary", price: "from $35,000" },
];

const secondary = [
  { label: "Preferred Path Dates", href: "/weather-guide" },
  { label: "Frequent Questions", href: "/faq" },
  { label: "Partner Testimonies", href: "/testimonials" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          alignItems: "flex-end",
        }}
      >
        <span style={{ display: "block", width: 22, height: 2, background: "#F7F5F0", borderRadius: 1 }} />
        <span style={{ display: "block", width: 22, height: 2, background: "#F7F5F0", borderRadius: 1 }} />
        <span style={{ display: "block", width: 14, height: 2, background: "#F7F5F0", borderRadius: 1 }} />
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(41,40,36,0.98)",
            display: "flex",
            flexDirection: "column",
            padding: "22px 40px 32px",
          }}
        >
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#D4A843", fontSize: 22, letterSpacing: "0.06em", textDecoration: "none" }}
            >
              BL
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 8, lineHeight: 1 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M16 4L4 16" stroke="#F7F5F0" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,168,67,0.65)", margin: "0 0 14px" }}>
              Three Paths
            </p>

            {paths.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(22px, 3.5vw, 32px)",
                  fontWeight: 400,
                  color: "#F7F5F0",
                  textDecoration: "none",
                  padding: "10px 0",
                  borderBottom: "0.5px solid rgba(247,245,240,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {p.label}
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "rgba(247,245,240,0.35)", fontWeight: 400, letterSpacing: "0.08em" }}>
                  {p.price}
                </span>
              </Link>
            ))}

            <div style={{ marginTop: 28 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,168,67,0.65)", margin: "0 0 10px" }}>
                Plan
              </p>
              {secondary.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: "rgba(247,245,240,0.55)",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    padding: "5px 0",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Bottom CTA */}
          <div style={{ paddingTop: 20, borderTop: "0.5px solid rgba(212,168,67,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => {
                setOpen(false);
                window.location.href = "/?inquiry=open";
              }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#000",
                background: "#FF8C00",
                padding: "12px 24px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              Concierge Inquiry ↗
            </button>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "rgba(247,245,240,0.25)", letterSpacing: "0.08em" }}>
              bhutan-luxe.com
            </span>
          </div>
        </div>
      )}
    </>
  );
}
