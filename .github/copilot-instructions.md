## Quick orientation — what this project is

- Stack: Vite + React + TypeScript. Tailwind + shadcn-ui for styling and UI primitives.
- Data: Supabase (client at `src/integrations/supabase/client.ts`, DB types at `src/integrations/supabase/types.ts`).
- Routing: file-based conventions in `src/pages/*` mapped in `src/App.tsx` via react-router-dom.

## Where to look first (high-impact files)

- `src/App.tsx` — primary route map; new pages should be added in `src/pages/` and wired here.
- `src/components/ui/` — library of shadcn-style UI primitives (Button, Input, Toaster, etc.). Import via the path alias `@/components/ui/*`.
- `src/integrations/supabase/client.ts` — single supabase client; env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `supabase/migrations/` + `supabase/config.toml` — DB schema and migrations (useful when changing tables).
- `package.json` — dev/build scripts (dev, build, preview, lint).

## Project-specific conventions

- Path alias: `@/*` maps to `src/*` (see `tsconfig.json`). Use `@/` imports across the project.
- Pages/components: pages live in `src/pages` and are referenced as route elements in `src/App.tsx`. Component primitives live under `src/components/` and admin helpers under `src/components/admin/`.
- UI primitives follow the `components/ui/*` pattern and are imported like `import { Button } from "@/components/ui/button"`.
- State & data fetching: prefers `@tanstack/react-query` + server client (`supabase`). Look for `QueryClientProvider` in `src/App.tsx`.

## Data flow & integration rules

- Use the exported `supabase` client (`src/integrations/supabase/client.ts`) for all direct DB calls. Example pattern:

  ```ts
  import { useQuery } from '@tanstack/react-query';
  import { supabase } from '@/integrations/supabase/client';

  const fetchPlays = async () => {
    const { data, error } = await supabase.from('plays').select('*');
    if (error) throw error;
    return data;
  };

  useQuery(['plays'], fetchPlays);
  ```

- DB types are generated at `src/integrations/supabase/types.ts`. Prefer typed `createClient<Database>` usage already present.
- Migrations live in `supabase/migrations/` — update there when altering DB shape.

## Dev / build / debug

- Common commands (from `package.json`):
  - npm i
  - npm run dev      → start Vite dev server (hot reload)
  - npm run build    → production build
  - npm run preview  → preview built assets
  - npm run lint     → run ESLint against repo

- Environment: create a `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable Supabase during dev.

## Patterns and anti-patterns observed

- Keep all server calls centralized through `src/integrations/supabase/client.ts` rather than creating ad-hoc clients.
- UI should use the primitives in `src/components/ui/*` so style/behavior remains consistent (buttons, inputs, toaster/sonner, etc.).
- Pages are thin: most logic belongs in components/hooks or in server integration helpers — follow existing separation (see `src/pages/*` vs `src/components/*`).

## Quick examples (where to edit)

- Add a new page: `src/pages/MyPage.tsx` → add route in `src/App.tsx` inside `<Route element={<Layout/>}>`.
- Add a UI primitive: `src/components/ui/my-primitive.tsx` and export it using existing patterns (check `button.tsx` and `input.tsx`).

## When to ask the repo owner

- Missing env values required for Supabase credentials or deployment secrets.
- Changes that require DB migration updates — coordinate before editing `supabase/migrations/`.

---
If anything above is unclear or you want more examples (tests, adding CI, or scaffolding a new page + query + admin dialog), tell me which area to expand. 
