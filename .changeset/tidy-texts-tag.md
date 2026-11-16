---
'@react-pdf/render': minor
---

feat: add a `tagged` parameter to `render` and tag text in tagged output

`render(ctx, doc, tagged)` defaults to `false`. When `true`, each `Text` becomes a `P` structure element under a `Document` root.
