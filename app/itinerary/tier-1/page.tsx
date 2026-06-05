import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Essential Bhutan Itinerary — Tier I | Bhutan-Luxe",
  description:
    "10-day curated introduction to Bhutan's spiritual heritage, dramatic landscapes, and living traditions. Paro · Thimphu · Punakha · Gangtey.",
};

const days = [
  {
    day: 1,
    title: "Welcome to Bhutan",
    body: "Arrive in Paro and receive a traditional blessing from a revered lama before traveling to Thimphu, Bhutan's tranquil capital. Settle into your surroundings and begin your journey at a relaxed pace.",
    overnight: "Zhiwaling Ascent, Thimphu",
  },
  {
    day: 2,
    title: "Traditions of the Kingdom",
    body: "Discover Bhutan's artistic and spiritual traditions through monastery visits, cultural encounters, and time spent with students preserving the Kingdom's thirteen traditional arts and crafts. End the day with evening prayers alongside local nuns.",
    overnight: "Zhiwaling Ascent, Thimphu",
  },
  {
    day: 3,
    title: "Monastic Life in the Mountains",
    body: "Hike through pine forests to the secluded Phajoding Monastery overlooking the Thimphu Valley. Share a meal with resident monks, participate in traditional ceremonies, and experience Bhutan's deeply rooted spiritual culture.",
    overnight: "Zhiwaling Ascent, Thimphu",
  },
  {
    day: 4,
    title: "Into the Punakha Valley",
    body: "Journey across the high mountain pass of Dochula before descending into the fertile Punakha Valley. Visit sacred sites, walk through traditional villages, and experience Bhutan's quieter rhythms of life.",
    overnight: "Dhensa Boutique Resort, Punakha",
  },
  {
    day: 5,
    title: "Rivers, Culture & Heritage",
    body: "Explore Punakha's remarkable landscapes through scenic hikes, a gentle river journey, traditional Bhutanese cooking experiences, and a visit to the magnificent Punakha Dzong.",
    overnight: "Dhensa Boutique Resort, Punakha",
  },
  {
    day: 6,
    title: "The Beauty of Gangtey",
    body: "Travel into the glacial valley of Phobjikha, home to sweeping landscapes, ancient monasteries, and some of Bhutan's most captivating scenery.",
    overnight: "Pinewood Resort, Gangtey",
  },
  {
    day: 7,
    title: "Life in the Valley",
    body: "Walk the renowned Gangtey Nature Trail, visit local communities, enjoy home-hosted Bhutanese hospitality, and experience the serene beauty of Phobjikha Valley.",
    overnight: "Pinewood Resort, Gangtey",
  },
  {
    day: 8,
    title: "Return to Paro",
    body: "Travel back through Bhutan's mountain landscapes to Paro, allowing time to relax and prepare for the Kingdom's most iconic experience.",
    overnight: "Naksel Boutique Hotel, Paro",
  },
  {
    day: 9,
    title: "Tiger's Nest",
    body: "Hike to the legendary Tiger's Nest Monastery, dramatically perched on a cliffside above the valley. Enjoy a private picnic, explore sacred temples, and reflect on your Bhutanese journey.",
    overnight: "Naksel Boutique Hotel, Paro",
  },
  {
    day: 10,
    title: "Departure",
    body: "Bid farewell to Bhutan and depart from Paro International Airport with memories of a Kingdom unlike any other.",
    overnight: null,
  },
];

export default function TierOneItinerary() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #3B3A36; color: #F7F5F0; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; color: #000; font-size: 10pt; line-height: 1.5; }
          .print-section { background: #fff !important; color: #000 !important; padding: 0 !important; }
          .print-day { margin-bottom: 14pt !important; padding-bottom: 14pt !important; }
          .print-day-num { font-size: 18pt !important; color: #B8860B !important; }
          .print-day-title { font-size: 12pt !important; margin-bottom: 3pt !important; color: #000 !important; }
          .print-day-body { font-size: 10pt !important; line-height: 1.45 !important; color: #333 !important; }
          .print-day-overnight { font-size: 9pt !important; margin-top: 4pt !important; color: #2D5016 !important; }
          .print-intro { background: #fff !important; color: #000 !important; padding: 0 0 14pt !important; border-bottom: 1pt solid #ccc; margin-bottom: 16pt; }
          .print-intro p { font-size: 10pt !important; color: #333 !important; font-style: italic; }
          .print-intro-meta { display: flex !important; gap: 32pt !important; margin-top: 10pt !important; }
          .print-intro-meta span { font-size: 9pt !important; color: #555 !important; }
          .print-intro-meta strong { font-size: 8pt !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; color: #B8860B !important; display: block !important; margin-bottom: 2pt !important; }
          @page { margin: 0; size: letter; }
          body { padding: 0.65in; }
        }
      `}</style>

      {/* PRINT-ONLY HEADER */}
      <div className="no-screen" style={{ display: "none" }}>
        <style>{`
          @media print {
            .no-screen { display: flex !important; align-items: center; justify-content: space-between; border-bottom: 2pt solid #B8860B; padding-bottom: 10pt; margin-bottom: 16pt; }
            .no-screen img { height: 48pt; width: auto; }
            .no-screen div { text-align: right; }
            .no-screen h1 { font-size: 16pt; font-family: 'DM Sans', sans-serif; color: #000; }
            .no-screen p { font-size: 9pt; color: #666; margin-top: 3pt; }
          }
        `}</style>
        <img src="/logo.png" alt="Bhutan-Luxe" />
        <div>
          <h1>Essential Bhutan — Tier I Sample Itinerary</h1>
          <p>10 Days · Paro · Thimphu · Punakha · Gangtey</p>
        </div>
      </div>

      {/* TOPBAR */}
      <div className="no-print" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "rgba(59,58,54,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="Bhutan-Luxe" style={{ height: 48, width: "auto" }} />
        </Link>
        <Link href="/#tiers" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "#FF8C00", border: "none", cursor: "pointer", padding: "9px 18px", borderRadius: 8 }}>
          Inquire Privately ↗
        </Link>
      </div>

      {/* HERO */}
      <div className="no-print" style={{ background: "url('/hero-cover.jpg') center/cover no-repeat", minHeight: 420, display: "flex", alignItems: "flex-end", paddingTop: 80 }}>
        <div style={{ width: "100%", background: "linear-gradient(to top, rgba(59,58,54,0.95) 0%, rgba(59,58,54,0.4) 60%, transparent 100%)", padding: "80px 56px 48px" }}>
          <div style={{ maxWidth: 560, textAlign: "left", marginLeft: "auto" }}>
            <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#FF8C00", marginBottom: 12 }}>Tier One · Sample Itinerary</p>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1, letterSpacing: "-0.012em", color: "#F7F5F0", marginBottom: 16 }}>Essential Bhutan</h1>
            <p style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(247,245,240,0.7)", letterSpacing: "0.08em" }}>10 Days &nbsp;·&nbsp; Paro · Thimphu · Punakha · Gangtey</p>
          </div>
        </div>
      </div>

      {/* INTRO */}
      <div className="no-print" style={{ background: "#2D5016", padding: "56px 56px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, lineHeight: 1.6, color: "#F7F5F0", fontStyle: "italic" }}>
            A thoughtfully curated introduction to Bhutan's spiritual heritage, dramatic landscapes, and living traditions. From monastery blessings and sacred mountain hikes to village encounters and iconic landmarks, this journey offers a meaningful first glimpse into the Kingdom's enduring way of life.
          </p>
          <div style={{ display: "flex", gap: 40, marginTop: 36, borderTop: "1px solid rgba(212,168,67,0.3)", paddingTop: 28 }}>
            {[["Duration", "10 Days"], ["Curated Range", "$8,000 – $12,000"], ["Regions", "Paro · Thimphu · Punakha · Gangtey"]].map(([k, v]) => (
              <div key={k}>
                <span style={{ display: "block", fontFamily: "Inter", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A843", marginBottom: 4 }}>{k}</span>
                <span style={{ fontFamily: "Inter", fontSize: 14, color: "#F7F5F0" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ITINERARY */}
      <div className="print-section" style={{ background: "#F7F5F0", padding: "56px 56px 48px", color: "#3B3A36" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2D5016" }}>Sample Itinerary — $8,000/person Estimate</p>
            <div className="no-print"><PrintButton /></div>
          </div>

          {days.map((d, i) => (
            <div key={d.day} className="print-day" style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0 32px", marginBottom: i < days.length - 1 ? 24 : 0, paddingBottom: i < days.length - 1 ? 24 : 0, borderBottom: i < days.length - 1 ? "1px solid rgba(59,58,54,0.12)" : "none" }}>
              <div style={{ textAlign: "right", paddingTop: 4 }}>
                <span className="print-day-num" style={{ display: "block", fontFamily: "'Playfair Display', serif", fontSize: 32, lineHeight: 1, color: "#D4A843" }}>{String(d.day).padStart(2, "0")}</span>
                <span style={{ fontFamily: "Inter", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(59,58,54,0.4)" }}>Day</span>
              </div>
              <div>
                <h2 className="print-day-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: "#3B3A36", marginBottom: 6 }}>{d.title}</h2>
                <p className="print-day-body" style={{ fontSize: 14, color: "rgba(59,58,54,0.8)", lineHeight: 1.6 }}>{d.body}</p>
                {d.overnight && (
                  <p className="print-day-overnight" style={{ marginTop: 8, fontFamily: "Inter", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2D5016" }}>
                    Overnight: {d.overnight}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="no-print" style={{ background: "#3B3A36", padding: "80px 56px", textAlign: "center" }}>
        <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A843", marginBottom: 16 }}>Ready to Begin</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 400, color: "#F7F5F0", marginBottom: 24 }}>Inquire About This Journey</h2>
        <p style={{ color: "rgba(247,245,240,0.65)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
          This itinerary is a starting point. Every detail is tailored around your interests, pace, and travel dates.
        </p>
        <Link href="/#tiers" style={{ display: "inline-block", background: "#FF8C00", color: "#000", fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 8 }}>
          Inquire Privately ↗
        </Link>
      </div>

      {/* FOOTER */}
      <div className="no-print" style={{ background: "#2D5016", padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(247,245,240,0.5)", letterSpacing: "0.1em" }}>← Back to Bhutan-Luxe</Link>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(247,245,240,0.35)", letterSpacing: "0.1em" }}>© Bhutan-Luxe Travel · Houston, Texas</span>
      </div>
    </>
  );
}
