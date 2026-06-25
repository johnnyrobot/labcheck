# Security Policy

## Supported versions

LabCheck is released from the `main` branch. Security fixes are applied to the
latest released version.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security model

LabCheck is a **client-only Progressive Web App**. There is no backend server
and no network transmission of student data — all data (rosters, sign-in
records, signatures) is stored locally in the browser via LocalForage and never
leaves the device. The most relevant threat surface is therefore the client
build, its dependencies, and the device the app runs on.

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, use one of the following private channels:

1. **GitHub Private Vulnerability Reporting** (preferred) — open the
   [Security tab](https://github.com/johnnyrobot/labcheck/security/advisories/new)
   and submit a report. This keeps the details private until a fix is available.
2. **Email** — send details to **the project maintainer**.

Please include:

- A description of the issue and its potential impact
- Steps to reproduce (proof of concept if possible)
- Affected version(s) or commit
- Any suggested remediation

## What to expect

- We aim to acknowledge reports within **5 business days**.
- We will keep you informed as we investigate and work on a fix.
- Once a fix is released, we are happy to credit you in the release notes unless
  you prefer to remain anonymous.

Thank you for helping keep LabCheck and its users safe.
