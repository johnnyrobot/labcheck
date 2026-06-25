#!/bin/sh
set -e
npm run build >/dev/null 2>&1
M=dist/manifest.webmanifest
# id must contain at least one non-empty character; purpose must include
# "maskable" as a whole space-delimited token (so "unmaskable" is rejected).
grep -Eq '"id"[[:space:]]*:[[:space:]]*"[^"]' "$M" \
  && grep -Eq '"purpose"[[:space:]]*:[[:space:]]*"([^"]* )?maskable( [^"]*)?"' "$M" \
  && echo "MANIFEST OK" \
  || { echo "manifest missing valid id and/or maskable purpose"; exit 1; }
