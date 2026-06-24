#!/bin/sh
if grep -rEq "@mui/" src; then
  echo "MUI still imported:"; grep -rEln "@mui/" src; exit 1
else
  echo "NO MUI IN SRC"
fi
