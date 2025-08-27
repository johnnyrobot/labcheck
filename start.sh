#!/bin/sh

# Coolify-compatible startup script for LabCheck PWA
# This script helps debug startup issues and ensures proper nginx configuration

echo "🚀 Starting LabCheck PWA..."
echo "📅 $(date)"
echo "🐳 Container: $(hostname)"

# Check if built files exist
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    echo "❌ ERROR: Built files not found in /usr/share/nginx/html/"
    echo "📁 Contents of /usr/share/nginx/html/:"
    ls -la /usr/share/nginx/html/
    exit 1
fi

echo "✅ Built files found"

# Check nginx configuration
echo "🔧 Generating nginx configuration..."
envsubst '${SERVICE_FQDN_LABCHECK_PWA}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "🔧 Testing nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ ERROR: nginx configuration test failed"
    exit 1
fi

echo "✅ nginx configuration is valid"

# Check file permissions
echo "🔐 Checking file permissions..."
ls -la /usr/share/nginx/html/

# Start nginx in foreground
echo "🌐 Starting nginx..."
exec nginx -g "daemon off;"
