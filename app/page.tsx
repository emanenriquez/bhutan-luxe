"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { submitInquiry } from "./actions/inquiry";

type Tier = "luxe" | "boutique-luxe" | "ultra-luxe" | "bespoke" | "";

const TOTAL_STEPS = 1;

export default function Home() {
  const [open, setOpen] = useState(false);
  const [mapLightbox, setMapLightbox] = useState(false);
  const [step, setStep] = useState(1);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refNumber, setRefNumber] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  function openModal(preselectTier?: Tier) {
    setStep(1);
    setDone(false);
    setError(null);
    setOpen(true);
    if (preselectTier && formRef.current) {
      requestAnimationFrame(() => {
        const radio = formRef.current?.querySelector<HTMLInputElement>(
          `input[name="tier"][value="${preselectTier}"]`,
        );
        if (radio) radio.checked = true;
      });
    }
  }

  function closeModal() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function nextOrSubmit() {
    setError(null);
    if (step === 1) {
      const form = formRef.current;
      if (!form) return;
      const name = (form.elements.namedItem("name") as HTMLInputElement)?.value.trim();
      const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim();
      if (!name || !email) {
        setError("Name and email are required.");
        (form.elements.namedItem(name ? "email" : "name") as HTMLInputElement)?.focus();
        return;
      }
    }
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    startTransition(async () => {
      const result = await submitInquiry(fd);
      if (result.ok) {
        setRefNumber(result.refCode ?? "");
        setDone(true);
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <a href="#" className="mark">
          <img src="/logo.png" alt="Bhutan-Luxe" style={{ height: '80px', width: 'auto' }} />
        </a>
        <div className="meta">
          <span style={{ color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', fontWeight: 700 }}>Bespoke Journeys | Authentic Bhutan | Privately Guided</span>
        </div>
        <button className="open-form" onClick={() => openModal()}>
          Inquire Privately ↗
        </button>
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="frame">
          <div className="center">
            <h1>
              The Bhutan Few Will Ever See
            </h1>
            <span className="label eyebrow">A JOURNEY IMMERSED IN AUTHENTIC CULTURE</span>
            <p className="lede">
              Bhutan-Luxe is dedicated to crafting refined journeys<br className="lede-break" />
              rooted in peace, tranquility, and immersive exploration<br className="lede-break" />
              of the Kingdom's timeless spirit.
            </p>
            <div className="actions" style={{ marginTop: '28px' }}>
              <a href="#tiers" className="btn-ghost">
                Explore Experiences
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DESIRE */}
      <section id="desire">
        <div className="img" />
        <div className="text">
          <span className="label">Why Bhutan. Why Now.</span>
          <h2>
            You have been
            <br />
            everywhere &nbsp;·&nbsp; Bhutan
            <br />
            is the <em>exception</em>
          </h2>
          <p>
            Most destinations have been discovered, packaged, and sold. Bhutan
            has not. Strict visitor limits and a culture that has never chased
            tourism mean the country remains, in most places, exactly as it was
            a century ago.
          </p>
          <p>
            "Gross National Happiness is more important than Gross Domestic Product." Former King Jigme Singye Wangchuck (1972–2006). That philosophy remains a major part of Bhutan's identity and is one reason culturally curious travelers are drawn to the kingdom.
          </p>
          <div className="stats">
            <div className="stat">
              <span className="num">72%</span>
              <span className="desc">Forest Coverage</span>
            </div>
            <div className="stat">
              <span className="num">0</span>
              <span className="desc">Number of Bhutan Stoplights</span>
            </div>
            <div className="stat">
              <span className="num">(-)</span>
              <span className="desc">Carbon Negative<br />- Bhutan Absorbs More Carbon Than It Produces</span>
            </div>
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section id="tiers">
        <div className="header">
          <div>
            <span className="label">Curated Bhutan Experiences</span>
            <h2>
              Three Paths to Discover
              <br />
              <em>Authentic Bhutan</em>
            </h2>
          </div>
          <div className="intro">
            <p>Choose from three carefully curated Bhutan-Luxe experiences, each designed around your interests, pace, and preferred level of exploration. Accompanied by a private Bhutanese guide throughout, every journey is tailored to your schedule, with 10 days offering the ideal balance of discovery and relaxation.</p>
            <a href="/weather-guide" style={{ display: 'inline-block', marginTop: '20px', fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cloud)', background: 'transparent', border: '1px solid var(--gold)', padding: '10px 22px', borderRadius: 8, textDecoration: 'none' }}>Preferred Journey Dates →</a>
          </div>
        </div>

        <article className="tier-row">
          <div
            className="img-col"
            style={{
              backgroundImage:
                "url('/photo-1.jpg')",
            }}
          />
          <div className="body">
            <h3 style={{ fontSize: '28px', marginBottom: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 400, display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <em style={{ color: 'var(--saffron)' }}>Discovery Path</em>
              <span style={{ fontStyle: 'normal', display: 'inline-flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9.5px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.5)' }}>Plans Start At</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 400, color: 'var(--cloud)' }}>$11,500</span>
              </span>
            </h3>
            <p style={{ marginBottom: 0, maxWidth: 'none' }}>Discover Bhutan through its sacred monasteries, mountain valleys, and enduring traditions that continue to shape life across the kingdom.</p>
            <ul style={{ marginTop: '4px', marginBottom: '20px', paddingLeft: '28px', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '3px', color: 'rgba(247,245,240,0.78)', fontSize: '15.5px' }}>
              <li>Visit sacred monasteries and receive blessings from revered spiritual leaders.</li>
              <li>Discover breathtaking mountain landscapes, tranquil valleys, and ancient pilgrimage sites.</li>
              <li>Participate in cultural experiences that reveal Bhutan&apos;s unique way of life and enduring values.</li>
              <li>Experience a side of Bhutan rarely encountered by most visitors, thoughtfully curated for deeper connection and understanding.</li>
              <li>Return home with a deeper understanding of a kingdom where tradition remains a guiding force in modern life.</li>
            </ul>
            <div className="actions">
              <a href="/itinerary/tier-1" className="btn-line">
                Sample Itinerary →
              </a>
            </div>
          </div>
        </article>

        <article className="tier-row">
          <div
            className="img-col"
            style={{
              backgroundImage:
                "url('/photo-2.jpg')",
            }}
          />
          <div className="body">
            <h3 style={{ fontSize: '28px', marginBottom: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 400, display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <em style={{ color: 'var(--saffron)' }}>Immersion Path</em>
              <span style={{ fontStyle: 'normal', display: 'inline-flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9.5px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.5)' }}>Plans Start At</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 400, color: 'var(--cloud)' }}>$18,000</span>
              </span>
            </h3>
            <p style={{ marginBottom: 0, maxWidth: 'none' }}>An immersive journey combining Bhutan's spiritual heritage, stunning landscapes, and rare cultural experiences.</p>
            <ul style={{ marginTop: '4px', marginBottom: '20px', paddingLeft: '28px', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '3px', color: 'rgba(247,245,240,0.78)', fontSize: '15.5px' }}>
              <li>Stay in a luxury tented camp and experience the traditions of Bhutan&apos;s remote Haa Valley.</li>
              <li>Connect with local communities through cultural exchanges, family visits, and artisan traditions.</li>
              <li>Explore monasteries, river valleys, mountain passes, and Bhutan&apos;s most iconic sacred sites.</li>
              <li>Enjoy wellness experiences including yoga, meditation, herbal therapies, and forest immersion.</li>
              <li>Travel through Bhutan at a thoughtful pace designed to inspire discovery, reflection, and authentic connection.</li>
            </ul>
            <div className="actions">
              <a href="/itinerary/tier-2" className="btn-line">
                Sample Itinerary →
              </a>
            </div>
          </div>
        </article>

        <article className="tier-row">
          <div
            className="img-col"
            style={{
              backgroundImage:
                "url('/photo-3.jpg')",
            }}
          />
          <div className="body">
            <h3 style={{ fontSize: '28px', marginBottom: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 400, display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <em style={{ color: 'var(--saffron)' }}>Extraordinary Path</em>
              <span style={{ fontStyle: 'normal', display: 'inline-flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9.5px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.5)' }}>Plans Start At</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 400, color: 'var(--cloud)' }}>$35,000</span>
              </span>
            </h3>
            <p style={{ marginBottom: 0, maxWidth: 'none' }}>Extraordinary experiences reveal Bhutan at its most inspiring, combining rare spiritual access, remarkable settings, exceptional hospitality, and moments that few travelers will ever encounter.</p>
            <ul style={{ marginTop: '4px', marginBottom: '20px', paddingLeft: '28px', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '3px', color: 'rgba(247,245,240,0.78)', fontSize: '15.5px' }}>
              <li>Stay at Bhutan&apos;s most celebrated lodges and luxury camps, including Six Senses, &ldquo;andBeyond&rdquo;, and Haa Sangwa Camp.</li>
              <li>Experience signature events created in extraordinary settings, from candlelit riverside evenings to private ceremonies and cultural performances.</li>
              <li>Explore the kingdom&apos;s most spectacular valleys, monasteries, and landscapes with time to appreciate them fully.</li>
              <li>Rejuvenate through wellness experiences inspired by Bhutanese traditions, including yoga, herbal therapies, forest immersion, and meditation.</li>
              <li>Travel through Bhutan with exceptional comfort, personal attention, and a pace that encourages both discovery and reflection.</li>
            </ul>
            <div className="actions">
              <a href="/itinerary/tier-3" className="btn-line">
                Sample Itinerary →
              </a>
            </div>
          </div>
        </article>
      </section>

      {/* REGIONS */}
      <section id="regions">
        <div className="wrap">
          <div className="regions-top">
            <div style={{ maxWidth: '520px' }}>
              <h2 style={{ marginBottom: '16px' }}>
                Areas of <em>Discovery</em>
              </h2>
              <p className="intro">
                At Bhutan-Luxe, we believe authenticity is the ultimate luxury. Our journeys are thoughtfully designed to connect travelers with Bhutan's living traditions, remarkable landscapes, and enduring culture through experiences that feel genuine, personal, and deeply meaningful.
              </p>
            </div>
            <img
              src="/global-map.jpg"
              alt="Bhutan Asia Location"
              onClick={() => setMapLightbox(true)}
              className="regions-top-map"
              style={{ width: '280px', display: 'block', borderRadius: '0', flexShrink: 0, cursor: 'zoom-in' }}
            />
          </div>

          <img src="/regional-map.jpg" alt="Regional and Cultural Map of Bhutan" style={{ width: '100%', display: 'block', borderRadius: '0' }} />
        </div>
      </section>

      {/* TRUST */}
      <section id="trust">
        <div className="wrap">
          <div className="header">
            <div>
              <span className="label">Why Our Guests See More of the Real Bhutan</span>
              <h2>
                Authentic Cultural <em>Immersion</em>
              </h2>
              <img src="/monks-watching-dance.jpg" alt="Monks watching Bhutanese cultural dance" style={{ width: '100%', marginTop: '28px', borderRadius: '0', display: 'block' }} />
            </div>
            <div style={{ paddingTop: '180px' }}>
              <p className="intro" style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", color: 'var(--saffron)', lineHeight: 1.4 }}>Bhutan-Luxe designs the journey; Our on-the-ground partner ensures:</p>
              <ul className="intro-list">
                <li>Authentic cultural immersion beyond the tourist trails</li>
                <li>Meaningful connections with local communities</li>
                <li>Seamless support throughout your journey</li>
                <li>Optimizes a decade-plus network of trusted local relationships</li>
                <li>Access to regions few visitors ever reach</li>
                <li>You have Bhutan&apos;s most respected and experienced guides</li>
              </ul>
              <a href="/faq" style={{ display: 'inline-block', marginTop: '24px', fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cloud)', background: 'transparent', border: '1px solid var(--gold)', padding: '10px 22px', borderRadius: 8, textDecoration: 'none' }}>Discovery Path Questions →</a>
            </div>
          </div>


        </div>
      </section>

      {/* MAP LIGHTBOX */}
      {mapLightbox && (
        <div
          onClick={() => setMapLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img
            src="/global-map.jpg"
            alt="Bhutan Asia Location"
            style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'block', borderRadius: '0' }}
          />
        </div>
      )}

      {/* INQUIRY MODAL */}
      <div
        className={`modal-backdrop${open ? " on" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal">
          <aside className="side">
            <div>
              <h3>Let&apos;s have a short, private conversation!</h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  "We will revert in 24-28 hours",
                  "Initially we respond by email or WhatsApp",
                  "All information and travel plans remain confidential",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 13,
                      color: "rgba(247,245,240,0.7)",
                      lineHeight: 1.4,
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="form-pane">
            <div className="head">
              <span className="label">
                {done ? "Confirmation" : "Concierge Inquiry"}
              </span>
              <button
                className="close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
              {!done && (
                <>
                  <div
                    className={`modal-step${step === 1 ? " on" : ""}`}
                    data-step={1}
                  >
                    <div className="form-group">
                      <label htmlFor="m_name">Full Name</label>
                      <input
                        type="text"
                        id="m_name"
                        name="name"
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="m_email">Email Address</label>
                      <input
                        type="email"
                        id="m_email"
                        name="email"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="m_phone">Phone Number</label>
                      <input
                        type="tel"
                        id="m_phone"
                        name="phone"
                        autoComplete="tel"
                        placeholder="Optional, for a personal reply"
                      />
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(59,58,54,0.5)",
                        lineHeight: 1.4,
                      }}
                    >
                      Your information is held in strict confidence and is
                      never shared. We do not send marketing communications
                      without your consent.
                    </p>
                    {error ? (
                      <p
                        style={{
                          color: "var(--crimson)",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {error}
                      </p>
                    ) : null}
                  </div>

                  <div className="controls">
                    <button
                      type="button"
                      className="next"
                      onClick={nextOrSubmit}
                      disabled={pending}
                    >
                      {pending ? "Submitting…" : "SEND INQUIRY"}
                    </button>
                  </div>
                </>
              )}

              {done && (
                <div className="modal-success on">
                  <span className="label">Inquiry Received</span>
                  <h2>
                    Thank you &nbsp;·&nbsp; We&apos;ll be in touch within 48
                    hours
                  </h2>
                  <p>
                    A confirmation has been sent to your email. The founder
                    will respond personally — by phone, if you&apos;ve shared a
                    number, otherwise by email.
                  </p>
                  <div className="ref">Reference · {refNumber}</div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="row">
            <div className="brand">
              <span className="word">Bhutan-Luxe.com</span>
              <span className="tag">The Bhutan Few Will Ever See</span>
            </div>
            <div className="col">
              <h5>Contact</h5>
              <a href="mailto:concierge@bhutan-luxe.com">
                concierge@bhutan-luxe.com
              </a>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href="https://wa.me/84937302252"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
                <a href="tel:+12812504682">+1 (281) 250-4682</a>
              </span>
            </div>
            <div className="col">
              <h5>Discovery Paths</h5>
              <a href="#tiers">Discovery</a>
              <a href="#tiers">Immersion</a>
              <a href="#tiers">Extraordinary</a>
            </div>
            <div className="col">
              <h5>Discretion</h5>
              <p>
                All inquiries are handled with complete discretion. No data is
                shared with third parties. We do not maintain a mailing list.
              </p>
            </div>
          </div>
          <div className="footnote">
            <span style={{ fontSize: '13px' }}>© Bhutan-Luxe.com · Houston, Texas</span>
          </div>
        </div>
      </footer>
    </>
  );
}
