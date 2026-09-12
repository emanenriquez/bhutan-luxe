"use server";

import { revalidatePath } from "next/cache";
import { companyOs } from "@/kernel/data/supabase";
import { requireAdmin } from "@/kernel/identity/admin-auth";
import { recordAudit } from "@/kernel/audit/audit";
import { toPatch } from "@/kernel/config/patch";
import { type Result } from "@/entities/crm";
import { adminAddGoal, adminDeleteGoal, adminUpdateGoal, type MyGoalInput } from "@/entities/coaching";
import {
  checkInKr as _checkInKr,
  createKr as _createKr,
  createObjective as _createObjective,
  updateKr as _updateKr,
  updateObjective as _updateObjective,
  type KrInput,
  type ObjectiveInput,
} from "../edges/goals/actions";
import { type KrStatus } from "@/entities/org/lib/company/edges-shared";

// Server actions for the admin Company section. Strategy and Core Values are
// edited here directly; individual FAST goals delegate to the admin* helpers in
// lib/coaching/data (which share column shaping with the members' own writes).
// Every write is admin-gated and audited, and revalidates both the admin page
// and the company-visible /team page that reads the same row.

// ---- Strategy -----------------------------------------------------------

// The sections StrategyView knows how to render, pre-filled so the first edit
// is a rewrite, not a blank page. Anything added beyond these renders as prose.
const STRATEGY_TEMPLATE = (year: number) => `## Ambition
Become the concierge of choice for travellers who want Bhutan at its most private and considered.

## Purpose
Open the kingdom to a few guests a year, on terms that respect Bhutan and reward our partners on the ground.

## Value Proposition
Bespoke journeys, three clear tiers, one concierge from first inquiry to the flight home.

## Themes
- ${year}: Fill the first season and prove the concierge model

## Business Lines
### Discovery Path
Tier I. The essential Bhutan journey.

### Immersion Path
Tier II. Deeper access, longer stays.

### Extraordinary Path
Tier III. Rare access, exceptional settings, fully bespoke.

## Overview
Where the business is now, what the year is for, and what we will not do.
`;

// Seeds the first strategy row for the current year (the page shows the most
// recent year). Idempotent: an existing row for the year is left alone.
export async function createStrategy(): Promise<Result> {
  const admin = await requireAdmin();
  const year = new Date().getFullYear();
  const { data: existing } = await companyOs.from("strategies").select("id").eq("year", year).maybeSingle();
  if (existing) return { ok: true };
  const row = { year, title: `Bhutan Luxe strategy ${year}`, body_md: STRATEGY_TEMPLATE(year) };
  const { data, error } = await companyOs.from("strategies").insert(row).select("id").single();
  if (error) return { ok: false, error: error.message };
  await recordAudit({ table: "strategies", recordId: data.id, operation: "insert", actor: admin.email, newData: row });
  revalidatePath("/admin/company/strategy");
  revalidatePath("/team/strategy");
  return { ok: true };
}

export async function updateStrategy(id: string, patch: { title?: string; body_md?: string }): Promise<Result> {
  const admin = await requireAdmin();
  if (patch.title !== undefined && !patch.title.trim()) {
    return { ok: false, error: "The strategy line can't be empty." };
  }
  const updates = { ...toPatch(patch), updated_at: new Date().toISOString() };
  const { error } = await companyOs.from("strategies").update(updates).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await recordAudit({ table: "strategies", recordId: id, operation: "update", actor: admin.email, newData: patch });
  revalidatePath("/admin/company/strategy");
  revalidatePath("/admin/edges/goals");
  revalidatePath("/team/strategy");
  return { ok: true };
}

// ---- Core Values --------------------------------------------------------
function refreshValues() {
  revalidatePath("/admin/company/values");
  revalidatePath("/team/values");
}

export async function createValue(input: { title: string; description: string }): Promise<Result> {
  const admin = await requireAdmin();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "A value needs a title." };
  if (!input.description.trim()) return { ok: false, error: "A value needs a description." };

  // Append to the end: one past the current max sort_order.
  const { data: last, error: lastErr } = await companyOs
    .from("core_values")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (lastErr) return { ok: false, error: lastErr.message };
  const nextOrder = ((last as { sort_order: number } | null)?.sort_order ?? 0) + 1;

  const row = { title, description: input.description.trim(), sort_order: nextOrder };
  const { data, error } = await companyOs.from("core_values").insert(row).select("id").single();
  if (error) return { ok: false, error: error.message };
  await recordAudit({ table: "core_values", recordId: data.id, operation: "insert", actor: admin.email, newData: row });
  refreshValues();
  return { ok: true };
}

export async function updateValue(id: string, patch: { title?: string; description?: string }): Promise<Result> {
  const admin = await requireAdmin();
  if (patch.title !== undefined && !patch.title.trim()) return { ok: false, error: "A value needs a title." };
  if (patch.description !== undefined && !patch.description.trim())
    return { ok: false, error: "A value needs a description." };
  const updates = toPatch(patch);
  const { error } = await companyOs.from("core_values").update(updates).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await recordAudit({ table: "core_values", recordId: id, operation: "update", actor: admin.email, newData: patch });
  refreshValues();
  return { ok: true };
}

export async function deleteValue(id: string): Promise<Result> {
  const admin = await requireAdmin();
  const { error } = await companyOs.from("core_values").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await recordAudit({ table: "core_values", recordId: id, operation: "delete", actor: admin.email });
  refreshValues();
  return { ok: true };
}

// Swap sort_order with the neighbour in the given direction, so the two-step
// glyph ordering on the team page stays a simple reorder.
export async function moveValue(id: string, dir: "up" | "down"): Promise<Result> {
  await requireAdmin();
  const { data: rows, error: rowsErr } = await companyOs
    .from("core_values")
    .select("id, sort_order")
    .order("sort_order");
  if (rowsErr) return { ok: false, error: rowsErr.message };
  const list = (rows ?? []) as { id: string; sort_order: number }[];
  const i = list.findIndex((r) => r.id === id);
  if (i === -1) return { ok: false, error: "Value not found." };
  const j = dir === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= list.length) return { ok: true }; // already at the edge

  const a = list[i];
  const b = list[j];
  const [r1, r2] = await Promise.all([
    companyOs.from("core_values").update({ sort_order: b.sort_order }).eq("id", a.id),
    companyOs.from("core_values").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  const swapError = r1.error ?? r2.error;
  if (swapError) return { ok: false, error: swapError.message };
  refreshValues();
  return { ok: true };
}

// ---- Individual FAST goals (any member) ---------------------------------
function refreshGoals() {
  revalidatePath("/admin/company/goals");
  revalidatePath("/team/company-goals");
  revalidatePath("/team/goals");
}

export async function addMemberGoal(teamMemberId: string, input: MyGoalInput): Promise<Result> {
  const admin = await requireAdmin();
  const res = await adminAddGoal(teamMemberId, input);
  if (!res.ok) return res;
  await recordAudit({
    table: "goals",
    recordId: teamMemberId,
    operation: "insert",
    actor: admin.email,
    newData: { title: input.title, for_team_member: teamMemberId },
  });
  refreshGoals();
  return { ok: true };
}

export async function updateMemberGoal(goalId: string, input: MyGoalInput): Promise<Result> {
  const admin = await requireAdmin();
  const res = await adminUpdateGoal(goalId, input);
  if (!res.ok) return res;
  await recordAudit({
    table: "goals",
    recordId: goalId,
    operation: "update",
    actor: admin.email,
    newData: { title: input.title },
  });
  refreshGoals();
  return { ok: true };
}

export async function deleteMemberGoal(goalId: string): Promise<Result> {
  const admin = await requireAdmin();
  const res = await adminDeleteGoal(goalId);
  if (!res.ok) return res;
  await recordAudit({ table: "goals", recordId: goalId, operation: "delete", actor: admin.email });
  refreshGoals();
  return { ok: true };
}

// ---- Company objectives + key results -----------------------------------
// Inline editing on /admin/company/goals. The underlying writes (requireAdmin,
// validation, audit) live in the Bhutan Luxe CRM actions; these thin wrappers add the
// company + team revalidation so both surfaces refresh. Objectives here are
// always company-level (the only level in use); the cascade board's deeper
// office/executor levels are unaffected.
function refreshCascade() {
  revalidatePath("/admin/company/goals");
  revalidatePath("/team/company-goals");
  revalidatePath("/admin/edges/goals");
}

export async function createObjective(input: ObjectiveInput): Promise<Result & { id?: string }> {
  const res = await _createObjective(input);
  refreshCascade();
  return res;
}

export async function updateObjective(
  id: string,
  patch: { title?: string; status?: string; brand?: string; owner_agent?: string },
): Promise<Result> {
  const res = await _updateObjective(id, patch);
  refreshCascade();
  return res;
}

export async function createKr(input: KrInput): Promise<Result & { id?: string }> {
  const res = await _createKr(input);
  refreshCascade();
  return res;
}

export async function updateKr(id: string, patch: Partial<Omit<KrInput, "objective_id">>): Promise<Result> {
  const res = await _updateKr(id, patch);
  refreshCascade();
  return res;
}

export async function checkInKr(id: string, input: { current_value: number; status: KrStatus }): Promise<Result> {
  const res = await _checkInKr(id, input);
  refreshCascade();
  return res;
}
