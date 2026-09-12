// What this entity contributes to the Admin shell's navigation (ADR 0002).
// The shell owns the information architecture (kernel/shell/admin-ia.ts) and
// names the slots; this file names the rows that belong in them. Drop the entity
// from a deployment and these rows go with it.
import type { NavContribution } from "@/kernel/shell/nav";

export const adminNav: NavContribution[] = [
  { section: "Operating System", group: "Company", order: 5, items: [
    { label: "Company Dashboard", href: "/admin", ico: "◈", enabled: true },
  ] },
  { section: "Four Offices", group: "Revenue", subheading: "Commerce", order: 10, items: [
    { label: "Orders", href: "/admin/revenue/orders", ico: "⛁", enabled: true },
    { label: "Invoices", href: "/admin/revenue/invoices", ico: "¤", enabled: true },
  ] },
  { section: "Four Offices", group: "Operations", subheading: "Settings", order: 10, items: [
    { label: "Admins", href: "/admin/settings/admins", ico: "⚿", enabled: true },
    // Assume (act as a portal member) returns with the client portal.
  ] },
  { section: "Four Offices", group: "Operations", subheading: "Workspace", order: 10, items: [
    { label: "Surveys", href: "/admin/operations/surveys", ico: "✎", enabled: true },
  ] },
  { section: "Four Offices", group: "Operations", subheading: "Settings", order: 20, items: [
    { label: "Agents", href: "/admin/settings/agents", ico: "⟳", enabled: true, superAdmin: true },
  ] },
];
