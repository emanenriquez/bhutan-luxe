# Environment Variables

Set these in Vercel → Project Settings → Environment Variables. There is no local `.env` file checked into this repo.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (inquiries, admin/affiliates) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key, used server-side in `app/actions/inquiry.ts` and admin routes |
| `RESEND_API_KEY` | Resend API key. Used in `app/actions/inquiry.ts` to email new inquiries to `concierge@bhutan-luxe.com`. If unset, inquiries still save to Supabase but no email is sent (logged as `[inquiry-email-skipped]`). Requires the `bhutan-luxe.com` sending domain to be verified in the Resend dashboard. |
| `CRM_INQUIRY_URL` | Where the Concierge Inquiry form posts each inquiry: the CRM's `/api/inquiries` route (`https://bhutan-luxe-crm.vercel.app/api/inquiries` until a custom domain is set). If unset, inquiries still email but are not saved. |
| `CRM_INQUIRY_SECRET` | Shared secret sent as the `x-inquiry-secret` header. Must equal `INQUIRY_INGEST_SECRET` on the `bhutan-luxe-crm` Vercel project. |

The `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` rows above are legacy: the site no longer writes to Supabase directly. The CRM lives in [`crm/`](crm/README.md) and deploys as its own Vercel project.
