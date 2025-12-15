#!/bin/sh
set -eu

if ! command -v mc >/dev/null 2>&1; then
  echo "Installing mc..."
  apk add --no-cache curl ca-certificates
  curl -fsSL https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc
  chmod +x /usr/local/bin/mc
fi

echo "Configuring mc..."
mc alias set local http://minio:9000 minioaccess miniosecret
mc mb --ignore-existing local/files
mc anonymous set download local/files || true

echo "MinIO bucket files is public"
