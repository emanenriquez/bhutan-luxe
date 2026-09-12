// What this entity contributes to the Admin shell's navigation (ADR 0002).
// The shell owns the information architecture (kernel/shell/admin-ia.ts) and
// names the slots; this file names the rows that belong in them. Drop the entity
// from a deployment and these rows go with it.
import type { NavContribution } from "@/kernel/shell/nav";

export const adminNav: NavContribution[] = [
  { section: "Four Offices", group: "Revenue", subheading: "CRM", order: 10, items: [
    // Revenue cockpit hidden from the nav; the page stays at /admin/revenue.
    { label: "Deals", href: "/admin/revenue/deals", ico: "$", enabled: true },
    // Leads (SDR queue) is not used at this volume; inquiries promote straight to deals.
    { label: "Inquiries", href: "/admin/revenue/inquiries", ico: "☰", enabled: true },
    { label: "Companies", href: "/admin/revenue/companies", ico: "▣", enabled: true },
    { label: "Contacts", href: "/admin/contacts", ico: "⚇", enabled: true },
    { label: "Meeting Notes", href: "/admin/revenue/meetings", ico: "☰", enabled: true },
    { label: "Sales Intelligence", href: "/admin/revenue/sales-intelligence", ico: "◭", enabled: true },
  ] },
  { section: "Four Offices", group: "Revenue", subheading: "Commerce", order: 40, items: [
    { label: "Affiliates", href: "/admin/revenue/affiliates", ico: "%", enabled: true },
  ] },
];
