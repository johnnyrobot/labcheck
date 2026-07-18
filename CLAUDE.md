# CLAUDE.md

LabCheck is a **local-first Progressive Web App** for student sign-in and attendance tracking. React 19 + Vite 7 (**plain JSX, no TypeScript**), shadcn/ui + Tailwind CSS v4, with all data stored **on-device** via LocalForage — there is no backend. Ships as a Docker/nginx static bundle. MIT.

## Architecture

Single-page app; no server, no router — one screen with tabbed views.

- **`src/main.jsx`** — entry; mounts `App` and imports `index.css`.
- **`src/App.jsx`** — the whole app shell + state: class session info, roster, sign-in/out state, tab switching (Student Dashboard vs Manual Sign-In), and data lifecycle (persist/export/clear).
- **`src/index.css`** — Tailwind v4 **CSS-first config** (theme tokens, the purple gradient design system) lives here, not in a `tailwind.config.js`.
- **`src/components/`** — feature components: `ClassDetails.jsx`, `RosterUpload.jsx` (CSV via papaparse), `StudentDashboard.jsx`, `SignInTable.jsx`, `SignInModal.jsx` / `SignOutModal.jsx` (signature capture via `react-signature-pad-wrapper`), `ExportButton.jsx` (ZIP via jszip), `ClearDataButton.jsx`, `UpdateAppButton.jsx` / `UpdateAppModal.jsx` (PWA update-prompt flow). `components/ui/` holds the shadcn/ui primitives.
- **`src/lib/utils.js`** — the shadcn `cn()` helper (clsx + tailwind-merge). `@` is aliased to `src/` (in `vite.config.js`, `vitest.config.js`, `jsconfig.json`, `components.json`).
- **PWA**: `vite-plugin-pwa` in `vite.config.js` generates the service worker + manifest (`registerType: 'prompt'`, `injectRegister: false` — the app registers/prompts for updates itself). Data persists through **LocalForage**.

**Deployment**: `Dockerfile` builds the Vite bundle and serves it with **nginx**. `start.sh` runs `envsubst` over `default.conf.template` (`${SERVICE_FQDN_LABCHECK_PWA}`) and exposes `/health`. `docker-compose.yml` is a **Traefik + Let's Encrypt production example** (host `lab.johnnyrobot.ai`); env is Coolify-oriented (`.env.example`).

## Commands

```bash
npm install         # Node 20.19+ or 22.12+ (CI uses 22)
npm run dev         # Vite dev server → http://localhost:5173
npm run build       # production build → dist/
npm run preview     # serve the built bundle
npm run lint        # ESLint (flat config, eslint.config.js)
npm test            # Vitest run (jsdom + Testing Library)

# repo-specific verification gates (also run in CI):
sh scripts/verify-theme.sh
sh scripts/verify-manifest.sh
sh scripts/verify-sw.sh
sh scripts/verify-no-mui.sh

# container:
docker build -t labcheck . && docker run -p 8080:80 labcheck   # → http://localhost:8080
```

## Conventions

- **JavaScript + JSX only** — no TypeScript. Match the existing component style.
- Build UI from **shadcn/ui + Tailwind v4** utility classes; use the `cn()` helper and the `@/…` import alias. Do **not** introduce MUI or another component library (a CI gate enforces this).
- Tests are **colocated** (`Component.test.jsx` next to the component) or in `src/test/`; `vitest.config.js` sets `globals: true` and `setupFiles: ./src/test/setup.js` (jest-dom matchers).
- ESLint flat config with `react-hooks` and `react-refresh` plugins; keep components hook-safe and fast-refresh-friendly.
- Commits: **Conventional Commits** with scopes (`fix(a11y): …`, `chore(deps): …`, `docs(readme): …`). Community-health files, CI, CodeQL, and Dependabot are configured under `.github/`.

## Gotchas & Constraints

- **CI must stay green**: `.github/workflows/ci.yml` runs `npm ci` → lint → test → build → all four `verify-*.sh` gates. The gates check the theme color, PWA manifest, service worker, and **absence of MUI** — a change that breaks any of them fails CI.
- **No MUI.** The project was migrated off Material UI to shadcn/ui; `verify-no-mui.sh` fails the build if `@mui`/`@emotion` reappears.
- **PWA correctness is load-bearing.** The service worker uses `registerType: 'prompt'` and the app drives its own update UI (`UpdateAppModal`). Changing caching/manifest/theme without updating the corresponding `verify-*.sh` gate will fail CI.
- **All data lives on the device.** Roster and attendance go into LocalForage; "Start New Session" clears it. There is no API to sync to — don't add one that exfiltrates student data (see Security & Data in AGENTS.md).
- CSV roster parsing is tolerant: it treats any column containing "name"/"id" as the relevant field. Export is a ZIP of CSV.
- Tailwind v4 has **no `tailwind.config.js`** — theme config is CSS-first in `src/index.css`. Edit tokens there.
