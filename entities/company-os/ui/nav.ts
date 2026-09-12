// What this entity contributes to the Admin shell's navigation (ADR 0002).
// The shell owns the information architecture (kernel/shell/admin-ia.ts) and
// names the slots; this file names the rows that belong in them. Drop the entity
// from a deployment and these rows go with it.
import type { NavContribution } from "@/kernel/shell/nav";

export const adminNav: NavContribution[] = [
  { section: "Operating System", group: "Home", order: 10, items: [
    { label: "Company Dashboard", href: "/admin", ico: "◈", enabled: true },
  ] },
  { section: "Four Offices", group: "Revenue", subheading: "Commerce", order: 10, items: [
    { label: "Orders", href: "/admin/revenue/orders", ico: "⛁", enabled: true },
    { label: "Invoices", href: "/admin/revenue/invoices", ico: "¤", enabled: true },
  ] },
  { section: "Four Offices", group: "Revenue", subheading: "Commerce", order: 30, items: [
    { label: "Products", href: "/admin/revenue/products", ico: "▦", enabled: true },
  ] },
  { section: "Workspace", group: "Settings", subheading: "Access", order: 10, items: [
    { label: "Admins", href: "/admin/settings/admins", ico: "⚿", enabled: true },
    { label: "Assume", href: "/admin/settings/assume", ico: "⧉", enabled: true },
  ] },
  { section: "Workspace", group: "Settings", subheading: "Configuration", order: 20, items: [
    { label: "QuickBooks", href: "/admin/settings/quickbooks", ico: "⌁", enabled: true },
  ] },
  { section: "Workspace", group: null, order: 10, items: [
    { label: "Agents", href: "/admin/settings/agents", ico: "⟳", enabled: true, superAdmin: true },
  ] },
];
