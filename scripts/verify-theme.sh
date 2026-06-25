#!/bin/sh
set -e
npm run build >/dev/null 2>&1
CSS_FILES=$(find dist/assets -maxdepth 1 -name '*.css' -type f)
[ -n "$CSS_FILES" ] || { echo "NO CSS BUNDLE FOUND"; exit 1; }
echo "Checking CSS:"; echo "$CSS_FILES"
fail=0
# Grep all CSS bundles in a single invocation per pattern (no xargs batching,
# which could split the file list and yield inconsistent exit statuses).
for sel in 'bg-primary' 'text-primary-foreground' 'bg-background' 'text-muted-foreground' 'bg-destructive'; do
  grep -qs -- "\.$sel" dist/assets/*.css || { echo "MISSING utility: .$sel"; fail=1; }
done
grep -qs -- '--primary' dist/assets/*.css || { echo "MISSING token: --primary"; fail=1; }
for kw in 'animate-in' 'fade-in' 'zoom-in'; do
  grep -qs -- "$kw" dist/assets/*.css || { echo "MISSING animation: $kw"; fail=1; }
done
[ "$fail" = "0" ] && echo "THEME OK" || { echo "THEME BROKEN"; exit 1; }
