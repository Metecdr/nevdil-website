#!/usr/bin/env bash
#
# Nev-Dil — ön kayıt verisi günlük yedekleme.
# data/registrations.ndjson dosyasını tarihli kopya olarak data/backups/ altına alır.
# Son 30 günü tutar, eskileri siler.
#
# VPS kurulumu (crontab -e):
#   0 3 * * * /var/www/nevdil-website/scripts/backup-registrations.sh >> /var/log/nevdil-backup.log 2>&1
#
set -euo pipefail

# Script'in bulunduğu yere göre proje kökünü bul
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Aynı cron kaydı galeri fotoğraflarını da yedekler. Mevcut kayıt yedekleri korunur.
GALLERY_STATUS=0
if [ -f "$ROOT_DIR/.env.local" ]; then
  node --env-file="$ROOT_DIR/.env.local" "$ROOT_DIR/scripts/backup-gallery.mjs" || GALLERY_STATUS=1
else
  node "$ROOT_DIR/scripts/backup-gallery.mjs" || GALLERY_STATUS=1
fi

SRC="$ROOT_DIR/data/registrations.ndjson"
BACKUP_DIR="$ROOT_DIR/data/backups"
RETENTION_DAYS=30

if [ ! -f "$SRC" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') — kaynak yok, atlanıyor: $SRC"
  exit "$GALLERY_STATUS"
fi

mkdir -p "$BACKUP_DIR"

STAMP="$(date '+%Y%m%d')"
DEST="$BACKUP_DIR/registrations-$STAMP.ndjson"

cp "$SRC" "$DEST"
echo "$(date '+%Y-%m-%d %H:%M:%S') — yedek alindi: $DEST ($(wc -l < "$DEST") kayit)"

# 30 günden eski yedekleri temizle
find "$BACKUP_DIR" -name 'registrations-*.ndjson' -type f -mtime +$RETENTION_DAYS -delete
echo "$(date '+%Y-%m-%d %H:%M:%S') — $RETENTION_DAYS gunden eski yedekler temizlendi"
exit "$GALLERY_STATUS"
