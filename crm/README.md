# Bhutan Luxe CRM

The admin CRM for bhutan-luxe.com: contacts, inquiries, leads, deals, meetings and affiliates. It runs as its own Vercel project from this `crm/` folder, on its own Supabase project, separate from the marketing site at the repo root.

Built on the open-source 8 Edges company OS (Next.js 14, Supabase, Vercel), installed with the `crm` entity and the entities it requires. Talent, Innovation, the Team Portal, the Client Portal and the marketing site are not installed.

## Map

| Where | What |
|---|---|
| `deployments/bhutan-luxe.json` | The installed entities. `npm run gen:deployment` and `npm run gen:app-mounts` derive `app/` from it. |
| `entities/crm/` | Inquiries, leads, deals, meetings, affiliates. `entities/crm/api/inquiries/route.ts` is the endpoint the marketing site posts to. |
| `entities/contacts/`, `entities/company-os/` | People and companies; admin shell, login, settings. |
| `kernel/` | Shared UI, auth, data clients, config. `kernel/config/palette.json` holds the design tokens. |
| `app/` | Generated mounts. Do not edit by hand; regenerate. |
| `supabase/` | Schema as loaded into the Supabase project (`00-prereqs.sql`, `01-schema.sql`, `02-rebrand.sql`). |

## Runtime

- **Vercel project** `bhutan-luxe-crm` (root directory `crm`), team `emanenriquezs-projects`.
- **Supabase project** `bhutan-luxe-crm`, ref `nvnuiejkmlvvfrmjlmwg`, Edge8 org, Singapore. Schema in `company_os`.
- **Admins** are rows in `company_os.admins` plus a Supabase Auth user. Manage at `/admin/settings/admins`.
- **Inquiries** arrive from the site's Concierge Inquiry form via `POST /api/inquiries` with the `x-inquiry-secret` header. They land on `/admin/revenue/inquiries` as `new_lead`.

## Environment variables

Set on the Vercel project. Required: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAILS`, `CRON_SECRET`, `DEPLOYMENT=bhutan-luxe`, `INQUIRY_INGEST_SECRET`, `NEXT_PUBLIC_ORG_NAME`, `EMAIL_FROM`.

Optional: `RESEND_API_KEY` (transactional mail), `ANTHROPIC_API_KEY` (assistants and AI summaries), `SENSITIVE_VIEWERS`, `QBO_*` (QuickBooks). `app/env.ts` is the generated list of everything this build reads.

## Local development

```bash
cd crm
npm ci
DEPLOYMENT=bhutan-luxe npm run gen:deployment && DEPLOYMENT=bhutan-luxe npm run gen:app-mounts
npm run dev
```

`npm run typecheck` and `npm run build` must pass before pushing. The full gate suite is `npm run check`.
