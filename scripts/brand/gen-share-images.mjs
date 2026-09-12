// Generates the favicons and social share images for the marketing site and
// the CRM from the brand logo and the page hero photos. Output is committed;
// run again only when a hero, title or the logo changes.
//
//   node scripts/brand/gen-share-images.mjs [path/to/PlayfairDisplay.ttf]
//
// Renders SVG through resvg (already a dependency of the CRM). Photos and the
// logo are embedded as data URIs; text uses Playfair Display when a TTF path
// is given (the site's display face), else the system serif.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { Resvg } from "@resvg/resvg-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const playfair = process.argv[2] ? path.resolve(process.argv[2]) : null;

const STONE = "#3B3A36";
const CLOUD = "#F7F5F0";
const GOLD = "#D4A843";

const dataUri = (file) => {
  let ext = path.extname(file).slice(1).toLowerCase();
  if (ext === "webp") {
    // resvg cannot decode WebP; convert with macOS sips into a temp JPEG.
    const tmp = path.join(os.tmpdir(), path.basename(file, ".webp") + ".jpg");
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "88", file, "--out", tmp], { stdio: "ignore" });
    file = tmp;
    ext = "jpg";
  }
  const mime = ext === "jpg" ? "jpeg" : ext;
  return `data:image/${mime};base64,${fs.readFileSync(file).toString("base64")}`;
};
const logo = dataUri(path.join(root, "public/logo.png"));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function render(svg, outFile, width) {
  const r = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: {
      loadSystemFonts: true,
      fontFiles: playfair ? [playfair] : [],
      defaultFontFamily: playfair ? "Playfair Display" : "Georgia",
    },
  });
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, r.render().asPng());
  console.log("wrote", path.relative(root, outFile));
}

const FONT = playfair ? "Playfair Display" : "Georgia";

// ── Share image: hero photo, dark gradient, logo, title ──────────────────────
function shareSvg({ hero, title, subtitle, eyebrow }) {
  const photo = hero ? `<image href="${dataUri(path.join(root, "public", hero))}" x="0" y="0" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>` : "";
  const lines = title.split("\n");
  const titleY = 630 - 96 - (lines.length - 1) * 66;
  const titleText = lines
    .map((l, i) => `<tspan x="72" dy="${i === 0 ? 0 : 66}">${esc(l)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${STONE}"/>
  ${photo}
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.15"/>
      <stop offset="0.55" stop-color="#000" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <image href="${logo}" x="60" y="44" width="178" height="120" preserveAspectRatio="xMidYMid meet"/>
  ${eyebrow ? `<text x="72" y="${titleY - 58}" font-family="${FONT}" font-size="20" letter-spacing="6" fill="${GOLD}">${esc(eyebrow.toUpperCase())}</text>` : ""}
  <text y="${titleY}" font-family="${FONT}" font-size="58" font-weight="500" fill="${CLOUD}">${titleText}</text>
  ${subtitle ? `<text x="72" y="${630 - 44}" font-family="${FONT}" font-size="24" fill="${CLOUD}" fill-opacity="0.85">${esc(subtitle)}</text>` : ""}
</svg>`;
}

const SHARE = [
  { out: "home", hero: "hero-cover.jpg", eyebrow: "Bespoke journeys to Bhutan", title: "The Bhutan Few\nWill Ever See", subtitle: "bhutan-luxe.com" },
  { out: "faq", hero: "faq-hero.jpg", eyebrow: "Frequent questions", title: "Planning a Luxury\nJourney to Bhutan", subtitle: "bhutan-luxe.com/faq" },
  { out: "itinerary-discovery", hero: "discovery-hero.jpg", eyebrow: "Tier I · Essential Bhutan", title: "The Discovery Path", subtitle: "bhutan-luxe.com/itinerary/discovery" },
  { out: "itinerary-immersion", hero: "immersion-hero.jpg", eyebrow: "Tier II · Deeper Discovery", title: "The Immersion Path", subtitle: "bhutan-luxe.com/itinerary/immersion" },
  { out: "itinerary-extraordinary", hero: "extraordinary-hero.jpg", eyebrow: "Tier III", title: "The Extraordinary Path", subtitle: "bhutan-luxe.com/itinerary/extraordinary" },
  { out: "testimonials", hero: "partner-photo.webp", eyebrow: "Partner testimonies", title: "Firsthand Accounts\nfrom Bhutan", subtitle: "bhutan-luxe.com/testimonials" },
  { out: "weather-guide", hero: "weather-hero.jpg", eyebrow: "Preferred path dates", title: "The Ideal Seasons\nto Experience Bhutan", subtitle: "bhutan-luxe.com/weather-guide" },
  { out: "admin", hero: null, eyebrow: "Concierge CRM", title: "Bhutan Luxe CRM", subtitle: "Contacts, inquiries, deals and affiliates" },
];

for (const s of SHARE) render(shareSvg(s), path.join(root, "public/og", `${s.out}.png`), 1200);

// ── Favicon: the monogram (mountains + BL) on stone ──────────────────────────
// The logo is 619×416 with the wordmark in the bottom quarter; crop to the
// monogram and centre it on a rounded stone square.
function iconSvg(size) {
  const r = Math.round(size * 0.18);
  // Crop the 619×416 logo to the monogram (mountains + BL), leaving the wordmark out.
  const box = Math.round(size * 0.8);
  const off = Math.round((size - box) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${STONE}"/>
  <svg x="${off}" y="${off}" width="${box}" height="${box}" viewBox="128 22 372 276" preserveAspectRatio="xMidYMid meet">
    <image href="${logo}" x="0" y="0" width="619" height="416"/>
  </svg>
</svg>`;
}

for (const group of ["(site)", "(admin)"]) {
  render(iconSvg(512), path.join(root, "app", group, "icon.png"), 512);
  render(iconSvg(180), path.join(root, "app", group, "apple-icon.png"), 180);
}
