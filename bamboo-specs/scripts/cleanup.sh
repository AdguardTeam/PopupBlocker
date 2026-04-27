#!/bin/bash

# Cleanup script that preserves specified artifacts
# Usage: ./cleanup.sh artifact1,artifact2,artifact3
#
# WARNING: this script wipes the entire workspace including .git.
# It must ONLY run in a Bamboo CI environment with a disposable agent workspace.

# 'set' should be added to the beginning of each script to ensure that it runs with the correct options.
# Please do not move it to some common file, like `setup-tests.sh`, because sourcing A script from B script
# cannot change the options of B script.
#  -e: Exit immediately if any command exits with a non-zero status (i.e., if a command fails).
#  -x: Print each command to the terminal as it is executed, which is useful for debugging.
set -ex

# Guard: refuse to run outside Bamboo to prevent accidental local execution
if [[ -z "${bamboo_buildNumber:-}" ]]; then
    echo "ERROR: this script must only run in a Bamboo CI environment" >&2
    exit 1
fi

# Redirect stderr (2) to stdout (1) to capture all output in a single log
exec 2>&1

echo "Size before cleanup:" && du -sh .
echo "Top 5 directories:" && du -sh */ 2>/dev/null | sort -hr | head -n 5

# Parse artifacts from command line argument
ARTIFACTS_ARG="${1:-}"
if [ -z "$ARTIFACTS_ARG" ]; then
    echo "No artifacts specified, cleaning entire workspace"
    ARTIFACTS=()
else
    # Split comma-separated list into array (handles paths with spaces safely)
    IFS=',' read -ra ARTIFACTS <<< "$ARTIFACTS_ARG"
    echo "Preserving artifacts: ${ARTIFACTS[*]}"
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Stash artifacts to temporary directory
for f in "${ARTIFACTS[@]}"; do
  [ -e "$f" ] || continue
  echo "Stashing artifact: $f"
  mkdir -p "$TMP/$(dirname "$f")"
  mv "$f" "$TMP/$f"
done

# Intentionally wipe the entire workspace (including .git).
# This runs only in Bamboo disposable agent workspaces — the goal is to
# guarantee a clean state after the build so no artifacts bleed into the
# next build on the same agent.
find . -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +

# Restore artifacts
for f in "${ARTIFACTS[@]}"; do
  [ -e "$TMP/$f" ] || continue
  echo "Restoring artifact: $f"
  mkdir -p "$(dirname "$f")"
  mv "$TMP/$f" "$f"
done

echo "Size after cleanup:" && du -sh .
echo "Top 5 directories:" && du -sh */ 2>/dev/null | sort -hr | head -n 5

echo "Cleanup completed successfully"
