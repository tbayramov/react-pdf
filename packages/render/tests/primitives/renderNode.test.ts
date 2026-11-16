import { describe, expect, test, vi } from 'vitest';

import * as P from '@react-pdf/primitives';
import { Box, SafeNode } from '@react-pdf/layout';

import createCTX from '../ctx';
import renderNode from '../../src/primitives/renderNode';

const box = { top: 20, left: 40, width: 140, height: 200 } as Box;

const createOptions = (tagged = true) => ({
  imageCache: new Map(),
  fieldSets: [],
  taggingCtx: tagged ? { parent: { add: vi.fn() } as any } : undefined,
});

describe('primitive renderNode tagging', () => {
  test('should not mark content when untagged', () => {
    const ctx = createCTX();
    const node: SafeNode = {
      type: P.View,
      props: {},
      style: { backgroundColor: 'red' },
      box,
    };

    renderNode(ctx, node, createOptions(false));

    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.markContent).not.toHaveBeenCalled();
    expect(ctx.markStructureContent).not.toHaveBeenCalled();
  });

  test('should mark a background as an artifact', () => {
    const ctx = createCTX();
    const node: SafeNode = {
      type: P.View,
      props: {},
      style: { backgroundColor: 'red' },
      box,
    };

    renderNode(ctx, node, createOptions());

    expect(ctx.markContent.mock.calls).toEqual([['Artifact']]);
  });

  test('should mark borders as an artifact', () => {
    const ctx = createCTX();
    const node: SafeNode = {
      type: P.View,
      props: {},
      style: {},
      box: { ...box, borderLeftWidth: 1 },
    };

    renderNode(ctx, node, createOptions());

    expect(ctx.markContent.mock.calls).toEqual([['Artifact']]);
  });

  test('should mark debug overlays as an artifact', () => {
    const ctx = createCTX();
    const node: SafeNode = {
      type: P.View,
      props: { debug: true },
      style: {},
      box,
    };

    renderNode(ctx, node, createOptions());

    expect(ctx.markContent.mock.calls).toEqual([['Artifact']]);
  });

  test('should not mark anything for a node that draws nothing', () => {
    const ctx = createCTX();
    const node: SafeNode = { type: P.View, props: {}, style: {}, box };

    renderNode(ctx, node, createOptions());

    expect(ctx.markContent).not.toHaveBeenCalled();
  });

  test('should mark what a non-Text primitive draws as an artifact', () => {
    const ctx = createCTX();
    const paint = vi.fn();
    const node = {
      type: P.Canvas,
      props: { paint },
      style: {},
      box,
    } as unknown as SafeNode;

    renderNode(ctx, node, createOptions());

    expect(paint).toHaveBeenCalled();
    expect(ctx.markContent.mock.calls).toEqual([['Artifact']]);
  });

  test('should not mark annotation-only primitives', () => {
    const ctx = createCTX();
    const node = {
      type: P.Link,
      props: { src: 'https://react-pdf.org' },
      style: {},
      box,
      children: [],
    } as unknown as SafeNode;

    renderNode(ctx, node, createOptions());

    expect(ctx.link).toHaveBeenCalled();
    expect(ctx.markContent).not.toHaveBeenCalled();
  });

  test('should let Text tag its own content', () => {
    const ctx = createCTX();
    const node = {
      type: P.Text,
      props: {},
      style: {},
      box,
      lines: [],
    } as unknown as SafeNode;

    renderNode(ctx, node, createOptions());

    expect(ctx.markContent).not.toHaveBeenCalled();
    expect(ctx.markStructureContent.mock.calls).toEqual([['P']]);
  });
});
