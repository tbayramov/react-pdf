import { describe, expect, test, vi } from 'vitest';

import createCTX from '../ctx';
import withTag from '../../src/operations/withTag';

const createTaggingCtx = () => ({ parent: { add: vi.fn() } as any });

describe('operations withTag', () => {
  test('should only render when the document is untagged', () => {
    const ctx = createCTX();
    const renderFn = vi.fn();

    withTag(undefined, ctx, 'P', renderFn);

    expect(renderFn).toHaveBeenCalledOnce();
    expect(ctx.markContent).not.toHaveBeenCalled();
    expect(ctx.markStructureContent).not.toHaveBeenCalled();
  });

  test('should wrap what renderFn draws in artifact marked content', () => {
    const ctx = createCTX();
    const taggingCtx = createTaggingCtx();
    const renderFn = vi.fn();

    withTag(taggingCtx, ctx, 'Artifact', renderFn);

    expect(ctx.markContent.mock.calls).toEqual([['Artifact']]);
    expect(renderFn).toHaveBeenCalledOnce();
    expect(ctx.markContent.mock.invocationCallOrder[0]).toBeLessThan(
      renderFn.mock.invocationCallOrder[0],
    );
    expect(renderFn.mock.invocationCallOrder[0]).toBeLessThan(
      ctx.endMarkedContent.mock.invocationCallOrder[0],
    );
    expect(ctx.markStructureContent).not.toHaveBeenCalled();
    expect(taggingCtx.parent.add).not.toHaveBeenCalled();
  });

  test('should add a structure element of the tag type under the parent', () => {
    const ctx = createCTX();
    const taggingCtx = createTaggingCtx();
    const renderFn = vi.fn();

    withTag(taggingCtx, ctx, 'H2', renderFn);

    expect(ctx.markStructureContent.mock.calls).toEqual([['H2']]);
    expect(renderFn).toHaveBeenCalledOnce();
    expect(ctx.endMarkedContent).toHaveBeenCalledOnce();
    expect(ctx.struct.mock.calls[0][0]).toBe('H2');
    expect(taggingCtx.parent.add).toHaveBeenCalledOnce();
    expect(ctx.markContent).not.toHaveBeenCalled();
  });
});
