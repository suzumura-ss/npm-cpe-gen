import { CpeDict } from './src/cpe-dictionary';

async function main(target: string, version: string) {
  const cpeDict = new CpeDict('cpe-dictionary_v2.3-npm.xml');
  if (target.startsWith('https://')) {
    const cpe = cpeDict.cpeGen(target, version);
    console.log({ target, cpe });
  } else {
    const items = cpeDict.matchItems(target);
    console.log(JSON.stringify(items, null, 2));
  }
}

const args = process.argv.slice(2);
main(args[0], args[1] ?? '9.9.9');
