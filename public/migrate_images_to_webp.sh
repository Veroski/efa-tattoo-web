#!/usr/bin/env python3

from __future__ import annotations

import math
import re
import subprocess
import sys
from pathlib import Path

DIMENSIONS_RE = re.compile(r"(\d+)x(\d+)")
GROUP_LINE_RE = re.compile(r"Stream group #0:0")
MAPPING_RE = re.compile(r"Stream #0:(\d+) -> #0:(\d+)")
TILE_LINE_RE = re.compile(r"Stream #0:0: Video: wrapped_avframe")


def file_mime(path: Path) -> str:
    result = subprocess.run(
        ["file", "-b", "--mime-type", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def run_command(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=True, capture_output=True, text=True)


def heic_tile_grid_probe(path: Path) -> tuple[int, int, int, int, list[int]] | None:
    probe = subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-i",
            str(path),
            "-map",
            "0:g:0",
            "-frames:v",
            "1",
            "-f",
            "null",
            "-",
        ],
        check=False,
        capture_output=True,
        text=True,
    )
    output = probe.stderr or probe.stdout

    group_line = next((line for line in output.splitlines() if GROUP_LINE_RE.search(line)), None)
    tile_line = next((line for line in output.splitlines() if TILE_LINE_RE.search(line)), None)
    if not group_line or not tile_line:
        return None

    group_dims = DIMENSIONS_RE.findall(group_line)
    tile_dims = DIMENSIONS_RE.findall(tile_line)
    if not group_dims or not tile_dims:
        return None

    width, height = map(int, group_dims[-1])
    tile_width, tile_height = map(int, tile_dims[-1])
    streams = sorted({int(src) for src, _ in MAPPING_RE.findall(output)})

    if not streams:
        return None

    return width, height, tile_width, tile_height, streams


def convert_heic_tile_grid(path: Path, tmp: Path) -> bool:
    probe = heic_tile_grid_probe(path)
    if not probe:
        return False

    width, height, tile_width, tile_height, streams = probe
    cols = math.ceil(width / tile_width)
    rows = math.ceil(height / tile_height)
    expected_tiles = cols * rows

    if len(streams) < expected_tiles:
        raise RuntimeError(
            f"Tile grid incompleto para {path.name}: {len(streams)} tiles, se esperaban {expected_tiles}"
        )

    labels = "".join(f"[0:{idx}]" for idx in streams[:expected_tiles])
    layout = "|".join(
        f"{col * tile_width}_{row * tile_height}"
        for row in range(rows)
        for col in range(cols)
    )

    cmd = [
        "ffmpeg",
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        str(path),
        "-filter_complex",
        f"{labels}xstack=inputs={expected_tiles}:layout={layout},format=yuv444p,crop={width}:{height}:0:0[out]",
        "-map",
        "[out]",
        "-frames:v",
        "1",
        "-c:v",
        "libwebp",
        "-quality",
        "92",
        "-preset",
        "photo",
        str(tmp),
    ]
    run_command(cmd)
    return True


def convert_one(path: Path) -> None:
    ext = path.suffix.lower()
    out = path.with_suffix(".webp")
    tmp = path.with_suffix(".tmp.webp")

    if out.exists() and file_mime(out) == "image/webp":
        if path.exists():
            path.unlink()
        tmp.unlink(missing_ok=True)
        return

    if ext == ".png":
        cmd = [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(path),
            "-c:v",
            "libwebp",
            "-lossless",
            "1",
            "-quality",
            "100",
            "-preset",
            "picture",
            str(tmp),
        ]
    elif ext in {".jpg", ".jpeg", ".heic"}:
        if ext == ".heic" and convert_heic_tile_grid(path, tmp):
            cmd = None
        else:
            cmd = [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                str(path),
                "-frames:v",
                "1",
                "-c:v",
                "libwebp",
                "-quality",
                "92",
                "-preset",
                "photo",
                str(tmp),
            ]
    else:
        return

    if cmd:
        run_command(cmd)

    if tmp.exists() and file_mime(tmp) == "image/webp":
        tmp.replace(out)
        if path.exists():
            path.unlink()
        return

    if out.exists() and file_mime(out) == "image/webp":
        if path.exists():
            path.unlink()
        tmp.unlink(missing_ok=True)
        return

    if tmp.exists():
        tmp.unlink(missing_ok=True)
    raise RuntimeError(f"Conversión inválida para {path}")


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent / "img"
    if not root.is_dir():
        print(f"No existe la carpeta destino: {root}", file=sys.stderr)
        return 1

    candidates = sorted(
        p
        for p in root.rglob("*")
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".heic"}
    )

    failures: list[str] = []

    for path in candidates:
        try:
            convert_one(path)
        except Exception as exc:
            failures.append(f"{path}: {exc}")

    if failures:
        print("Fallos durante la migración:", file=sys.stderr)
        for item in failures:
            print(item, file=sys.stderr)
        return 1

    print(f"Migración a WebP completada en: {root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
