---
'@react-pdf/layout': minor
'@react-pdf/renderer': minor
---

feat: add `experimentalTagged` Document prop

Opts the document into Tagged PDF output: pdfkit writes `/MarkInfo` and a structure tree, each `Text` is tagged as `P`, and everything else is marked as an artifact. Work in progress, so the prop is marked experimental.
