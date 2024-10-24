import { readFileSync } from 'node:fs';
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
  reference: string;
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
      const reference = references.find(r => r.startsWith('https://www.npmjs.com/'));
      return {
        title: title['#text'],
        reference,
        cpe23item,
      };
    });
  }

  public matchItems(re: RegExp | string): CpeItem[] {
    return this.cpeItems.filter(item => item.reference.match(re));
  }

  public findItems(url: string): CpeItem[] {
    return this.cpeItems.filter(item => item.reference === url);
  }

  public cpeGen(url: string, version: string): string | undefined {
    const items = this.findItems(url);
    if (items.length === 0) {
      return;
    }
    const { cpe23item } = items[0];
    const cpeParts = cpe23item.split(':'); // cpe:2.3:a:expresscart_project:expresscart:1.0.1:*:*:*:*:node.js:*:*
    cpeParts[5] = version;
    return cpeParts.join(':');
  }
}
