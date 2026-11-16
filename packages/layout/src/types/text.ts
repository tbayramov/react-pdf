import * as P from '@react-pdf/primitives';
import { SafeStyle, StyleProp } from '@react-pdf/stylesheet';
import { HyphenationCallback } from '@react-pdf/font';
import { YogaNode } from 'yoga-layout/load';
import { ExclusionShape, Paragraph } from '@react-pdf/textkit';

import { Box, NodeProps, Origin, RenderProp } from './base';
import { SafeTextInstanceNode, TextInstanceNode } from './text-instance';
import { ImageNode, SafeImageNode } from './image';
import { SafeTspanNode, TspanNode } from './tspan';

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

interface TextProps extends NodeProps {
  /**
   * Enable/disable page wrapping for element.
   * @see https://react-pdf.org/components#page-wrapping
   */
  wrap?: boolean;
  render?: RenderProp;
  /**
   * Override the default hyphenation-callback
   * @see https://react-pdf.org/fonts#registerhyphenationcallback
   */
  hyphenationCallback?: HyphenationCallback;
  /**
   * Override the default hyphenation penalty
   * Defaults to 100 for justified text and 600 otherwise.
   * @see https://react-pdf.org/fonts#hyphenationpenalty
   */
  hyphenationPenalty?: number;
  /**
   * Specifies the minimum number of lines in a text element that must be shown at the bottom of a page or its container.
   * @see https://react-pdf.org/advanced#orphan-&-widow-protection
   */
  orphans?: number;
  /**
   * Specifies the minimum number of lines in a text element that must be shown at the top of a page or its container..
   * @see https://react-pdf.org/advanced#orphan-&-widow-protection
   */
  widows?: number;
  /**
   * Structure type of the text in Tagged PDF output. Defaults to 'P'.
   * 'Artifact' leaves it out of the structure tree, e.g. for running headers.
   * Only applies to a top-level Text: nested Text is part of its parent.
   */
  tag?: TextTag;
  // Svg props
  x?: number;
  y?: number;
}

export type TextNode = {
  type: typeof P.Text;
  props: TextProps;
  style?: StyleProp;
  box?: Box;
  origin?: Origin;
  yogaNode?: YogaNode;
  lines?: Paragraph;
  alignOffset?: number; // TODO: Remove this
  children?: (TextNode | TextInstanceNode | ImageNode | TspanNode)[];
};

export type SafeTextNode = Omit<TextNode, 'style' | 'children'> & {
  style: SafeStyle;
  wasSplit: boolean;
  children?: (
    | SafeTextNode
    | SafeTextInstanceNode
    | SafeImageNode
    | SafeTspanNode
  )[];
  /** Exclusion geometry attached by resolveFloats for text wrapping */
  exclusions?: ExclusionShape[];
};
