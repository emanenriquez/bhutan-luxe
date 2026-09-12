// The Admin surface's information architecture: the slots, in display order.
//
// Three labelled sections (agreed 2026-08-09, see
// docs/product/eight-edges/eight-edges-engineering-plan.md): OPERATING SYSTEM
// points the company (the dashboard and the Edges pages), FOUR OFFICES runs it
// (the nested-by-office IA: every feature lives under a System inside an Office,
// see docs/product/four-offices-of-the-future.md), WORKSPACE configures it.
// Offices and Systems both collapse.
//
// This file names no entity and holds no rows. Each entity contributes its rows
// to a slot from its browser-safe door, and app/nav.ts — generated from the
// deployment — hands the shell the contributions of the entities installed here
// (ADR 0002). A slot nobody contributes to is not rendered.
import type { NavSlot } from "./nav";

const OS = "Operating System";
const OFFICES = "Four Offices";

export const ADMIN_SLOTS: NavSlot[] = [
  { section: OS, group: "Company", collapsible: true },

  { section: OFFICES, group: "Revenue", collapsible: true },
  { section: OFFICES, group: "Revenue", subheading: "CRM" },
  { section: OFFICES, group: "Revenue", subheading: "Commerce" },
  { section: OFFICES, group: "Revenue", subheading: "Marketing" },

  { section: OFFICES, group: "Operations", collapsible: true },
  { section: OFFICES, group: "Operations", subheading: "Settings" },
  { section: OFFICES, group: "Operations", subheading: "Workspace" },
];
