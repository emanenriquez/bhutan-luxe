import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preferred Discovery Dates — Bhutan-Luxe",
  description: "The ideal seasons to experience Bhutan with Bhutan-Luxe.",
};

const windows = [
  {
    name: "The Signature Season",
    dates: "Late October – Mid November",
    description:
      "Crisp mountain air, golden valleys, and some of the clearest Himalayan vistas of the year.",
    bullets: [
      "Exceptional Himalayan views",
      "Dry and comfortable weather",
      "Autumn colors across the valleys",
      "Jambay Lhakhang Drup and Prakhar Duchhoed festivals in Bumthang",
      "Black-Necked Crane Festival in Gangtey (November)",
    ],
    consideration: "Premium lodges should be reserved well in advance.",
    color: "#D4A843",
  },
  {
    name: "The Season of Renewal",
    dates: "Mid March – Late April",
    description:
      "Spring brings flowering valleys, vibrant monasteries, and Bhutan at its most colorful.",
    bullets: [
      "Blooming rhododendrons and wildflowers",
      "Pleasant temperatures",
      "Excellent hiking conditions",
      "Paro Tshechu, Bhutan's most celebrated festival",
      "Lush landscapes emerge across the valleys",
    ],
    consideration: "Popular travel period, especially during festivals.",
    color: "#FF8C00",
  },
  {
    name: "Quiet Luxury",
    dates: "Early December",
    description:
      "A quieter Bhutan, where peaceful valleys and crisp mountain air create an atmosphere of rare serenity.",
    bullets: [
      "Fewer visitors",
      "Clear mountain visibility",
      "Tranquil lodges and trails",
      "Comfortable daytime temperatures",
    ],
    consideration: "Evenings can be cool in higher elevations.",
    color: "#F7F5F0",
  },
  {
    name: "Serenity Before Spring",
    dates: "Late February – Early March",
    description:
      "Experience Bhutan before the crowds, when clear skies return and the first signs of spring begin to appear.",
    bullets: [
      "Lower visitor numbers",
      "Punakha Drubchen and Punakha Tshechu celebrations",
      "Emerging spring landscapes",
      "Often excellent visibility",
    ],
    consideration: "Some regions remain chilly.",
    color: "#A8C5A0",
  },
];

export default function WeatherGuide() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #3B3A36; color: #F7F5F0; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* TOPBAR */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "rgba(59,58,54,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="Bhutan-Luxe" style={{ height: 48, width: "auto" }} />
        </Link>
        <Link href="/#tiers" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "#FF8C00", border: "none", cursor: "pointer", padding: "9px 18px", borderRadius: 8 }}>
          Inquire Privately ↗
        </Link>
      </div>

      {/* HERO */}
      <div style={{ background: "url('/hero-cover.jpg') center/cover no-repeat", minHeight: 340, display: "flex", alignItems: "flex-end", paddingTop: 80 }}>
        <div style={{ width: "100%", background: "linear-gradient(to top, rgba(59,58,54,0.95) 0%, rgba(59,58,54,0.4) 60%, transparent 100%)", padding: "60px 56px 40px" }}>
          <div style={{ marginLeft: "auto", maxWidth: 560, textAlign: "left" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1, fontWeight: 400, color: "#F7F5F0" }}>
              Preferred Discovery <em style={{ fontStyle: "italic", color: "#FF8C00" }}>Dates</em>
            </h1>
          </div>
        </div>
      </div>

      {/* WINDOWS */}
      <div style={{ background: "#2D5016", padding: "48px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, lineHeight: 1.7, color: "rgba(247,245,240,0.85)", fontStyle: "italic", paddingBottom: 36, borderBottom: "1px solid rgba(212,168,67,0.3)" }}>
            From flowering spring valleys to the crystal-clear skies of autumn, Bhutan's beauty is shaped by the changing seasons. Each travel period reveals a different facet of the Kingdom—vibrant festivals, tranquil monasteries, pristine mountain landscapes, and enduring traditions that continue to shape daily life. The travel windows below offer the most rewarding opportunities to experience Bhutan's authenticity, serenity, and timeless allure.
          </p>
          {windows.map((w, i) => (
            <div key={i} style={{ borderLeft: `4px solid ${w.color}`, paddingLeft: 36 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 12 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, color: w.color, fontStyle: "italic" }}>{w.name}</h2>
                <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(247,245,240,0.6)", textTransform: "uppercase" }}>{w.dates}</span>
              </div>
              <p style={{ fontSize: 16, color: "rgba(247,245,240,0.85)", lineHeight: 1.7, maxWidth: 640, marginBottom: 16 }}>{w.description}</p>
              <ul style={{ paddingLeft: 28, listStyle: "none", display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                {w.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: 14, color: "rgba(247,245,240,0.75)", display: "flex", gap: 10 }}>
                    <span style={{ color: w.color, flexShrink: 0 }}>✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(247,245,240,0.4)" }}>
                Consideration: <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>{w.consideration}</span>
              </p>
            </div>
          ))}
          <p style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(247,245,240,0.35)", fontStyle: "italic", paddingTop: 8 }}>
            * Festival dates vary annually according to the Bhutanese lunar calendar.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#3B3A36", padding: "72px 56px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, color: "#F7F5F0", marginBottom: 20 }}>Ready to plan your journey?</h2>
        <Link href="/#tiers" style={{ display: "inline-block", background: "#FF8C00", color: "#000", fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 8 }}>
          Inquire Privately ↗
        </Link>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#2D5016", padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(247,245,240,0.5)", letterSpacing: "0.1em" }}>← Back to Bhutan-Luxe</Link>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(247,245,240,0.35)", letterSpacing: "0.1em" }}>© Bhutan-Luxe Travel · Houston, Texas</span>
      </div>
    </>
  );
}
