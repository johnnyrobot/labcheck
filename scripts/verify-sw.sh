#!/bin/sh
set -e
npm run build >/dev/null 2>&1
if grep -q 'SKIP_WAITING' dist/sw.js; then
  echo "SW PROMPT OK"
else
  echo "SW has no SKIP_WAITING handler (autoUpdate/dead flow)"; exit 1
fi
