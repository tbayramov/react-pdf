---
'@react-pdf/render': minor
'@react-pdf/layout': minor
'@react-pdf/types': minor
'@react-pdf/renderer': minor
---

feat: add `tag` prop to `Text`

Sets the structure type of a `Text` in `experimentalTagged` documents: `P` (default), `H1`–`H6`, `Lbl`, `LBody`, `TOCI`, `Caption`, `BlockQuote`, `Reference`, `Span`, or `Artifact` to leave it out of the structure tree. Only applies to a top-level `Text`; nested `Text` is part of its parent.
