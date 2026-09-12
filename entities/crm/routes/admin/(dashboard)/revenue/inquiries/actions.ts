"use server";

import { revalidatePath } from "next/cache";
import { companyOs } from "@/kernel/data/supabase";
import { requireAdmin } from "@/kernel/identity/admin-auth";
import { sendTransactionalEmail } from "@/kernel/messaging/email";
import { promotePersonToLead } from "@/entities/crm/lib/lifecycle";
import { escapeHtml } from "@/kernel/config/html";

type Result = { ok: true } | { ok: false; error: string };

// The four working stages plus the two terminal exits. 'qualified' is not
// movable here: promotion goes through promoteInquiryToLead so the person
// also lands in the SDR lead queue.
const STATUSES = new Set(["new_lead", "contacted", "no_action", "spam", "archived"]);

function refresh() {
  revalidatePath("/admin/revenue/inquiries");
  // The cockpit's "Inquiries to triage" card only shows new_lead; archiving or
  // moving an inquiry must clear it there too, not just on the board.
  revalidatePath("/admin/revenue");
}

export async function moveInquiryStatus(id: string, status: string): Promise<Result> {
  await requireAdmin();
  if (!STATUSES.has(status)) return { ok: false, error: "Invalid status." };
  const { error } = await companyOs.from("inquiries").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function archiveInquiry(id: string): Promise<Result> {
  return moveInquiryStatus(id, "archived");
}

export async function markInquirySpam(id: string): Promise<Result> {
  return moveInquiryStatus(id, "spam");
}

// Promote to lead: the inquiry moves to 'qualified' AND the person joins the
// SDR queue on /admin/revenue/leads via the shared lifecycle helper (upserts
// the lead satellite row with a fresh SLA, logs the transition).
export async function promoteInquiryToLead(id: string): Promise<Result> {
  const admin = await requireAdmin();

  const { data: inquiry, error: iErr } = await companyOs.from("inquiries").select("person_id")
    .eq("id", id)
    .maybeSingle();
  if (iErr || !inquiry) return { ok: false, error: iErr?.message ?? "Inquiry not found." };
  if (!inquiry.person_id) return { ok: false, error: "No contact attached to this inquiry." };

  const promoted = await promotePersonToLead(inquiry.person_id, {
    reason: "inquiry_promoted",
    changedBy: admin.email,
  });
  if (!promoted.ok) return promoted;

  const { error: uErr } = await companyOs.from("inquiries").update({ status: "qualified" })
    .eq("id", id);
  if (uErr) return { ok: false, error: uErr.message };

  refresh();
  revalidatePath("/admin/revenue/leads");
  revalidatePath("/admin/contacts");
  return { ok: true };
}

// Promote to deal: low-volume sales skip the SDR queue. The inquiry moves to
// 'qualified' and a deal opens at the first stage of the active pipeline for
// the same person, titled from the inquiry subject. promoteInquiryToLead stays
// for deployments that run a lead queue.
export async function promoteInquiryToDeal(id: string): Promise<Result> {
  await requireAdmin();

  const { data: inquiry, error: iErr } = await companyOs.from("inquiries").select("person_id, subject, deal_id")
    .eq("id", id)
    .maybeSingle();
  if (iErr || !inquiry) return { ok: false, error: iErr?.message ?? "Inquiry not found." };
  if (!inquiry.person_id) return { ok: false, error: "No contact attached to this inquiry." };
  if (inquiry.deal_id) return { ok: false, error: "This inquiry already has a deal." };

  const { data: person, error: pErr } = await companyOs.from("people")
    .select("full_name, email, person_companies(company_id)")
    .eq("id", inquiry.person_id)
    .maybeSingle();
  if (pErr || !person) return { ok: false, error: pErr?.message ?? "Person not found." };

  const { data: pipeline, error: plErr } = await companyOs.from("pipelines").select("id, pipeline_stages(id, position)")
    .eq("active", true)
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (plErr || !pipeline) return { ok: false, error: plErr?.message ?? "No active pipeline." };
  const stages = (pipeline.pipeline_stages ?? []) as { id: string; position: number }[];
  const firstStage = [...stages].sort((a, b) => a.position - b.position)[0];
  if (!firstStage) return { ok: false, error: "Pipeline has no stages." };

  const { count: stageDealCount } = await companyOs.from("deals").select("id", { count: "exact", head: true })
    .eq("stage_id", firstStage.id);
  const pcs = (person.person_companies ?? []) as { company_id: string }[];
  const name = person.full_name || person.email;

  const { data: deal, error: dErr } = await companyOs.from("deals").insert({
    title: inquiry.subject ? `${name} — ${inquiry.subject}` : name,
    person_id: inquiry.person_id,
    company_id: pcs[0]?.company_id ?? null,
    pipeline_id: pipeline.id,
    stage_id: firstStage.id,
    position: stageDealCount ?? 0,
    status: "open",
    source: "inquiry",
  }).select("id").single();
  if (dErr) return { ok: false, error: dErr.message };

  const { error: uErr } = await companyOs.from("inquiries").update({ status: "qualified", deal_id: deal.id })
    .eq("id", id);
  if (uErr) return { ok: false, error: uErr.message };

  refresh();
  revalidatePath("/admin/revenue/deals");
  revalidatePath("/admin/contacts");
  return { ok: true };
}

export async function replyToInquiry(input: {
  to: string | null;
  subject: string;
  body: string;
  doNotContact: boolean;
}): Promise<Result> {
  await requireAdmin();
  if (input.doNotContact) return { ok: false, error: "This contact is marked do-not-contact." };
  if (!input.to) return { ok: false, error: "No email address on file for this contact." };
  if (!input.body.trim()) return { ok: false, error: "Message is empty." };
  if (!process.env.RESEND_API_KEY) return { ok: false, error: "Email is not configured (RESEND_API_KEY)." };

  await sendTransactionalEmail({
    to: input.to,
    subject: input.subject.trim() || "Re: your inquiry",
    html: `<div>${escapeHtml(input.body).replace(/\n/g, "<br>")}</div>`,
    replyTo: process.env.ADMIN_EMAILS?.split(",")[0]?.trim(),
  });
  return { ok: true };
}
