"use server";

import { Resend } from "resend";

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

  // Save to the CRM (crm/ in this repo, deployed separately). Non-blocking:
  // emails always go out even if the CRM is unreachable.
  let refCode: string | undefined;
  const crmUrl = process.env.CRM_INQUIRY_URL;
  const crmSecret = process.env.CRM_INQUIRY_SECRET;
  if (!crmUrl || !crmSecret) {
    console.error("[inquiry-crm-skipped] CRM_INQUIRY_URL or CRM_INQUIRY_SECRET not set");
  } else {
    try {
      const res = await fetch(crmUrl, {
        method: "POST",
        headers: { "content-type": "application/json", "x-inquiry-secret": crmSecret },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email.toLowerCase(),
          phone: payload.phone || null,
          tier: payload.tier || null,
          travelWindow: payload.travelWindow || null,
          groupSize: payload.groupSize || null,
          budget: payload.budget || null,
          theme: payload.theme || null,
          notes: payload.notes || null,
        }),
      });
      if (!res.ok) {
        console.error("[inquiry-crm-failed]", { status: res.status, email: payload.email });
      } else {
        const data = (await res.json()) as { inquiryId?: string };
        if (data.inquiryId) refCode = `BL-${data.inquiryId.slice(0, 8).toUpperCase()}`;
        console.log("[inquiry-saved]", { inquiry_id: data.inquiryId, ref: refCode, tier: payload.tier, email: payload.email });
      }
    } catch (err) {
      console.error("[inquiry-crm-exception]", { err, email: payload.email });
    }
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

  const tierLabels: Record<string, string> = {
    "luxe": "Discovery Path ($11,500)",
    "boutique-luxe": "Immersion Path ($18,000)",
    "ultra-luxe": "Extraordinary Path ($35,000)",
    "bespoke": "Bespoke / Custom",
  };

  const html = `
    <p>Dear ${escapeHtml(payload.name)},</p>
    <p>Thank you for reaching out to Bhutan-Luxe. We have received your inquiry and our Concierge travel specialist will be in touch with you shortly.</p>
    <p>Here is a summary of the information you submitted:</p>
    <p style="line-height:2;font-family:sans-serif;font-size:14px;">
      <strong>Name:</strong> ${escapeHtml(payload.name)}<br/>
      <strong>Email:</strong> ${escapeHtml(payload.email)}<br/>
      ${payload.phone ? `<strong>Phone / WhatsApp:</strong> ${escapeHtml(payload.phone)}<br/>` : ""}
      ${payload.tier ? `<strong>Journey Tier:</strong> ${escapeHtml(tierLabels[payload.tier] ?? payload.tier)}<br/>` : ""}
      ${payload.travelWindow ? `<strong>Desired Travel Date:</strong> ${escapeHtml(payload.travelWindow)}<br/>` : ""}
      ${payload.groupSize ? `<strong>Number of Travelers:</strong> ${escapeHtml(payload.groupSize)}<br/>` : ""}
      ${payload.budget ? `<strong>Budget per Person:</strong> ${escapeHtml(payload.budget)}<br/>` : ""}
      ${payload.theme ? `<strong>Journey Theme:</strong> ${escapeHtml(payload.theme)}<br/>` : ""}
      ${payload.notes ? `<strong>Notes:</strong> ${escapeHtml(payload.notes)}<br/>` : ""}
    </p>
    <br/>
    <p>Please be Kind,<br/>Bhutan-Luxe Concierge</p>
  `;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Bhutan-Luxe Concierge <concierge@bhutan-luxe.com>",
      to: payload.email,
      subject: `Concierge Email Received, ${payload.name}`,
      html,
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
