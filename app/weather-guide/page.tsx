import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preferred Travel Dates — Bhutan-Luxe",
  description: "The ideal seasons to experience Bhutan with Bhutan-Luxe.",
};

const windows = [
  {
    name: "Autumn Gold",
    dates: "Oct 10 – Nov 15",
    description:
      "Bhutan's most celebrated season. Crisp mountain air, vivid foliage, and exceptional visibility to the high peaks. Festival season brings traditional ceremonies and cultural events to life across the Kingdom.",
    ideal: "First-time visitors, trekkers, festival-seekers",
    color: "#D4A843",
  },
  {
    name: "Spring Bloom",
    dates: "Mar 20 – Apr 25",
    description:
      "Rhododendrons blanket the hillsides in colour as the valleys warm and the landscape renews. A quieter, more intimate season with comfortable temperatures and fewer visitors.",
    ideal: "Nature lovers, photographers, those seeking tranquility",
    color: "#FF8C00",
  },
  {
    name: "\"Insulated Insider\"",
    dates: "Jan 15 – Feb 15",
    description:
      "Bhutan's best-kept secret. Cold, crisp, and extraordinarily quiet. The Kingdom belongs almost entirely to you. Monasteries, valleys, and sacred sites without the crowds — an insider's Bhutan.",
    ideal: "Repeat visitors, those seeking exclusivity and solitude",
    color: "#F7F5F0",
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
              Preferred Travel <em style={{ fontStyle: "italic", color: "#FF8C00" }}>Dates</em>
            </h1>
          </div>
        </div>
      </div>

      {/* WINDOWS */}
      <div style={{ background: "#2D5016", padding: "80px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, lineHeight: 1.7, color: "rgba(247,245,240,0.85)", fontStyle: "italic", paddingBottom: 36, borderBottom: "1px solid rgba(212,168,67,0.3)" }}>
            Navigating Bhutan's luxury ecosystem anchored by Amankora, Six Senses, and COMO demands solid planning around the best dates. Travel windows are defined by spectacular mountain views and vibrant cultural festivals, mild weather and low rainfall for comfortable luxury journeys. It also ensures exclusive access to premium lodges, private guides, and bespoke experiences.
          </p>
          {windows.map((w, i) => (
            <div key={i} style={{ borderLeft: `4px solid ${w.color}`, paddingLeft: 36 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 12 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, color: w.color, fontStyle: "italic" }}>{w.name}</h2>
                <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(247,245,240,0.6)", textTransform: "uppercase" }}>{w.dates}</span>
              </div>
              <p style={{ fontSize: 16, color: "rgba(247,245,240,0.85)", lineHeight: 1.7, maxWidth: 640, marginBottom: 12 }}>{w.description}</p>
              <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(247,245,240,0.45)" }}>Ideal for: {w.ideal}</p>
            </div>
          ))}
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
