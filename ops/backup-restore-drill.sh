#!/usr/bin/env bash
set -euo pipefail

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_DIR="${1:-/tmp/gramfund-backup-drill}"
mkdir -p "$OUT_DIR"

MANIFEST="$OUT_DIR/backup-manifest-$STAMP.txt"
BACKUP_FILE="$OUT_DIR/backup-$STAMP.sql"

if [[ -n "${DATABASE_URL:-}" ]] && command -v pg_dump >/dev/null 2>&1; then
  pg_dump "$DATABASE_URL" --schema-only --no-owner --no-privileges > "$BACKUP_FILE"
  STATUS="executed"
else
  echo "-- simulated backup (DATABASE_URL or pg_dump unavailable)" > "$BACKUP_FILE"
  STATUS="simulated"
fi

cat > "$MANIFEST" <<EOF2
backup_drill_timestamp=$STAMP
repository=GramFund
status=$STATUS
backup_file=$BACKUP_FILE
EOF2

echo "Created backup drill manifest: $MANIFEST"
