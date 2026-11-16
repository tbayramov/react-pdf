import { inflateSync } from 'node:zlib';
import { describe, expect, test } from 'vitest';

import { Document, Page, Text, View, renderToBuffer } from '../src/node';

const render = (element) =>
  renderToBuffer(element).then((buffer) => buffer.toString('latin1'));

// Marked content in page order, e.g. ['Artifact', 'P#0', 'P#1'].
const markedContent = (pdf) => {
  const streams = [...pdf.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)]
    .map(([, data]) => {
      try {
        return inflateSync(Buffer.from(data, 'latin1')).toString('latin1');
      } catch {
        return '';
      }
    })
    .join('\n');

  return [
    ...streams.matchAll(/\/(\w+) <<\s*\/MCID (\d+)\s*>> BDC|\/(\w+) BMC/g),
  ].map(([, tag, mcid, bmcTag]) => (tag ? `${tag}#${mcid}` : bmcTag));
};

const structTypes = (pdf) =>
  [...pdf.matchAll(/\/S \/(\w+)/g)].map(([, type]) => type);

describe('experimentalTagged', () => {
  test('should not tag documents by default', async () => {
    const pdf = await render(
      <Document>
        <Page style={{ backgroundColor: 'red' }}>
          <Text>Hello</Text>
        </Page>
      </Document>,
    );

    expect(pdf).not.toContain('/MarkInfo');
    expect(pdf).not.toContain('/StructTreeRoot');
    expect(markedContent(pdf)).toEqual([]);
  });

  test('should mark the document as tagged', async () => {
    const pdf = await render(
      <Document experimentalTagged>
        <Page>
          <Text>Hello</Text>
        </Page>
      </Document>,
    );

    expect(pdf).toMatch(/\/MarkInfo \d+ 0 R/);
    expect(pdf).toContain('/Marked true');
    expect(pdf).toContain('/StructTreeRoot');
  });

  test('should tag text as P under a Document root', async () => {
    const pdf = await render(
      <Document experimentalTagged>
        <Page>
          <Text>First</Text>
          <Text>Second</Text>
        </Page>
      </Document>,
    );

    expect(structTypes(pdf)).toEqual(expect.arrayContaining(['Document', 'P']));
    expect(markedContent(pdf)).toEqual(['P#0', 'P#1']);
  });

  test('should mark only drawn backgrounds and borders as artifacts', async () => {
    const pdf = await render(
      <Document experimentalTagged>
        <Page style={{ backgroundColor: 'red' }}>
          <View>
            <Text>No decoration</Text>
          </View>
          <View style={{ borderWidth: 1 }}>
            <Text>Bordered</Text>
          </View>
        </Page>
      </Document>,
    );

    expect(markedContent(pdf)).toEqual(['Artifact', 'P#0', 'Artifact', 'P#1']);
  });
});
