"use client";

import Link from "next/link";
import { useState } from "react";

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
      "Most luxury lodges and hotels offer Wi-Fi, and mobile connectivity is available in many areas of the country. However, some remote valleys and mountain regions may have limited or intermittent service. Many guests are pleasantly surprised detaching and fully immerse themselves in Bhutan's unique sense of serenity.",
  },
  {
    question: "Is Bhutan safe for travelers?",
    answer:
      "Bhutan is widely regarded as one of the safest destinations in the world, with low crime rates and a strong sense of community. Guests consistently remark on the warmth and hospitality of the Bhutanese people.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #3B3A36; color: #F7F5F0; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }
        .faq-item { border-left: 4px solid #D4A843; padding-left: 36px; border-bottom: 1px solid rgba(212,168,67,0.15); }
        .faq-item:last-child { border-bottom: none; }
        .faq-trigger { width: 100%; background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 28px 0; text-align: left; }
        .faq-trigger:hover .faq-q { color: #F7F5F0; }
        .faq-chevron { flex-shrink: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: #D4A843; transition: transform 0.3s ease; }
        .faq-chevron.open { transform: rotate(180deg); }
        .faq-answer { overflow: hidden; transition: max-height 0.35s ease, opacity 0.3s ease; }
        .faq-answer.closed { max-height: 0; opacity: 0; }
        .faq-answer.open { max-height: 600px; opacity: 1; }
        .faq-answer-inner { padding-bottom: 28px; }
        @media (max-width: 600px) {
          .faq-topbar { padding: 14px 20px !important; }
          .faq-topbar img { height: 36px !important; }
          .faq-topbar a:last-child { font-size: 9px !important; padding: 7px 12px !important; }
          .faq-hero-bg { background-position: 20% center !important; }
          .faq-hero-pad { padding: 48px 20px 28px !important; }
          .faq-hero h1 { font-size: 30px !important; }
          .faq-list { padding: 32px 20px 56px !important; }
          .faq-item { padding-left: 20px !important; }
          .faq-q { font-size: 19px !important; }
          .faq-cta { padding: 48px 20px !important; }
          .faq-footer { padding: 20px !important; flex-direction: column !important; gap: 8px !important; text-align: center !important; }
        }
      `}</style>

      {/* TOPBAR */}
      <div className="faq-topbar" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "rgba(59,58,54,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="Bhutan-Luxe" style={{ height: 48, width: "auto" }} />
        </Link>
        <Link href="/#tiers" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "#FF8C00", border: "none", cursor: "pointer", padding: "9px 18px", borderRadius: 8 }}>
          Inquire Privately ↗
        </Link>
      </div>

      {/* HERO */}
      <div className="faq-hero-bg" style={{ background: "url('/hero-cover.jpg') center/cover no-repeat", minHeight: 340, display: "flex", alignItems: "flex-end", paddingTop: 80 }}>
        <div className="faq-hero-pad" style={{ width: "100%", background: "linear-gradient(to top, rgba(59,58,54,0.95) 0%, rgba(59,58,54,0.4) 60%, transparent 100%)", padding: "60px 56px 40px" }}>
          <div className="faq-hero" style={{ marginLeft: "auto", maxWidth: 560, textAlign: "left" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1, fontWeight: 400, color: "#F7F5F0" }}>
              Frequent <em style={{ fontStyle: "italic", color: "#FF8C00" }}>Questions</em>
            </h1>
          </div>
        </div>
      </div>

      {/* FAQ LIST */}
      <div className="faq-list" style={{ background: "#2D5016", padding: "48px 56px 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, lineHeight: 1.7, color: "rgba(247,245,240,0.85)", fontStyle: "italic", paddingBottom: 36, borderBottom: "1px solid rgba(212,168,67,0.3)", marginBottom: 48 }}>
            Every Bhutan-Luxe journey is individually crafted, yet many guests share similar questions before they travel. Here you will find practical guidance and insights to help you prepare for an experience defined by authenticity,
          </p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-trigger" onClick={() => toggle(i)} aria-expanded={openIndex === i}>
                  <h2 className="faq-q" style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: openIndex === i ? "#F7F5F0" : "#D4A843", fontStyle: "italic", transition: "color 0.2s ease" }}>
                    <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, fontStyle: "normal", color: "#D4A843", opacity: 0.6, marginRight: 14 }}>{String(i + 1).padStart(2, "0")}</span>{faq.question}
                  </h2>
                  <span className={`faq-chevron${openIndex === i ? " open" : ""}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                <div className={`faq-answer${openIndex === i ? " open" : " closed"}`}>
                  <div className="faq-answer-inner">
                    <p style={{ fontSize: 16, color: "rgba(247,245,240,0.85)", lineHeight: 1.7 }}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="faq-cta" style={{ background: "#3B3A36", padding: "72px 56px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, color: "#F7F5F0", marginBottom: 20 }}>Ready to plan your journey?</h2>
        <Link href="/#tiers" style={{ display: "inline-block", background: "#FF8C00", color: "#000", fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 8 }}>
          Inquire Privately ↗
        </Link>
      </div>

      {/* FOOTER */}
      <div className="faq-footer" style={{ background: "#2D5016", padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(247,245,240,0.5)", letterSpacing: "0.1em" }}>← Back to Bhutan-Luxe</Link>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(247,245,240,0.35)", letterSpacing: "0.1em" }}>© Bhutan-Luxe Travel · Houston, Texas</span>
      </div>
    </>
  );
}
