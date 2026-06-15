import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Bhutan-Luxe",
  description: "Answers to common questions about planning a luxury journey to Bhutan with Bhutan-Luxe.",
};

const faqs = [
  {
    question: "How do I start designing my trip?",
    answer:
      "Every Bhutan-Luxe journey begins with a private consultation to understand your interests, travel style, desired pace, and preferred level of comfort. Whether your interests lie in culture, spirituality, photography, wellness, or remote exploration, we curate an itinerary tailored specifically to you. Most journeys are ideally 10 days in length, though every itinerary can be extended or shortened to suit your preferences.",
  },
  {
    question: "Will I have on-the-ground support during my trip?",
    answer:
      "Yes. From arrival to departure, guests are accompanied by an experienced Bhutanese guide who provides seamless support throughout the journey. Our affiliate partner oversees all logistics, allowing you to travel with complete peace of mind while enjoying an authentic and personalized experience.",
  },
  {
    question: "Are flights included in the booking?",
    answer:
      "International flights to and from Bhutan are typically not included. Domestic arrangements within Bhutan, including ground transportation and any internal flights where applicable, are included as part of your journey. We are happy to provide guidance on the most suitable international flight options from your departure city.",
  },
  {
    question: "Do you offer travel insurance and medical support?",
    answer:
      "We strongly recommend your own comprehensive travel insurance that includes trip cancellation, medical coverage, and emergency evacuation benefits. While Bhutan has modern healthcare facilities in major towns, medical services in remote areas may be limited. Should assistance be required during your journey, our local team can coordinate medical support and emergency arrangements.",
  },
  {
    question: "Is Bhutan suitable for first-time visitors to Asia?",
    answer:
      "Absolutely. Bhutan is one of Asia's safest and most welcoming destinations. The country's measured pace, strong cultural traditions, and low visitor numbers make it particularly appealing for travelers seeking a comfortable and enriching introduction to the region.",
  },
  {
    question: "How physically demanding are Bhutan journeys?",
    answer:
      "Journeys can be tailored to a wide range of fitness levels. While some experiences involve moderate hikes and monastery visits, many itineraries can be designed with minimal physical exertion. We work closely with guests to ensure each journey matches their comfort and mobility preferences.",
  },
  {
    question: "Will I have internet and mobile connectivity?",
    answer:
      "Most luxury lodges and hotels offer Wi-Fi, and mobile connectivity is available in many areas of the country. However, some remote valleys and mountain regions may have limited or intermittent service—an opportunity for many guests to disconnect and fully immerse themselves in Bhutan's unique sense of serenity.",
  },
  {
    question: "What makes Bhutan different from other luxury destinations?",
    answer:
      "Bhutan offers a rare combination of authenticity, natural beauty, spiritual heritage, and intentional preservation. Rather than mass tourism, the Kingdom prioritizes cultural integrity and sustainability, creating experiences that feel deeply personal, meaningful, and unlike anywhere else in the world.",
  },
  {
    question: "Is Bhutan safe for travelers?",
    answer:
      "Bhutan is widely regarded as one of the safest destinations in the world, with low crime rates and a strong sense of community. Guests consistently remark on the warmth and hospitality of the Bhutanese people.",
  },
];

export default function FAQ() {
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
              Frequently Asked <em style={{ fontStyle: "italic", color: "#FF8C00" }}>Questions</em>
            </h1>
          </div>
        </div>
      </div>

      {/* FAQ LIST */}
      <div style={{ background: "#2D5016", padding: "48px 56px 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, lineHeight: 1.7, color: "rgba(247,245,240,0.85)", fontStyle: "italic", paddingBottom: 36, borderBottom: "1px solid rgba(212,168,67,0.3)", marginBottom: 48 }}>
            Everything you need to know before embarking on a journey with Bhutan-Luxe. If your question isn't answered here, we welcome a private conversation.
          </p>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderLeft: "4px solid #D4A843", paddingLeft: 36, marginBottom: i < faqs.length - 1 ? 48 : 0, paddingBottom: i < faqs.length - 1 ? 48 : 0, borderBottom: i < faqs.length - 1 ? "1px solid rgba(212,168,67,0.15)" : "none" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: "#D4A843", fontStyle: "italic", marginBottom: 12 }}>{faq.question}</h2>
              <p style={{ fontSize: 16, color: "rgba(247,245,240,0.85)", lineHeight: 1.7, maxWidth: 680 }}>{faq.answer}</p>
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
