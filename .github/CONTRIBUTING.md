# Contributing to LabCheck

Thanks for your interest in contributing! This document explains how to set up
the project, the standards we follow, and how to propose changes.

## Code of Conduct

This project is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By
participating, you are expected to uphold it. Please report unacceptable
behavior to **johnny@johnnyrobot.ai**.

## Project overview

LabCheck is a **client-only React 19 PWA** — there is no backend. All state is
stored in the browser via LocalForage. Keep that architecture in mind: features
should work offline and must not introduce a server dependency.

## Getting started

Prerequisites: **Node.js 20.19+ (or 22.12+)** and npm.

```bash
git clone https://github.com/johnnyrobot/labcheck.git
cd labcheck
npm install
npm run dev
```

## Development workflow

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feature/short-description
   ```
2. Make your change. Follow the existing code style and use the shadcn/ui
   primitives in `src/components/ui/` rather than introducing new UI libraries.
3. Run the full local check suite before opening a PR:
   ```bash
   npm run lint          # ESLint
   npm test              # Vitest
   npm run build         # Production build must succeed
   sh scripts/verify-theme.sh
   sh scripts/verify-manifest.sh
   sh scripts/verify-sw.sh
   sh scripts/verify-no-mui.sh
   ```
   CI runs the same checks on every pull request.
4. Commit with a clear, conventional message (e.g. `fix:`, `feat:`, `chore:`,
   `docs:`).
5. Push your branch and open a pull request against `main`, filling out the PR
   template.

## Guidelines

- **No backend / no telemetry.** Student data must never leave the device.
- **Accessibility matters.** Use semantic components; dialogs must have a
  `DialogDescription`. Keep keyboard navigation working.
- **Tailwind v4 is CSS-first.** Theme tokens live in `src/index.css`; there is no
  `tailwind.config.js`.
- Add or update tests when you change behavior.

## Reporting bugs and requesting features

Use the [issue templates](https://github.com/johnnyrobot/labcheck/issues/new/choose).
For security issues, **do not open a public issue** — see our
[Security Policy](SECURITY.md).
