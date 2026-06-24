#!/bin/sh
if grep -rq "@mui/material" src; then
  echo "MUI still imported:"; grep -rln "@mui/material" src; exit 1
else
  echo "NO MUI IN SRC"
fi
