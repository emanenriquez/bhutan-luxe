# Environment Variables

Set these in Vercel → Project Settings → Environment Variables. There is no local `.env` file checked into this repo.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key. Used in `app/(site)/actions/inquiry.ts` to email new inquiries to `concierge@bhutan-luxe.com`. If unset, inquiries still save to the CRM but no email is sent (logged as `[inquiry-email-skipped]`). Requires the `bhutan-luxe.com` sending domain to be verified in the Resend dashboard. |

## CRM (`app/(admin)`, `kernel/`, `entities/`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_URL` | The `bhutan-luxe-crm` Supabase project (ref `nvnuiejkmlvvfrmjlmwg`). Also used by the inquiry form to save each inquiry. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key. Read by `proxy.ts` and the login page. |
| `SUPABASE_SECRET_KEY` | Service role key. Server only. |
| `NEXT_PUBLIC_SITE_URL` | `https://bhutan-luxe.com`. Canonical origin for links in CRM emails. |
| `DEPLOYMENT` | `bhutan-luxe`. Selects `deployments/bhutan-luxe.json` for the generators. |
| `ADMIN_EMAILS`, `EMAIL_FROM`, `MARKETING_EMAIL_FROM`, `HR_ALERT_EMAIL`, `NEXT_PUBLIC_SUPPORT_EMAIL` | Mail routing and senders. |
| `NEXT_PUBLIC_ORG_NAME` | `Bhutan Luxe`. |
| `SENSITIVE_VIEWERS` | Admin emails allowed to see PII and compensation. |
| `CRON_SECRET` | Required by every cron route. |
| `ANTHROPIC_API_KEY` | Optional. Enables the admin assistant and AI meeting summaries. |
| `VERCEL_API_TOKEN` | Optional. A Vercel API token scoped to the `emanenriquezs-projects` team; lets the Company Dashboard show page views from Web Analytics. Without it the tile links to Vercel. |
