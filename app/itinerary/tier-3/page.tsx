import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "The Extraordinary Path — Tier III | Bhutan-Luxe",
  description:
    "Our most exclusive Bhutan journey — 10 days combining the Kingdom's finest lodges, private spiritual encounters, luxury wilderness retreats, and extraordinary experiences.",
};

const days = [
  {
    day: 1,
    title: "Arrival & Renewal",
    body: "Arrive in Paro and begin your journey with a traditional blessing and spiritual cleansing ceremony conducted by a respected Lama. Retreat to Bhutan's premier wellness sanctuary, where restorative treatments and exceptional hospitality provide a tranquil introduction to the Kingdom.",
    overnight: "Bhutan Spirit Sanctuary, Paro",
  },
  {
    day: 2,
    title: "The Hidden World of Haa Valley",
    body: "Cross the dramatic Chelela Pass into the remote Haa Valley, one of Bhutan's least-visited regions. Along the way, encounter local traditions and flavors unique to the valley before arriving at an extraordinary luxury wilderness retreat. The evening unfolds with wellness rituals, astrology readings, cultural performances, forest experiences, and a candlelit dinner beneath Himalayan skies.",
    overnight: "Sangwa Camp, Haa Valley",
  },
  {
    day: 3,
    title: "Wilderness, Wellness & Living Traditions",
    body: "Begin with yoga and forest bathing before discovering the hidden culture of Haa Valley through authentic encounters with local communities. Learn traditional crafts, explore pristine landscapes, and experience a side of Bhutan rarely seen by visitors. Continue to Thimphu and settle into one of Bhutan's most acclaimed luxury lodges.",
    overnight: "Six Senses Thimphu",
  },
  {
    day: 4,
    title: "Spiritual Access & Cultural Heritage",
    body: "Explore Bhutan's living artistic traditions through private cultural experiences, scenic walks, and encounters with master artisans. As evening descends, enjoy an extraordinary private meditation experience within the sacred inner chambers of Buddha Point, accompanied by a revered lama in a setting closed to the public.",
    overnight: "Six Senses Thimphu",
  },
  {
    day: 5,
    title: "Into the Punakha Valley",
    body: "Journey through the high Himalayas and descend into Bhutan's historic heartland. Visit sacred temples, hidden meditation sites, and traditional villages while discovering the profound connection between nature, spirituality, and everyday life.",
    overnight: "andBeyond Punakha River Lodge",
  },
  {
    day: 6,
    title: "A Night Beyond the Ordinary",
    body: "Explore Punakha's remarkable landscapes through scenic hikes, cultural encounters, and traditional culinary experiences. As darkness falls, experience one of the journey's signature moments: a private riverside celebration featuring a candlelit dinner, live traditional music, an exclusive evening river journey, and a bonfire gathering beneath the stars.",
    overnight: "andBeyond Punakha River Lodge",
  },
  {
    day: 7,
    title: "The Serenity of Gangtey",
    body: "Travel to the magnificent Phobjikha Valley, where vast open landscapes and ancient spiritual traditions coexist in remarkable harmony. Receive blessings at Gangtey Monastery and experience one of Bhutan's most beautiful and tranquil regions.",
    overnight: "Gangtey Lodge",
  },
  {
    day: 8,
    title: "The Rhythm of Valley Life",
    body: "Explore the renowned Gangtey Nature Trail through forests, meadows, and traditional settlements. Share a meal with a local family, enjoy breathtaking valley vistas, and embrace the slower pace that defines rural Bhutan. Return to Paro and settle into one of the Kingdom's most celebrated luxury lodges.",
    overnight: "Six Senses Paro",
  },
  {
    day: 9,
    title: "Tiger's Nest & Private Reflection",
    body: "Undertake the iconic pilgrimage to Tiger's Nest Monastery, dramatically perched above the Paro Valley. Explore sacred caves, enjoy a luxury picnic in an extraordinary setting, and conclude your Bhutanese journey with a private meditation experience guided by a respected spiritual master.",
    overnight: "Six Senses Paro",
  },
  {
    day: 10,
    title: "Departure",
    body: "Depart Bhutan with memories of extraordinary landscapes, meaningful connections, and experiences that few travelers have the privilege to encounter.",
    overnight: null,
  },
];

const highlights = [
  "Luxury stays at Bhutan Spirit Sanctuary, Six Senses, Gangtey Lodge & andBeyond Punakha River Lodge",
  "Exclusive Haa Valley wilderness retreat",
  "Private meditation inside Buddha Point's inner sanctuary",
  "Traditional wellness and healing experiences",
  "Encounters with remote Himalayan communities",
  "Private riverside evening experience in Punakha",
  "Luxury wilderness and cultural immersion",
  "Guided spiritual encounters with revered Bhutanese masters",
  "Tiger's Nest pilgrimage and private meditation session",
  "Carefully curated access to Bhutan's most meaningful experiences",
];

export default function TierThreeItinerary() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #3B3A36; color: #F7F5F0; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; color: #000; font-size: 9pt; line-height: 1.4; padding: 0.55in; }
          .print-section { background: #fff !important; color: #000 !important; padding: 0 !important; }
          .print-day { margin-bottom: 10pt !important; padding-bottom: 10pt !important; }
          .print-day-num { font-size: 15pt !important; color: #B8860B !important; }
          .print-day-title { font-size: 10.5pt !important; margin-bottom: 2pt !important; color: #1C5C1C !important; }
          .print-day-body { font-size: 9pt !important; line-height: 1.35 !important; color: #333 !important; }
          .print-day-overnight { font-size: 8pt !important; margin-top: 3pt !important; color: #E85000 !important; font-weight: 600; }
          .print-highlights { margin-top: 20pt !important; padding-top: 16pt !important; }
          .print-highlights p { font-size: 8pt !important; color: #444 !important; }
          @page { margin: 0; size: letter; }
        }
        @media (max-width: 600px) {
          .itin-topbar { padding: 14px 20px !important; }
          .itin-topbar img { height: 36px !important; }
          .itin-topbar a:last-child { font-size: 9px !important; padding: 7px 12px !important; }
          .itin-hero-bg { background-position: 20% center !important; }
          .itin-hero-pad { padding: 56px 20px 32px !important; }
          .itin-hero h1 { font-size: 32px !important; }
          .itin-section { padding: 32px 20px 36px !important; }
          .itin-head-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .itin-day { grid-template-columns: 48px 1fr !important; gap: 0 16px !important; }
          .itin-highlights-grid { grid-template-columns: 1fr !important; }
          .itin-cta { padding: 48px 20px !important; }
          .itin-footer { padding: 20px !important; flex-direction: column !important; gap: 8px !important; text-align: center !important; }
        }
      `}</style>

      {/* PRINT-ONLY HEADER */}
      <div className="no-screen" style={{ display: "none" }}>
        <style>{`
          @media print {
            .no-screen { display: flex !important; align-items: center; justify-content: space-between; background: #fff; border-bottom: 2pt solid #1C5C1C; padding-bottom: 10pt; margin-bottom: 16pt; }
            .no-screen img { height: 52pt; width: auto; }
            .no-screen div { text-align: right; }
            .no-screen h1 { font-size: 16pt; font-family: 'Playfair Display', serif; color: #B8860B; }
            .no-screen p { font-size: 9pt; color: #2D5016; font-weight: 600; margin-top: 3pt; }
          }
        `}</style>
        <img src="/logo.png" alt="Bhutan-Luxe" />
        <div>
          <h1>The Extraordinary Path</h1>
          <p>10 Days · Bhutan-Luxe</p>
        </div>
      </div>

      {/* TOPBAR */}
      <div className="no-print itin-topbar" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "rgba(59,58,54,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="Bhutan-Luxe" style={{ height: 48, width: "auto" }} />
        </Link>
        <Link href="/#tiers" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "#FF8C00", border: "none", cursor: "pointer", padding: "9px 18px", borderRadius: 8 }}>
          Inquire Privately ↗
        </Link>
      </div>

      {/* HERO */}
      <div className="no-print itin-hero-bg" style={{ background: "url('/extraordinary-hero.jpg') center 50%/cover no-repeat", minHeight: 640, display: "flex", alignItems: "flex-start", paddingTop: 80, position: "relative" }}>
        <div className="itin-hero-pad" style={{ width: "100%", background: "linear-gradient(to bottom, transparent 0%, rgba(59,58,54,0.6) 35%, rgba(59,58,54,0.75) 55%, transparent 100%)", padding: "180px 56px 80px" }}>
          <div className="itin-hero" style={{ maxWidth: 560, textAlign: "left", marginLeft: "auto" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 4.4vw, 64px)", lineHeight: 1.04, fontWeight: 400, fontStyle: "italic", color: "#FF8C00", marginBottom: "16px" }}>
              Extraordinary Path
            </h1>
          </div>
        </div>
        <p style={{ position: "absolute", bottom: 14, left: 20, fontFamily: "Inter", fontSize: 13, letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)", margin: 0 }}>Six Senses — Thimphu, Bhutan</p>
      </div>

      {/* ITINERARY */}
      <div className="print-section itin-section" style={{ background: "#F7F5F0", padding: "56px 56px 48px", color: "#3B3A36" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p className="no-print" style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(59,58,54,0.75)", fontStyle: "italic", marginBottom: 16, lineHeight: 1.6 }}>
            The Extraordinary Path follows the same route as the Immersion Path, but offers a deeper level of cultural intimacy, more refined accommodations, and the possibility of experiencing more of Bhutan when helicopter transfers are incorporated between select locations.
          </p>
          <div className="no-print" style={{ marginBottom: 16 }}>
            <img
              src="/immersion-extraordinary-map.jpg"
              alt="Immersion and Extraordinary Path route map — Paro, Haa Valley, Thimphu, Punakha, Gangtey"
              style={{ width: "100%", borderRadius: 4, display: "block" }}
            />
          </div>
          <div className="no-print" style={{ marginBottom: 36, paddingBottom: 32, borderBottom: "1px solid rgba(59,58,54,0.12)" }}>
            <p style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A843", marginBottom: 14 }}>Explore Extraordinary Path Lodging</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: 40 }}>
              {[
                { name: "Six Senses Bhutan", url: "https://www.sixsenses.com/en/hotels-resorts/asia-the-pacific/bhutan/bhutan/" },
                { name: "&Beyond Punakha River Lodge", url: "https://www.andbeyond.com/our-lodges/asia/bhutan/punakha/andbeyond-punakha-river-lodge/" },
                { name: "Gangtey Lodge", url: "https://gangteylodge.com/" },
              ].map(({ name, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#3B3A36", textDecoration: "none", borderBottom: "1px solid rgba(212,168,67,0.4)", padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {name}
                  <span style={{ fontSize: 11, fontFamily: "Inter", letterSpacing: "0.1em", color: "#D4A843" }}>↗</span>
                </a>
              ))}
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A843", marginBottom: 14, marginTop: 28 }}>Lodging also featured in the Immersion Path</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: 40 }}>
              {[
                { name: "Bhutan Spirit Sanctuary", url: "https://bhutanspiritsanctuary.com/" },
                { name: "Sangwa Camp", url: "https://www.sangwacamp.com/" },
              ].map(({ name, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#3B3A36", textDecoration: "none", borderBottom: "1px solid rgba(59,58,54,0.15)", padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {name}
                  <span style={{ fontSize: 11, fontFamily: "Inter", letterSpacing: "0.1em", color: "rgba(59,58,54,0.4)" }}>↗</span>
                </a>
              ))}
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(59,58,54,0.6)", fontStyle: "italic", marginTop: 20, lineHeight: 1.6 }}>
              Bhutan's finest lodges typically fill 6+ months in advance. If your preferred accommodations are unavailable for your travel dates, we will arrange comparable properties or the best available alternatives.
            </p>
          </div>
          <div className="itin-head-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2D5016" }}>Sample Itinerary — $35,000/person</p>
            <div className="no-print"><PrintButton /></div>
          </div>

          {days.map((d, i) => (
            <div key={d.day} className="print-day itin-day" style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0 32px", marginBottom: i < days.length - 1 ? 24 : 0, paddingBottom: i < days.length - 1 ? 24 : 0, borderBottom: i < days.length - 1 ? "1px solid rgba(59,58,54,0.12)" : "none" }}>
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

          {/* HIGHLIGHTS — inside white section, visible on screen and print */}
          <div className="print-highlights" style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid rgba(59,58,54,0.12)" }}>
            <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2D5016", marginBottom: 24 }}>Signature Experiences</p>
            <div className="itin-highlights-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 40px" }}>
              {highlights.map((h, i) => (
                <p key={i} style={{ fontSize: 14, color: "rgba(59,58,54,0.8)", paddingLeft: 16, borderLeft: "2px solid #FF8C00" }}>{h}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="no-print itin-cta" style={{ background: "#2D5016", padding: "80px 56px", textAlign: "center" }}>
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
      <div className="no-print itin-footer" style={{ background: "#3B3A36", padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(247,245,240,0.5)", letterSpacing: "0.1em" }}>← Back to Bhutan-Luxe</Link>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(247,245,240,0.35)", letterSpacing: "0.1em" }}>© Bhutan-Luxe Travel · Houston, Texas</span>
      </div>
    </>
  );
}
