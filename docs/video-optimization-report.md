# Video Optimization Report (Academy Carousel)

Date: 2026-05-02
Input folder: `input/`
Output folder: `public/videos/academy/`

## Encoding profile used
- Container: MP4 (`+faststart`)
- Video codec: H.264 (`libx264`, `preset=slow`, `crf=21`, `maxrate=3.8M`, `bufsize=7.6M`)
- Resolution: normalized to vertical 1080x1920
- Frame rate: source-preserved (25 fps)
- Pixel format: `yuv420p`
- Audio codec: AAC LC, 48 kHz, stereo, 128 kbps
- Poster: WebP 540x960, quality 88

## Per-file diagnostics and optimization result
| File | Duration | Original size | Optimized size | Reduction | Original A/V | Optimized A/V |
|---|---:|---:|---:|---:|---|---|
| C1252.MP4 | 62.88s | 512.15 MB | 27.89 MB | 94.55% | H.264 3840x2160 @25fps + PCM 1536kbps | H.264 ~3.72Mbps + AAC 129kbps |
| C1253.MP4 | 70.56s | 576.15 MB | 33.32 MB | 94.22% | H.264 3840x2160 @25fps + PCM 1536kbps | H.264 ~3.96Mbps + AAC 129kbps |
| C1446.MP4 | 66.24s | 512.15 MB | 29.31 MB | 94.28% | H.264 3840x2160 @25fps + PCM 1536kbps | H.264 ~3.71Mbps + AAC 130kbps |
| C1447.MP4 | 52.80s | 448.15 MB | 24.43 MB | 94.55% | H.264 3840x2160 @25fps + PCM 1536kbps | H.264 ~3.88Mbps + AAC 129kbps |
| C1448.MP4 | 37.92s | 320.15 MB | 16.86 MB | 94.73% | H.264 3840x2160 @25fps + PCM 1536kbps | H.264 ~3.73Mbps + AAC 130kbps |

## Individual plan / recommendations
- C1252: keep current encode; if needed for very slow networks, generate alternate `crf=23` fallback.
- C1253: longest clip; candidate for optional trim or secondary low-bitrate rendition.
- C1446: balanced motion/detail; current target is suitable for premium carousel display.
- C1447: high detail variation; keep current profile to avoid visible macroblocking.
- C1448: shortest clip; current output already highly efficient.

## Carousel integration policy
- Only active slide plays video.
- Inactive slides render poster image only.
- Background ambiance uses poster only (not playing another hidden video).
- Active video preload set to `metadata` for fast start without overfetch.
