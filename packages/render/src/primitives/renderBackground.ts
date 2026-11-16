import { isNil } from '@react-pdf/fns';

import clipNode from '../operations/clipNode';
import withTag from '../operations/withTag';
import parseColor from '../utils/parseColor';
import { Context, RenderOptions } from '../types';
import { SafeNode } from '@react-pdf/layout';

const drawBackground = (ctx: Context, node: SafeNode) => {
  if (!node.box) return;

  const { top, left, width, height } = node.box;
  const color = parseColor(node.style.backgroundColor);
  const nodeOpacity = isNil(node.style?.opacity) ? 1 : node.style.opacity;
  const opacity = Math.min(color.opacity, nodeOpacity);

  ctx.save();
  clipNode(ctx, node);
  ctx
    .fillOpacity(opacity)
    .fillColor(color.value)
    .rect(left, top, width, height)
    .fill();
  ctx.restore();
};

const renderBackground = (
  ctx: Context,
  node: SafeNode,
  options: RenderOptions,
) => {
  const hasBackground = !!node.box && !!node.style?.backgroundColor;

  if (hasBackground) {
    withTag(options.taggingCtx, ctx, 'Artifact', () =>
      drawBackground(ctx, node),
    );
  }
};

export default renderBackground;
