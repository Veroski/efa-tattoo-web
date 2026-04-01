#!/usr/bin/env python3

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

MAX_DIMENSION = 2200
QUALITY = "84"
MIN_BYTES_SAVED = 32 * 1024


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def optimize_one(path: Path, max_dimension: int, quality: str) -> tuple[bool, int]:
    original_size = path.stat().st_size
    temp_path = path.with_suffix(".tmp.webp")

    run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(path),
            "-vf",
            (
                "scale="
                f"'min(iw,{max_dimension})':'min(ih,{max_dimension})'"
                ":force_original_aspect_ratio=decrease:flags=lanczos"
            ),
            "-frames:v",
            "1",
            "-c:v",
            "libwebp",
            "-quality",
            quality,
            "-preset",
            "photo",
            str(temp_path),
        ]
    )

    optimized_size = temp_path.stat().st_size
    bytes_saved = original_size - optimized_size

    if bytes_saved >= MIN_BYTES_SAVED:
        temp_path.replace(path)
        return True, bytes_saved

    temp_path.unlink(missing_ok=True)
    return False, max(bytes_saved, 0)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Optimiza los WebP de la galería in-place sin crear carpetas derivadas."
    )
    parser.add_argument(
        "root",
        nargs="?",
        default=Path(__file__).resolve().parent / "img",
        type=Path,
        help="Carpeta raíz con imágenes WebP",
    )
    parser.add_argument(
        "--max-dimension",
        type=int,
        default=MAX_DIMENSION,
        help="Límite para ancho y alto máximos",
    )
    parser.add_argument(
        "--quality",
        default=QUALITY,
        help="Calidad WebP para la recomprensión",
    )
    args = parser.parse_args()

    root = args.root
    if not root.is_dir():
        print(f"No existe la carpeta fuente: {root}", file=sys.stderr)
        return 1

    images = sorted(root.rglob("*.webp"))
    optimized_count = 0
    total_saved = 0

    for path in images:
        changed, bytes_saved = optimize_one(path, args.max_dimension, args.quality)
        if changed:
            optimized_count += 1
            total_saved += bytes_saved

    saved_mb = total_saved / (1024 * 1024)
    print(
        f"Optimización completada. Archivos actualizados: {optimized_count}/{len(images)}. "
        f"Espacio ahorrado: {saved_mb:.1f} MB"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
