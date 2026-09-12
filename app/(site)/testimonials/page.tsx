import type { Metadata } from "next";
import Link from "next/link";
import NavMenu from "../components/NavMenu";

export const metadata: Metadata = {
  title: "Partner Testimonies — Bhutan-Luxe",
  description: "Firsthand accounts from travelers who discovered Bhutan with our on-the-ground partners.",
};

const testimonials = [
  {
    quote: `Go to Bhutan! Stop procrastinating. I have wanted to go over for over 10 years. It is 1000% worth it. I traveled with three of my girlfriends. Dechan, Menda and a few others coordinated all of our plans, visas, airline tickets, etc. We know there was a lot of coordination! Our fabulous guide, Kuenga, taught us about Buddhism and the Bhutanese culture over six days while there and we all fell in love with his cool, calm demeanor. He handled 4 women and our desire to shop like a pro. Ngwang got us everywhere we wanted to go in style, comfort and very safely. A bit of our hearts will be in Bhutan forever! ❤️`,
    name: "Shari F.",
    country: "United States",
  },
  {
    quote: `Our eight-day visit to Bhutan was completely unforgettable. From being treated to ancient cultural dances by a bonfire at an exclusive overnight camp and taking cold river plunges at sunset, to eating fresh produce picked straight from the land at a local farm home before having a traditional hot stone bath; from hiking to a remote monastery where we spent the night, to finally getting to experience the Tiger's Nest after many years of dreaming, this trip was truly once-in-a-lifetime. Our guide Thunder was not only very knowledgeable, honest and detail-orientated, but he also had a great sense of humour and became a friend, too. We still get goosebumps when we think about our Bhutan trip, and we can't wait to return.`,
    name: "Caro Cook",
    country: "Ireland",
  },
  {
    quote: `The program was catered per my preferences instead of based on a general itinerary template. I got to visit Laya, the highest settlement in Bhutan. It was heaven on earth. The guides and driver were attentive throughout the trip, they cared about my safety and checked in with me frequently if I needed anything. The guides were also very knowledgeable, I learned so much history and culture. The communication before the trip with the team was smooth, we sorted out the program quickly and they were very responsive.`,
    name: "Michellia U.",
    country: "Canada",
  },
  {
    quote: `I bring home a sense of awe, wonder, and privilege from our visit to your homeland. Your itinerary gave us wide and honest exposure to the breadth and wealth of your land's history, institutions, geography, values, and people. Importantly, Tshepak and Sonam provided generous and consistent support together with most pleasant demeanors; we knew we could absolutely count on each of them to be looking out for every care and need — and a step ahead of us besides. Your arrangements for special meetings with lamas, the home of Aurn Karma, Dasho Dorji, and Karma Toeb further added to our experience together with time at Sangwa Camp, forest bathing, witnessing the festival and outdoor luncheons. All introduced individuals were interesting and kind.\n\nThank you for offering and managing a lifetime experience.`,
    name: "Bill A.",
    country: "United States",
  },
  {
    quote: `We knew that traveling this beautiful country would offer lifetime memories, but we could have never predicted the level of service, care, and friendship afforded by everyone. From the Executive Director to our trip advisor (Dechen Yangzom) to our fearless, funny, smart, and thoughtful guides (Kuenga Lhuendup and Kinsang Chopel), we could not have asked for better support. Of particular note was this company's attention to detail around our own specific interests and needs. We aspired to connect deeply with the people, the traditions, the culture, and I can say unequivocally that the On-The-Ground partner delivered on every level. They gave us an intimate look into the youth, the monastics, the music, the cultural heritage, the food, and the charming people. Bhutan is a very special part of the world — a must-see for anyone looking for an off-the-beaten track adventure in a country with endless beauty and spirit.`,
    name: "Christopher R.",
    country: "United States",
  },
  {
    quote: `There is one word that best describes my trip to Bhutan: MAGICAL.\n\nFrom start to finish the team could not have done more for me or to make my trip more special. The communication from our trip designer was always speedy and my questions always answered well. She even made a special effort to meet me in person at my hotel, which was wonderful.\n\nAll the accommodation exceeded my expectations and the views from some of the windows made me wish I could sit there all day! The staff everywhere were so friendly and helpful. There was always so much food and great variety.\n\nMy driver Namgay was so polite, always checking in to see if I was okay. I was in great hands and he did a great job, sharing information and stories about life in Bhutan when I asked. We had quite a few good laughs.\n\nI cannot speak highly enough of my guide, Sangay. What a mountain of knowledge! He taught me so much while I was there and was always patient. Nothing was too much trouble. After just one day I felt that I didn't have a guide and a driver, but two new friends. 😊\n\nI came specifically to hike to Tiger's Nest on my birthday and could not have had a more special day. I even had a birthday cake with candles presented to me after dinner in a local family house and everyone sang! I felt truly spoilt.\n\nThank you all for giving me the trip and the birthday of a lifetime. I truly hope to return to your magical country one day. Much love to you all. 💖`,
    name: "Vashti H.",
    country: "United Kingdom",
  },
  {
    quote: `How do I even begin to describe this experience? People ask me to give one highlight and I cannot. It was not a trip but a cultural and familial visit with a country, its people, and its precious culture. It was a time and place that gives one peace, kindness, and care — not only for the body but the soul.\n\nThe trek was flawless. We were taken care of by a team including two horsemen, a cook and his assistant, three young men who took care of our every need, and a guide. The food was delicious, always prepared with the best spices including fruits and vegetables. The team made sure we had an experience that was safe and yet thrilling. The tours of the monasteries, stupas, and other holy sites were informative and life-changing. Our camps were gorgeous and magical. The crew's authenticity made it an experience of a lifetime.`,
    name: "Josh M.",
    country: "United States",
  },
  {
    quote: `Excellent communication for the whole organization process.`,
    name: "Glen T.",
    country: "New Zealand",
  },
];

export default function Testimonials() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #3B3A36; color: #F7F5F0; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }
        @media (max-width: 600px) {
          .test-hero { padding: 100px 20px 56px !important; }
          .test-hero h1 { font-size: 28px !important; }
          .test-topbar-logo { left: 20px !important; }
          .test-topbar-right { right: 20px !important; }
          .test-topbar-right a { font-size: 9px !important; padding: 7px 12px !important; }
          .test-content { padding: 32px 20px !important; }
          .test-quote-text { font-size: 16px !important; }
          .test-cta { padding: 48px 20px !important; }
          .test-footer { padding: 20px !important; flex-direction: column !important; gap: 8px !important; text-align: center !important; }
        }
      `}</style>

      {/* HERO */}
      <div className="test-hero" style={{ position: "relative", background: "#3B3A36", padding: "120px 56px 72px", textAlign: "center" }}>
        <Link href="/" className="test-topbar-logo" style={{ position: "absolute", top: 20, left: 40, display: "flex", alignItems: "center", zIndex: 10 }}>
          <img src="/logo.png" alt="Bhutan-Luxe" style={{ height: 48, width: "auto" }} />
        </Link>
        <div className="test-topbar-right" style={{ position: "absolute", top: 20, right: 40, zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/?inquiry=open" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "#FF8C00", padding: "9px 18px", borderRadius: 8 }}>
            Inquire Privately ↗
          </Link>
          <NavMenu />
        </div>

        <p style={{ fontFamily: "Inter", fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,168,67,0.65)", marginBottom: 18 }}>
          From Those Who Traveled
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 400, fontStyle: "italic", color: "#F7F5F0", lineHeight: 1.1, maxWidth: 600, margin: "0 auto" }}>
          Affiliate On-The-Ground<br />Partner Reviews
        </h1>
        <div style={{ width: 40, height: 1, background: "#D4A843", margin: "28px auto 0" }} />
      </div>

      {/* TESTIMONIALS */}
      <div className="test-content" style={{ background: "#2D5016", padding: "24px 56px 72px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                padding: "56px 0",
                borderBottom: i < testimonials.length - 1 ? "0.5px solid rgba(212,168,67,0.2)" : "none",
              }}
            >
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 72, lineHeight: 0.75, color: "rgba(212,168,67,0.2)", marginBottom: 16, userSelect: "none" }}>&ldquo;</p>
              <p
                className="test-quote-text"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontStyle: "italic",
                  lineHeight: 1.8,
                  color: "rgba(247,245,240,0.88)",
                  marginBottom: 28,
                  whiteSpace: "pre-line",
                }}
              >
                {t.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "block", width: 28, height: 1, background: "#D4A843", flexShrink: 0 }} />
                <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#D4A843" }}>
                  {t.name}&ensp;·&ensp;{t.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="test-cta" style={{ background: "#3B3A36", padding: "72px 56px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, color: "#F7F5F0", marginBottom: 20 }}>Begin Your Own Journey</h2>
        <Link href="/?inquiry=open" style={{ display: "inline-block", background: "#FF8C00", color: "#000", fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 8 }}>
          Inquire Privately ↗
        </Link>
      </div>

      {/* FOOTER */}
      <div className="test-footer" style={{ background: "#2D5016", padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(247,245,240,0.5)", letterSpacing: "0.1em" }}>← Back to Bhutan-Luxe</Link>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(247,245,240,0.35)", letterSpacing: "0.1em" }}>© Bhutan-Luxe Travel · Houston, Texas</span>
      </div>
    </>
  );
}
