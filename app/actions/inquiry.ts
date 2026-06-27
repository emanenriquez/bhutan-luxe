"use server";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export interface InquiryPayload {
  name: string;
  email: string;
  phone: string;
  tier: string;
  travelWindow: string;
  groupSize: string;
  notes: string;
}

export interface InquiryResult {
  ok: boolean;
  error?: string;
  refCode?: string;
}

const ALLOWED_TIERS = new Set([
  "luxe",
  "boutique-luxe",
  "ultra-luxe",
  "bespoke",
  "",
]);

export async function submitInquiry(
  formData: FormData,
): Promise<InquiryResult> {
  const payload: InquiryPayload = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    tier: String(formData.get("tier") ?? "").trim(),
    travelWindow: String(formData.get("window") ?? "").trim(),
    groupSize: String(formData.get("group") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };

  if (!payload.name || !payload.email) {
    return { ok: false, error: "Name and email are required." };
  }
  if (!ALLOWED_TIERS.has(payload.tier)) {
    return { ok: false, error: "Please choose a tier." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("submit_inquiry", {
    p_name: payload.name,
    p_email: payload.email.toLowerCase(),
    p_phone: payload.phone || null,
    p_tier: payload.tier || null,
    p_travel_window: payload.travelWindow || null,
    p_group_size: payload.groupSize ? Number(payload.groupSize) : null,
    p_notes: payload.notes || null,
    p_type: "inquiry",
    p_source: "website",
    p_ref_code: null,
  });

  if (error) {
    console.error("[inquiry-rpc-failed]", { error, email: payload.email });
    return {
      ok: false,
      error:
        "We couldn't save your inquiry. Please try again, or email concierge@bhutan-luxe.com directly.",
    };
  }

  // RPC returns table; supabase-js returns array. Pick first row.
  const row = Array.isArray(data) ? data[0] : data;
  const refCode: string | undefined = row?.ref_code;

  console.log("[inquiry-saved]", {
    inquiry_id: row?.inquiry_id,
    ref: refCode,
    tier: payload.tier,
    email: payload.email,
  });

  await notifyConcierge(payload, refCode);

  return { ok: true, refCode };
}

const TIER_LABELS: Record<string, string> = {
  luxe: "Discovery",
  "boutique-luxe": "Immersion",
  "ultra-luxe": "Extraordinary",
  bespoke: "Bespoke",
};

async function notifyConcierge(payload: InquiryPayload, refCode?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[inquiry-email-skipped] RESEND_API_KEY not set");
    return;
  }

  const waDigits = payload.phone.replace(/[^\d]/g, "");
  const waLink = waDigits ? `https://wa.me/${waDigits}` : null;
  const tierLabel = TIER_LABELS[payload.tier] ?? (payload.tier || "—");

  const html = `
    <h2>New Inquiry${refCode ? ` — ${refCode}` : ""}</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(payload.phone) || "—"}</p>
    <p><strong>Discovery Path:</strong> ${escapeHtml(tierLabel)}</p>
    <p><strong>Preferred Travel Window:</strong> ${escapeHtml(payload.travelWindow) || "—"}</p>
    <p><strong>Group Size:</strong> ${escapeHtml(payload.groupSize) || "—"}</p>
    <p><strong>Notes:</strong> ${escapeHtml(payload.notes) || "—"}</p>
    ${waLink ? `<p><a href="${waLink}">Message ${escapeHtml(payload.name)} on WhatsApp →</a></p>` : ""}
  `;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Bhutan-Luxe Inquiries <concierge@bhutan-luxe.com>",
      to: "concierge@bhutan-luxe.com",
      replyTo: payload.email,
      subject: `New Inquiry: ${payload.name}${refCode ? ` (${refCode})` : ""}`,
      html,
    });
  } catch (err) {
    console.error("[inquiry-email-failed]", err);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
