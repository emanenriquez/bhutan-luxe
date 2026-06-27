# Environment Variables

Set these in Vercel → Project Settings → Environment Variables. There is no local `.env` file checked into this repo.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (inquiries, admin/affiliates) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key, used server-side in `app/actions/inquiry.ts` and admin routes |
| `RESEND_API_KEY` | Resend API key. Used in `app/actions/inquiry.ts` to email new inquiries to `concierge@bhutan-luxe.com`. If unset, inquiries still save to Supabase but no email is sent (logged as `[inquiry-email-skipped]`). Requires the `bhutan-luxe.com` sending domain to be verified in the Resend dashboard. |
