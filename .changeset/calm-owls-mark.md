---
'@react-pdf/render': minor
---

feat: mark non-text content as artifacts in tagged output

Backgrounds, borders, debug overlays, images, SVG and canvas are marked as artifacts, so tagged output has no untagged content. Text tags itself; links, notes and form fields only add annotations, so they draw nothing to mark.
