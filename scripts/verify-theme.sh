#!/bin/sh
set -e
npm run build >/dev/null 2>&1
CSS=$(ls dist/assets/*.css | head -1)
echo "Checking $CSS"
fail=0
for sel in 'bg-primary' 'text-primary-foreground' 'bg-background' 'text-muted-foreground' 'bg-destructive'; do
  grep -q "\.$sel" "$CSS" || { echo "MISSING utility: .$sel"; fail=1; }
done
grep -q -- '--primary' "$CSS" || { echo "MISSING token: --primary"; fail=1; }
for kw in 'animate-in' 'fade-in' 'zoom-in'; do
  grep -q "$kw" "$CSS" || { echo "MISSING animation: $kw"; fail=1; }
done
[ "$fail" = "0" ] && echo "THEME OK" || { echo "THEME BROKEN"; exit 1; }
