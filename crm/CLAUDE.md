# Bhutan Luxe CRM (crm/)

Read `README.md` first: it has the map, the runtime facts and the env list.

## Facts

- This folder is its own Next.js 14 app with its own `package.json`, deployed as Vercel project `bhutan-luxe-crm` with root directory `crm`. The marketing site at the repo root is a separate Next 16 app and a separate Vercel project. Nothing is shared between them except the inquiry POST.
- Brand slug is `bhutan-luxe` (`kernel/config/brand.ts`). The database CHECK constraints carry the same slug via `supabase/02-rebrand.sql`. Never reintroduce a second brand.
- Design tokens live in `kernel/config/palette.json`. Admin styling is `app/admin/admin.css`. Copy an existing `kernel/ui` component before writing a new one.
- `app/` is generated from `deployments/bhutan-luxe.json`. Edit an entity's `routes/` or `api/` folder, then run `DEPLOYMENT=bhutan-luxe npm run gen:app-mounts`. Adding or removing an entity means editing the deployment file and running `gen:deployment` too.
- Entities not in the deployment file still exist under `entities/` because installed entities import from them. They are not mounted and must not be added to the nav.
- The schema column `client_backlog_items.edge8_priority` keeps its upstream name. Renaming it needs a migration plus the `client-programs` entity changes together.

## Ship

Commit to a branch, push, open a PR to `main`. Vercel builds the `crm` project from `crm/` only when files under `crm/` change (ignore-build step). Never `vercel deploy`.

## Before you build

Run `npm run typecheck` and `npm run build` from `crm/`. The upstream gate suite (`npm run check`) is stricter than the Vercel build; treat its failures as advisory unless they touch a file you changed.
