#!/usr/bin/env bash
set -euo pipefail

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_DIR="${1:-/tmp/gramfund-backup-drill}"
mkdir -p "$OUT_DIR"

MANIFEST="$OUT_DIR/backup-manifest-$STAMP.txt"
cat > "$MANIFEST" <<EOF
backup_drill_timestamp=$STAMP
repository=GramFund
status=simulated
EOF

echo "Created backup drill manifest: $MANIFEST"
