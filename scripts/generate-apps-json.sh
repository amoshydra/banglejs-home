#!/usr/bin/env bash
# Generate the BangleApps apps.json catalogue for local development.
#
# Upstream ships apps.json as a plain-text placeholder; the real file is
# built from apps/*/metadata.json by bin/create_apps_json.sh (CI runs this
# at deploy time). Without it, `yarn dev` has no catalogue to list.
#
# Idempotent: skips if apps.json already looks generated. Marks the file
# skip-worktree so it doesn't show up as a submodule modification.
set -euo pipefail

cd "$(dirname "$0")/../public/externals/espruino/BangleApps"

if [ ! -f apps.json ]; then
  echo "BangleApps submodule not checked out; skipping apps.json generation"
  exit 0
fi

first_char=$(head -c 1 apps.json || true)
if [ "$first_char" = "[" ]; then
  echo "apps.json already generated; nothing to do"
  exit 0
fi

echo "Generating apps.json from apps/*/metadata.json..."
bash bin/create_apps_json.sh apps.json
git update-index --skip-worktree apps.json 2>/dev/null || true
echo "Done. apps.json is ready for local dev."
