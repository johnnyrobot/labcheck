#!/bin/sh
set -e
npm run build >/dev/null 2>&1
CSS_FILES=$(find dist/assets -maxdepth 1 -name '*.css' -type f)
[ -n "$CSS_FILES" ] || { echo "NO CSS BUNDLE FOUND"; exit 1; }
echo "Checking CSS:"; echo "$CSS_FILES"
fail=0
for sel in 'bg-primary' 'text-primary-foreground' 'bg-background' 'text-muted-foreground' 'bg-destructive'; do
  echo "$CSS_FILES" | xargs grep -q "\.$sel" || { echo "MISSING utility: .$sel"; fail=1; }
done
echo "$CSS_FILES" | xargs grep -q -- '--primary' || { echo "MISSING token: --primary"; fail=1; }
for kw in 'animate-in' 'fade-in' 'zoom-in'; do
  echo "$CSS_FILES" | xargs grep -q "$kw" || { echo "MISSING animation: $kw"; fail=1; }
done
[ "$fail" = "0" ] && echo "THEME OK" || { echo "THEME BROKEN"; exit 1; }
