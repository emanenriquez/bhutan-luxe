# Bhutan Luxe

One Next.js 16 app, one Vercel project (`bhutan-luxe`, team `emanenriquezs-projects`), two route groups.

## Map

| Where | What |
|---|---|
| `app/(site)/` | The marketing site at bhutan-luxe.com. Own root layout, `globals.css`, `components/`, `actions/inquiry.ts` (the Concierge Inquiry form). |
| `app/(admin)/` | The CRM at `/admin`. Own root layout, `globals.css`, `styles/`, `admin/admin.css`. Route files here are **generated** from `entities/` by `npm run gen:app-mounts`; edit the entity, not the mount. |
| `entities/` | CRM feature code (8 Edges layout): `crm`, `contacts`, `company-os`, `org`, `finance`, `billing`, `client-programs`, `ideas`, `assistant` are installed. Other folders exist because installed ones import them; they are not mounted and must not be added to the nav. |
| `kernel/` | CRM shared code: UI components (`kernel/ui`), auth (`kernel/identity`), data clients (`kernel/data`), config (`kernel/config`). Design tokens for the CRM: `kernel/config/palette.json` and `app/(admin)/styles/tokens.css`. |
| `deployments/bhutan-luxe.json` | Which entities are installed. `DEPLOYMENT=bhutan-luxe npm run gen:deployment && npm run gen:app-mounts` regenerates `app/(admin)/{nav,events,env}.ts` and `vercel.json`. |
| `proxy.ts` | Supabase auth gate for `/admin/*`. |
| `supabase/` | CRM schema as loaded into Supabase project `bhutan-luxe-crm` (ref `nvnuiejkmlvvfrmjlmwg`), schema `company_os`. |
| `context/` | Brand style guide (docx) and the original site draft. The marketing design system is the site's own `app/(site)/globals.css`. |
| `ENV.md` | Every environment variable and why. |

## Conventions

- Marketing and CRM share nothing but the repo and the Supabase project. Marketing code never imports `kernel/` or `entities/`, except the inquiry action, which writes the inquiry into the CRM.
- Brand slug is `bhutan-luxe` everywhere (`kernel/config/brand.ts`, DB CHECK constraints). No Edge8 references in user-visible text; comments and the `edge8_priority` column are the known leftovers.
- Admin nav is composed from entity `ui/nav.ts` contributions. Talent, Innovation, Operations, portals are deliberately not in the nav.
- Admins are Supabase Auth users plus a `company_os.admins` row (`/admin/settings/admins`).

## Ship

Branch, `npm run typecheck`, `npm run build`, push, PR to `main`. Vercel deploys `main` to production. Never `vercel deploy`.
