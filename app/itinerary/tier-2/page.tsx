import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Deeper Discovery Itinerary — Tier II | Bhutan-Luxe",
  description:
    "10-day deeper exploration of Bhutan through sacred traditions, luxury wilderness retreats, private spiritual encounters, and meaningful cultural immersion.",
};

const days = [
  {
    day: 1,
    title: "Arrival & Blessings",
    body: "Arrive in Paro and begin your Bhutanese journey with a traditional blessing and spiritual cleansing ceremony conducted by a revered lama. Settle into one of Bhutan's premier wellness sanctuaries and enjoy restorative treatments inspired by centuries of Bhutanese healing traditions.",
    overnight: "Bhutan Spirit Sanctuary, Paro",
  },
  {
    day: 2,
    title: "Into the Hidden Haa Valley",
    body: "Travel over the dramatic Chelela Pass into the remote Haa Valley, one of Bhutan's least-visited regions. Meet local families, experience traditions unique to the valley, and settle into an exclusive luxury wilderness camp surrounded by pristine Himalayan forests. Enjoy wellness rituals, traditional performances, astrology readings, forest experiences, and a candlelit evening beneath the stars.",
    overnight: "Sangwa Camp, Haa Valley",
  },
  {
    day: 3,
    title: "Wilderness, Culture & Connection",
    body: "Begin the day with yoga and forest bathing before exploring hidden corners of the valley. Meet members of Bhutan's indigenous communities, learn traditional crafts, and experience the rhythms of life far beyond the tourist trail. Continue onward to Thimphu, Bhutan's capital city.",
    overnight: "Zhiwaling Ascent, Thimphu",
  },
  {
    day: 4,
    title: "Spiritual Bhutan",
    body: "Explore Bhutan's artistic and spiritual heritage through scenic monastery walks, encounters with master artisans, and visits to cultural landmarks. As evening falls, enjoy a rare private meditation experience inside the main altar room at Buddha Point, normally inaccessible to visitors.",
    overnight: "Zhiwaling Ascent, Thimphu",
  },
  {
    day: 5,
    title: "The Punakha Valley",
    body: "Cross the spectacular Dochula Pass before descending into the fertile Punakha Valley. Visit sacred temples, walk through traditional villages, and gain deeper insight into Bhutan's enduring connection between nature, spirituality, and daily life.",
    overnight: "Dhumra Farm Resort, Punakha",
  },
  {
    day: 6,
    title: "Heritage & Hospitality",
    body: "Experience the beauty of Punakha through scenic hikes, a gentle river journey, traditional Bhutanese cooking experiences, and visits to some of the Kingdom's most important cultural landmarks. Enjoy the relaxed pace and hospitality of Bhutan's former royal capital.",
    overnight: "Dhumra Farm Resort, Punakha",
  },
  {
    day: 7,
    title: "The Valleys of Gangtey",
    body: "Journey into the breathtaking Phobjikha Valley, home to sweeping landscapes, ancient monasteries, and a slower pace of life. Receive blessings from resident monks and explore one of Bhutan's most beautiful glacial valleys.",
    overnight: "Pinewood Resort, Gangtey",
  },
  {
    day: 8,
    title: "Life in the Valley",
    body: "Walk the renowned Gangtey Nature Trail through forests, meadows, and traditional villages. Share a home-hosted meal with a local family, enjoy panoramic valley views, and experience the peaceful rhythm of life in rural Bhutan.",
    overnight: "Naksel Boutique Hotel, Paro",
  },
  {
    day: 9,
    title: "Tiger's Nest & Reflection",
    body: "Embark on Bhutan's most iconic pilgrimage to the legendary Tiger's Nest Monastery. Explore sacred caves, enjoy a luxury picnic overlooking the valley, and conclude the journey with a private meditation session led by a respected spiritual teacher.",
    overnight: "Naksel Boutique Hotel, Paro",
  },
  {
    day: 10,
    title: "Departure",
    body: "Depart Bhutan with lasting memories of a Kingdom where ancient traditions, breathtaking landscapes, and genuine human connections remain deeply woven into everyday life.",
    overnight: null,
  },
];

const highlights = [
  "Remote Haa Valley wilderness experience",
  "Luxury tented camp stay",
  "Private meditation at Buddha Point",
  "Traditional wellness and healing rituals",
  "Encounters with local families and artisans",
  "Scenic hikes and sacred monasteries",
  "Gangtey & Phobjikha Valley exploration",
  "Tiger's Nest Monastery pilgrimage",
  "Guided meditation with a Bhutanese spiritual master",
  "Carefully curated cultural and spiritual experiences",
];

export default function TierTwoItinerary() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #3B3A36; color: #F7F5F0; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; color: #000; font-size: 10pt; line-height: 1.5; padding: 0.65in; }
          .print-section { background: #fff !important; color: #000 !important; padding: 0 !important; }
          .print-day { margin-bottom: 13pt !important; padding-bottom: 13pt !important; }
          .print-day-num { font-size: 18pt !important; color: #B8860B !important; }
          .print-day-title { font-size: 12pt !important; margin-bottom: 3pt !important; color: #1C5C1C !important; }
          .print-day-body { font-size: 10pt !important; line-height: 1.45 !important; color: #333 !important; }
          .print-day-overnight { font-size: 9pt !important; margin-top: 4pt !important; color: #E85000 !important; font-weight: 600; }
          .print-highlights { display: none !important; }
          @page { margin: 0; size: letter; }
        }
      `}</style>

      {/* PRINT-ONLY HEADER */}
      <div className="no-screen" style={{ display: "none" }}>
        <style>{`
          @media print {
            .no-screen { display: flex !important; align-items: center; justify-content: space-between; background: #fff; border-bottom: 2pt solid #1C5C1C; padding-bottom: 10pt; margin-bottom: 16pt; }
            .no-screen img { height: 52pt; width: auto; }
            .no-screen div { text-align: right; }
            .no-screen h1 { font-size: 16pt; font-family: 'DM Sans', sans-serif; color: #B8860B; }
            .no-screen p { font-size: 9pt; color: #2D5016; font-weight: 600; margin-top: 3pt; }
          }
        `}</style>
        <img src="/logo.png" alt="Bhutan-Luxe" />
        <div>
          <h1>The Immersion Path</h1>
          <p>10 Days · Bhutan-Luxe</p>
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
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3vw, 40px)", lineHeight: 1, fontWeight: 400, color: "#F7F5F0", marginBottom: "12px" }}>
              <em style={{ fontStyle: "italic", color: "#FF8C00" }}>The Immersion Path</em>
            </h1>
          </div>
        </div>
      </div>

      {/* INTRO */}
      <div className="no-print" style={{ background: "#2D5016", padding: "56px 56px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, lineHeight: 1.6, color: "#F7F5F0", fontStyle: "italic" }}>
            A deeper exploration of Bhutan through sacred traditions, luxury wilderness retreats, private spiritual encounters, and meaningful cultural immersion. Designed for travelers seeking a richer connection to the Kingdom, this journey reveals hidden valleys, living traditions, and experiences rarely found on conventional itineraries.
          </p>
          <div style={{ display: "flex", gap: 40, marginTop: 36, borderTop: "1px solid rgba(212,168,67,0.3)", paddingTop: 28 }}>
            {[["Recommended Stay", "10 Days"], ["Experience Investment Range", "$13,000+"]].map(([k, v]) => (
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
            <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2D5016" }}>Sample Itinerary — $13,000/person Estimate</p>
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

      {/* HIGHLIGHTS */}
      <div className="print-highlights no-print" style={{ background: "#3B3A36", padding: "64px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A843", marginBottom: 28 }}>Journey Highlights</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 40px" }}>
            {highlights.map((h, i) => (
              <p key={i} style={{ fontSize: 14, color: "rgba(247,245,240,0.8)", paddingLeft: 16, borderLeft: "2px solid #FF8C00" }}>{h}</p>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="no-print" style={{ background: "#2D5016", padding: "80px 56px", textAlign: "center" }}>
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
      <div className="no-print" style={{ background: "#3B3A36", padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(247,245,240,0.5)", letterSpacing: "0.1em" }}>← Back to Bhutan-Luxe</Link>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(247,245,240,0.35)", letterSpacing: "0.1em" }}>© Bhutan-Luxe Travel · Houston, Texas</span>
      </div>
    </>
  );
}
