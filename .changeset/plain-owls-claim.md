---
'@react-pdf/layout': minor
'@react-pdf/types': minor
'@react-pdf/renderer': minor
---

feat: add `PDF/UA-1` conformance

`conformance="PDF/UA-1"` writes the PDF/UA-1 identification metadata (pdfkit's `PDF/UA` subset) and defaults to PDF 1.7. It doesn't change the content: meeting PDF/UA-1 is up to the document, e.g. by using `experimentalTagged`.
