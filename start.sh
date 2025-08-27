#!/bin/sh

echo "--- STARTUP SCRIPT ---"
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo "---"

echo "--- FILE SYSTEM CHECK ---"
echo "Checking for built files in /usr/share/nginx/html..."
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    echo "ERROR: index.html not found!"
    echo "Contents of /usr/share/nginx/html:"
    ls -la /usr/share/nginx/html/
    exit 1
else
    echo "SUCCESS: index.html found."
fi
echo "---"

echo "--- NGINX CONFIG CHECK ---"
echo "Testing Nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
    echo "ERROR: Nginx configuration test failed."
    exit 1
else
    echo "SUCCESS: Nginx configuration is valid."
fi
echo "---"

echo "--- STARTING NGINX ---"
exec nginx -g "daemon off;"
