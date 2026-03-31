#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="${1:-$SCRIPT_DIR/Fotos web EFA}"
TARGET_NAME="${2:-img}"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "No existe la carpeta origen: $SOURCE_DIR" >&2
  exit 1
fi

ROOT_DIR="$(dirname "$SOURCE_DIR")"
SOURCE_BASENAME="$(basename "$SOURCE_DIR")"
TARGET_DIR="$ROOT_DIR/$TARGET_NAME"

if [[ "$SOURCE_BASENAME" != "$TARGET_NAME" ]]; then
  if [[ -e "$TARGET_DIR" ]]; then
    echo "La carpeta destino ya existe: $TARGET_DIR" >&2
    exit 1
  fi

  mkdir -p "$TARGET_DIR"

  while IFS= read -r -d '' child_path; do
    mv "$child_path" "$TARGET_DIR/"
  done < <(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -print0 | sort -z)

  rmdir "$SOURCE_DIR"
else
  TARGET_DIR="$SOURCE_DIR"
fi

slugify() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/_/g; s/^_+//; s/_+$//; s/_+/_/g'
}

extension_for_mime() {
  case "$1" in
    image/jpeg) printf 'jpg' ;;
    image/png) printf 'png' ;;
    image/heic) printf 'heic' ;;
    *)
      echo "Tipo MIME no soportado: $1" >&2
      return 1
      ;;
  esac
}

rename_directory_files() {
  local dir="$1"
  local base slug manifest count tmp_file ext target

  base="$(basename "$dir")"
  slug="$(slugify "$base")"

  if [[ -z "$slug" ]]; then
    slug="$TARGET_NAME"
  fi

  manifest="$(mktemp)"

  while IFS= read -r -d '' file_path; do
    local mime tmp_name

    mime="$(file -b --mime-type "$file_path")"
    ext="$(extension_for_mime "$mime")"
    tmp_name="$dir/.rename_tmp_${RANDOM}_$(basename "$file_path")"

    mv "$file_path" "$tmp_name"
    printf '%s|%s\n' "$tmp_name" "$ext" >> "$manifest"
  done < <(find "$dir" -maxdepth 1 -type f -print0 | sort -z)

  count=1
  while IFS='|' read -r tmp_file ext; do
    [[ -n "$tmp_file" ]] || continue

    target="$dir/${slug}_${count}.${ext}"
    mv "$tmp_file" "$target"
    count=$((count + 1))
  done < "$manifest"

  rm -f "$manifest"
}

while IFS= read -r -d '' current_dir; do
  rename_directory_files "$current_dir"
done < <(find "$TARGET_DIR" -type d -print0 | sort -z)

echo "Renombrado completado en: $TARGET_DIR"
