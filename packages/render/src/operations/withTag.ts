import { Context, TaggingContext } from '../types';

/**
 * Runs `renderFn`, and when the document is tagged (`taggingCtx` is set),
 * marks what it draws as `tag`.
 *
 * 'Artifact' marks the content as an artifact: content that assistive
 * technology skips, such as decoration. Any other tag marks it as a structure
 * element of that type (e.g. 'P') under `taggingCtx.parent`.
 */
const withTag = (
  taggingCtx: TaggingContext | undefined,
  ctx: Context,
  tag: string,
  renderFn: () => void,
) => {
  if (!taggingCtx) {
    renderFn();
    return;
  }

  if (tag === 'Artifact') {
    ctx.markContent('Artifact');
    renderFn();
    ctx.endMarkedContent();
    return;
  }

  const content = ctx.markStructureContent(tag);
  renderFn();
  ctx.endMarkedContent();

  taggingCtx.parent.add(ctx.struct(tag, {}, [content]));
};

export default withTag;
