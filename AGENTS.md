# AGENTS.md

LabCheck is a **local-first Progressive Web App** for student sign-in and attendance tracking. Stack: **React 19 + Vite 7** (plain JavaScript/JSX — no TypeScript), **shadcn/ui + Tailwind CSS v4**, `vite-plugin-pwa`/Workbox for offline support, and **LocalForage** for on-device storage. No backend. Production ships as a Docker image serving the built bundle via nginx. MIT.

## Setup

- Node **20.19+ or 22.12+** (CI pins Node 22). npm.
- Optional: Docker for containerized runs.

```bash
npm install
```

Local env is optional (`.env.local`, Vite `VITE_*` vars — see `.env.example`, which is Coolify-oriented). None are required for `npm run dev`.

## Build & Run

```bash
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the built bundle locally

# containerized (production parity):
docker build -t labcheck .
docker run -p 8080:80 labcheck        # → http://localhost:8080
```

Production deployment is nginx-in-Docker. `docker-compose.yml` is a Traefik/Let's-Encrypt example (edit the `Host(...)` rule for your domain); `start.sh` templates `default.conf.template` via `envsubst` and serves a `/health` endpoint.

## Testing

```bash
npm test                    # Vitest run (jsdom + @testing-library/react)
npm run lint                # ESLint flat config
sh scripts/verify-theme.sh      # theme-color gate
sh scripts/verify-manifest.sh   # PWA manifest gate
sh scripts/verify-sw.sh         # service-worker gate
sh scripts/verify-no-mui.sh     # fails if MUI/@emotion is reintroduced
```

- Tests live **beside components** (`SignInModal.test.jsx`, `SignOutModal.test.jsx`) or under `src/test/` (`harness.test.jsx`, `setup.js`). `vitest.config.js` uses `environment: jsdom`, `globals: true`, and `setupFiles: ./src/test/setup.js` (jest-dom matchers).
- **Before a change is done, CI must pass**: `.github/workflows/ci.yml` runs `npm ci` → `npm run lint` → `npm test` → `npm run build` → all four `verify-*.sh` gates. Run that same sequence locally.

## Code Style

- **JavaScript + JSX only.** No TypeScript. Follow existing component patterns.
- UI is **shadcn/ui + Tailwind v4**. Compose with utility classes and the `cn()` helper (`src/lib/utils.js`); use the `@/…` alias for `src/`. **Do not add MUI or another component library** — `verify-no-mui.sh` enforces this.
- Tailwind v4 is **CSS-first**: theme tokens live in `src/index.css`, not a JS config file.
- ESLint flat config (`eslint.config.js`) with `react-hooks` + `react-refresh` rules; keep components hook-correct and fast-refresh-safe. Ensure accessibility (e.g. dialogs need descriptions — see prior `fix(a11y)` work).

## Commit & PR Conventions

- Git repo (default branch `main`; PRs, CodeQL, and Dependabot configured). Use **Conventional Commits** with scopes: `feat:`, `fix(a11y):`, `chore(deps):`, `docs(readme):`.
- Follow `.github/CONTRIBUTING.md` and the PR template. A PR should build clean, pass lint/tests and all `verify-*.sh` gates, and include a short behavior summary (plus screenshots for UI changes).

## Security & Data

- **Privacy-first, data never leaves the device.** Student rosters (names + IDs) and attendance records are stored only in the browser via LocalForage; there is **no server or telemetry**. Do not add code that transmits, syncs, or logs roster/attendance data off-device — treat it as sensitive student PII.
- Export is user-initiated (a ZIP of CSV), and "Start New Session" clears local data. Keep these the only paths data leaves the app.
- Don't commit secrets. `.env*` is gitignored; `.env.example` documents the (public, `VITE_*`) build/deploy vars. nginx security headers live in `nginx.conf` / `default.conf.template`.
- Report vulnerabilities per `.github/SECURITY.md`.
