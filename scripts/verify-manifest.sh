#!/bin/sh
set -e
npm run build >/dev/null 2>&1
M=dist/manifest.webmanifest
grep -q '"maskable"' "$M" && grep -q '"id"' "$M" && echo "MANIFEST OK" || { echo "manifest missing id and/or maskable icon"; exit 1; }
