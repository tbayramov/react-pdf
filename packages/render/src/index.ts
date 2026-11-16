import type { SafeDocumentNode } from '@react-pdf/layout';

import renderNode from './primitives/renderNode';
import addBookmarks from './operations/addBookmarks';
import { Context, RenderOptions } from './types';

const render = (
  ctx: Context,
  doc: SafeDocumentNode,
  tagged: boolean = false,
) => {
  const pages = doc.children || [];
  const options: RenderOptions = { imageCache: new Map(), fieldSets: [] };

  // pdfkit ends the Document element, like every top-level structure
  // element, in ctx.end().
  if (tagged) {
    const parent = ctx.struct('Document');
    ctx.addStructure(parent);
    options.taggingCtx = { parent };
  }

  pages.forEach((page) => renderNode(ctx, page, options));

  addBookmarks(ctx, doc);

  ctx.end();

  return ctx;
};

export default render;
