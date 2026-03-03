#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Deploying CVG Website..."

# Load env for build args
set -a; source .env; set +a

# Pull latest code
git pull origin master

# Build new image (pass NEXT_PUBLIC_ vars as build args so they're baked in)
docker compose build \
  --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}"

# Recreate container with new image (minimal downtime)
docker compose up -d --force-recreate cvg_website

# Wait for container to be healthy
echo "⏳ Waiting for app to be healthy..."
for i in {1..30}; do
  STATUS=$(docker inspect cvg_website --format='{{.State.Health.Status}}' 2>/dev/null || echo "starting")
  if [ "$STATUS" = "healthy" ]; then
    echo "✅ App is healthy"
    break
  fi
  echo "  ($i/30) status: $STATUS"
  sleep 3
done

echo "✅ Deployment complete!"
