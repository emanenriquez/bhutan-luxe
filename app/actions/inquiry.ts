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
  budget: string;
  theme: string;
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
    budget: String(formData.get("budget") ?? "").trim(),
    theme: String(formData.get("theme") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };

  if (!payload.name || !payload.email) {
    return { ok: false, error: "Name and email are required." };
  }
  if (!ALLOWED_TIERS.has(payload.tier)) {
    return { ok: false, error: "Please choose a tier." };
  }

  // Attempt to save to Supabase — non-blocking; emails always go out.
  let refCode: string | undefined;
  try {
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
    } else {
      const row = Array.isArray(data) ? data[0] : data;
      refCode = row?.ref_code;
      console.log("[inquiry-saved]", {
        inquiry_id: row?.inquiry_id,
        ref: refCode,
        tier: payload.tier,
        email: payload.email,
      });
    }
  } catch (err) {
    console.error("[inquiry-rpc-exception]", { err, email: payload.email });
  }

  await notifyConcierge(payload, refCode);
  await sendAutoReply(payload);

  return { ok: true, refCode };
}

async function notifyConcierge(payload: InquiryPayload, refCode?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[inquiry-email-skipped] RESEND_API_KEY not set");
    return;
  }

  const waDigits = payload.phone.replace(/[^\d]/g, "");
  const waLink = waDigits ? `https://wa.me/${waDigits}` : null;

  const html = `
    <h2>New Inquiry${refCode ? ` — ${refCode}` : ""}</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
    ${waLink ? `<p><a href="${waLink}">Message ${escapeHtml(payload.name)} on WhatsApp →</a></p>` : ""}
    ${payload.tier ? `<p><strong>Journey tier:</strong> ${escapeHtml(payload.tier)}</p>` : ""}
    ${payload.travelWindow ? `<p><strong>Travel window:</strong> ${escapeHtml(payload.travelWindow)}</p>` : ""}
    ${payload.groupSize ? `<p><strong>Group size:</strong> ${escapeHtml(payload.groupSize)}</p>` : ""}
    ${payload.budget ? `<p><strong>Budget per person:</strong> ${escapeHtml(payload.budget)}</p>` : ""}
    ${payload.theme ? `<p><strong>Journey theme:</strong> ${escapeHtml(payload.theme)}</p>` : ""}
    ${payload.notes ? `<p><strong>Notes:</strong> ${escapeHtml(payload.notes)}</p>` : ""}
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

async function sendAutoReply(payload: InquiryPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[auto-reply-skipped] RESEND_API_KEY not set");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Bhutan-Luxe Concierge <concierge@bhutan-luxe.com>",
      to: payload.email,
      subject: "We've received your inquiry — Bhutan-Luxe.com",
      html: `<p>Thanks for getting in touch with Bhutan-Luxe.com! We are confirming that your email was received and we will revert soon!</p>`,
    });
  } catch (err) {
    console.error("[auto-reply-failed]", err);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
