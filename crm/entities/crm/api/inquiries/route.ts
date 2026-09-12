// Inbound inquiries from the marketing site (bhutan-luxe.com). The site's
// Concierge Inquiry form posts here with a shared secret; the row lands on the
// inquiries board as new_lead for triage. Email notification stays on the site,
// which already mails concierge@ via Resend, so nothing is sent from here.
import { NextRequest, NextResponse } from "next/server";
import { companyOs } from "@/kernel/data/supabase";
import { getOrCreatePerson } from "@/kernel/data/company-os";
import { insertInquiries } from "@/entities/crm/lib/writes";
import { SOURCE_SITE } from "@/kernel/config/utils";

const ALLOWED_TIERS = new Set(["luxe", "boutique-luxe", "ultra-luxe", "bespoke"]);

function str(v: unknown, max = 2000): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.INQUIRY_INGEST_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Ingest not configured." }, { status: 503 });
  }
  if (req.headers.get("x-inquiry-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = str(body.name, 200);
  const email = str(body.email, 320)?.toLowerCase() ?? null;
  const phone = str(body.phone, 60);
  const tier = str(body.tier, 40);
  const travelWindow = str(body.travelWindow, 200);
  const groupSize = Number.isFinite(Number(body.groupSize)) && Number(body.groupSize) > 0 ? Number(body.groupSize) : null;
  const budget = str(body.budget, 200);
  const theme = str(body.theme, 200);
  const notes = str(body.notes);
  const refCode = str(body.refCode, 64);

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (tier && !ALLOWED_TIERS.has(tier)) {
    return NextResponse.json({ error: "Unknown tier." }, { status: 400 });
  }

  const person = await getOrCreatePerson({ email, name, phone, source: SOURCE_SITE || "bhutan-luxe.com" });
  if (!person.ok) {
    return NextResponse.json({ error: person.error }, { status: 500 });
  }

  let affiliateId: string | null = null;
  if (refCode) {
    const { data } = await companyOs
      .from("affiliates")
      .select("id")
      .eq("code", refCode)
      .eq("active", true)
      .maybeSingle();
    affiliateId = data?.id ?? null;
  }

  const subject = [tier, travelWindow].filter(Boolean).join(" · ") || "Concierge inquiry";
  const { data: inserted, error } = await insertInquiries({
    person_id: person.id,
    type: "trip",
    subject,
    message: notes,
    source: "website",
    source_site: SOURCE_SITE || "bhutan-luxe.com",
    status: "new_lead",
    affiliate_id: affiliateId,
    metadata: {
      tier,
      travel_window: travelWindow,
      group_size: groupSize,
      budget,
      theme,
      ref_code: refCode,
      phone,
    },
  })
    .select("id")
    .single();

  if (error) {
    console.error("[inquiry-ingest] insert failed:", error.message);
    return NextResponse.json({ error: "Could not save inquiry." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inquiryId: inserted.id, personId: person.id });
}
