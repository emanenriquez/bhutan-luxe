"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { submitInquiry } from "./actions/inquiry";

type Tier = "luxe" | "boutique-luxe" | "ultra-luxe" | "bespoke" | "";

const TOTAL_STEPS = 3;

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

  function back() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <a href="#" className="mark">
          <img src="/logo.png" alt="Bhutan-Luxe" style={{ height: '80px', width: 'auto' }} />
        </a>
        <div className="meta">
          <span style={{ color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', fontWeight: 700 }}>Private Bhutan Journeys | Authentic Bhutan | Bespoke &amp; Privately Guided</span>
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
              Bhutan-Luxe is dedicated to crafting refined journeys<br />
              rooted in peace, tranquility, and immersive exploration<br />
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
          <div className="num">03</div>
          <div>
            <span className="label">Curated Bhutan Experiences</span>
            <h2>
              Journeys of Discovery
              <br />
              and <em>Serenity</em>
            </h2>
          </div>
          <p className="intro">
            Choose from three carefully curated journey experiences, each tailored and refined around your personal interests, pace, more or less days and desired level of discovery. Every journey is accompanied by your own private Bhutanese guide from arrival to departure.
          </p>
        </div>

        <article className="tier-row">
          <div className="idx">I.</div>
          <div
            className="img-col"
            style={{
              backgroundImage:
                "url('/photo-1.jpg')",
            }}
          />
          <div className="body">
            <h3 style={{ fontSize: '28px', marginBottom: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              <span style={{ color: 'var(--cloud)' }}>Tier I  |  Luxe  :  </span><em style={{ color: 'var(--saffron)' }}>Essential Bhutan</em>
            </h3>
            <div className="meta">
              <div>
                <span className="k">Curated Journey Range</span>
                <span className="v">$8,000 – $12,000</span>
              </div>
              <div>
                <span className="k">Duration</span>
                <span className="v">10 days</span>
              </div>
              <div>
                <span className="k">Region</span>
                <span className="v">Paro · Thimphu · Punakha · Gangtey</span>
              </div>
            </div>
            <p>
              A curated introduction to Bhutan's spiritual heritage, dramatic landscapes, and living traditions, thoughtfully designed for meaningful discovery and authentic connection.
            </p>
            <div className="actions">
              <a href="/itinerary/tier-1" className="btn-line">
                Sample Itinerary →
              </a>
            </div>
          </div>
        </article>

        <article className="tier-row">
          <div className="idx">II.</div>
          <div
            className="img-col"
            style={{
              backgroundImage:
                "url('/photo-2.jpg')",
            }}
          />
          <div className="body">
            <h3 style={{ fontSize: '28px', marginBottom: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              <span style={{ color: 'var(--cloud)' }}>Tier II  |  Boutique-Luxe  :  </span><em style={{ color: 'var(--saffron)' }}>Immersive Bhutan</em>
            </h3>
            <div className="meta">
              <div>
                <span className="k">Curated Journey Range</span>
                <span className="v">$12,000 – $25,000</span>
              </div>
              <div>
                <span className="k">Duration</span>
                <span className="v">10 days</span>
              </div>
              <div>
                <span className="k">Region</span>
                <span className="v">Paro · Haa · Thimphu · Punakha · Gangtey</span>
              </div>
            </div>
            <p>
              Journey beyond the familiar through sacred traditions, remote valleys, luxury tented camps, and immersive experiences woven into Bhutanese life.
            </p>
            <div className="actions">
              <a href="/itinerary/tier-2" className="btn-line">
                Sample Itinerary →
              </a>
            </div>
          </div>
        </article>

        <article className="tier-row">
          <div className="idx">III.</div>
          <div
            className="img-col"
            style={{
              backgroundImage:
                "url('/photo-3.jpg')",
            }}
          />
          <div className="body">
            <h3 style={{ fontSize: '28px', marginBottom: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              <span style={{ color: 'var(--cloud)' }}>Tier III  |  Ultra-Luxe  :  </span><em style={{ color: 'var(--saffron)' }}>Extraordinary Bhutan</em>
            </h3>
            <div className="meta">
              <div>
                <span className="k">Curated Journey Range</span>
                <span className="v">$25,000 – $35,000+</span>
              </div>
              <div>
                <span className="k">Duration</span>
                <span className="v">10 days</span>
              </div>
              <div>
                <span className="k">Region</span>
                <span className="v">Paro · Haa · Thimphu · Punakha · Gangtey</span>
              </div>
            </div>
            <p>
              Our most exclusive journey, combining private spiritual access, extraordinary events, luxury wilderness retreats, and Bhutan's finest hospitality.
            </p>
            <p style={{ marginTop: '12px', fontSize: '13px', color: 'rgba(247,245,240,0.6)', fontStyle: 'italic' }}>
              *Same regions as Tier 2, but higher level of accommodations, private events, spiritual access, exclusivity and possible helicopter transportation.
            </p>
            <div className="actions">
              <a href="#" className="btn-line">
                Sample Itinerary →
              </a>
            </div>
          </div>
        </article>
      </section>

      {/* REGIONS */}
      <section id="regions">
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px' }}>
            <div style={{ maxWidth: '520px' }}>
              <h2 style={{ marginBottom: '16px' }}>
                Regions and <em>Routes</em>
              </h2>
              <p className="intro">
                Some of Bhutan's most remarkable regions remain beyond the reach of ordinary travel. Through trusted local relationships, special permits, and meticulous advance planning, we create opportunities for experiences few visitors ever encounter.
              </p>
            </div>
            <img
              src="/global-map.jpg"
              alt="Bhutan Asia Location"
              onClick={() => setMapLightbox(true)}
              style={{ width: '280px', display: 'block', borderRadius: '0', flexShrink: 0, cursor: 'zoom-in' }}
            />
          </div>

          <img src="/route-map.jpg" alt="Tour Routes of Bhutan" style={{ width: '100%', display: 'block', borderRadius: '0' }} />
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
              <span className="label">Concierge Inquiry</span>
              <h3>A short, private conversation</h3>
              <p>
                We respond within 48 hours by phone or by email — whichever you
                prefer.
              </p>
              <div className="steps">
                {[1, 2, 3].map((n) => {
                  const cls =
                    done || step > n ? "done" : step === n ? "active" : "";
                  const labels = [
                    "About you",
                    "Tier & window",
                    "Anything else",
                  ];
                  return (
                    <div key={n} className={`row ${cls}`} data-i={n}>
                      <span className="n">{String(n).padStart(2, "0")}</span>
                      <span className="l">{labels[n - 1]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(247,245,240,0.4)",
              }}
            >
              Held in strict confidence
            </div>
          </aside>

          <div className="form-pane">
            <div className="head">
              <span className="label">
                {done ? "Confirmation" : `Step ${step} of ${TOTAL_STEPS}`}
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
                    <h2>
                      Let&apos;s begin with <em>you</em>
                    </h2>
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
                  </div>

                  <div
                    className={`modal-step${step === 2 ? " on" : ""}`}
                    data-step={2}
                  >
                    <h2>
                      Choose your <em>tier</em>
                    </h2>
                    <div className="tier-pick">
                      <label>
                        <input type="radio" name="tier" value="luxe" />
                        <span className="tp-name">Luxe</span>
                        <span className="tp-price">
                          $8K – $12K · 10 days
                        </span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="tier"
                          value="boutique-luxe"
                        />
                        <span className="tp-name">Boutique-Luxe</span>
                        <span className="tp-price">
                          $12K – $25K · 10 days
                        </span>
                      </label>
                      <label>
                        <input type="radio" name="tier" value="ultra-luxe" />
                        <span className="tp-name">Ultra-Luxe</span>
                        <span className="tp-price">
                          $25K – $35K+ · 10 days
                        </span>
                      </label>
                    </div>
                    <div className="form-group" style={{ marginTop: 16 }}>
                      <label htmlFor="m_window">
                        Preferred Travel Window
                      </label>
                      <input
                        type="text"
                        id="m_window"
                        name="window"
                        placeholder="e.g. Spring 2026, flexible"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="m_group">Group Size</label>
                      <input
                        type="number"
                        id="m_group"
                        name="group"
                        min={1}
                        max={8}
                        placeholder="1 – 8 guests"
                      />
                    </div>
                  </div>

                  <div
                    className={`modal-step${step === 3 ? " on" : ""}`}
                    data-step={3}
                  >
                    <h2>
                      Anything else we<br />
                      should <em>know</em>
                    </h2>
                    <div className="form-group">
                      <label htmlFor="m_notes">
                        Interests, requirements, questions
                      </label>
                      <textarea
                        id="m_notes"
                        name="notes"
                        placeholder="Optional — spiritual, outdoor, photographic, dietary, anything at all"
                      />
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(59,58,54,0.5)",
                        lineHeight: 1.6,
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
                      className="back"
                      onClick={back}
                      style={{ visibility: step === 1 ? "hidden" : "visible" }}
                    >
                      ← Back
                    </button>
                    <span className="progress">
                      {String(step).padStart(2, "0")} / 0{TOTAL_STEPS}
                    </span>
                    <button
                      type="button"
                      className="next"
                      onClick={nextOrSubmit}
                      disabled={pending}
                    >
                      {pending
                        ? "Submitting…"
                        : step === TOTAL_STEPS
                          ? "Submit Inquiry"
                          : "Continue →"}
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
              <span className="word">Bhutan-Luxe</span>
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
              <h5>Tiers</h5>
              <a href="#tiers">Luxe</a>
              <a href="#tiers">Boutique-Luxe</a>
              <a href="#tiers">Ultra-Luxe</a>
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
            <span>© Bhutan-Luxe Travel · Houston, Texas</span>
          </div>
        </div>
      </footer>
    </>
  );
}
