export type PDFVersion = '1.3' | '1.4' | '1.5' | '1.6' | '1.7' | '1.7ext3';

export type PDFConformance =
  | 'PDF/A-1'
  | 'PDF/A-1b'
  | 'PDF/A-2'
  | 'PDF/A-2b'
  | 'PDF/A-3'
  | 'PDF/A-3b';

export type TextTag =
  | 'P'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'
  | 'Lbl'
  | 'LBody'
  | 'TOCI'
  | 'Caption'
  | 'BlockQuote'
  | 'Reference'
  | 'Span'
  | 'Artifact';
