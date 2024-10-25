import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { XMLParser } from 'fast-xml-parser';

type XCpeItemReference = {
  '#text': string;
  '@_href': string;
};
type XCpeItem = {
  title: {
    '#text': string;
  },
  references: {
    reference: XCpeItemReference | XCpeItemReference[],
  },
  'cpe-23:cpe23-item': {
    '@_name': string;
  };
};
type CpeItem = {
  title: string;
  references: string[];
  cpe23item: string;
};

export class CpeDict {
  private readonly cpeItems: CpeItem[]
  constructor(xmlPath: string) {
    const xml = readFileSync(xmlPath, 'utf-8');
    const xp = new XMLParser({
      ignoreDeclaration: true,
      ignoreAttributes: false,
    });
    this.cpeItems = xp.parse(xml)['cpe-list']['cpe-item'].map((item: XCpeItem) => {
      const { title, references: refs, ...rest } = item;
      const cpe23item = rest['cpe-23:cpe23-item']['@_name'];
      const references = Array.isArray(refs.reference)
        ? refs.reference.map((r) => r['@_href'])
        : [ refs.reference['@_href'] ];
      return {
        title: title['#text'],
        references,
        cpe23item,
      };
    });
  }

  public matchItems(part: string): CpeItem[] {
    return this.cpeItems.filter(item => item.references.find(i => i.includes(part)));
  }

  public findItems(url: string): CpeItem[] {
    return this.cpeItems.filter(item => item.references.find(i => i === url || i.startsWith(`${url}/`)));
  }

  public cpeGen(url: string, version: string): string | undefined {
    const cpeBuilder = (href: string) => {
      const items = this.findItems(href);
      if (items.length > 0) {
        const { cpe23item } = items[items.length - 1];
        const cpeParts = cpe23item.split(':'); // cpe:2.3:a:expresscart_project:expresscart:1.0.1:*:*:*:*:node.js:*:*
        cpeParts[5] = version;
        return cpeParts.join(':');
      }
      return undefined
    };
    return cpeBuilder(url) ?? cpeBuilder(`https://www.npmjs.com/package/${basename(url)}`);
  }
}
