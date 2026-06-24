#!/bin/sh
set -e
npm run build >/dev/null 2>&1
M=dist/manifest.webmanifest
grep -Eq '"id"[[:space:]]*:[[:space:]]*"' "$M" \
  && grep -Eq '"purpose"[[:space:]]*:[[:space:]]*"[^"]*maskable' "$M" \
  && echo "MANIFEST OK" \
  || { echo "manifest missing valid id and/or maskable purpose"; exit 1; }
