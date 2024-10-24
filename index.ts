import { CpeDict } from './src/cpe-dictionary';

async function main(target: string, version: string) {
  const cpeDict = new CpeDict('cpe-dictionary_v2.3-npm.xml');
  const cpe = cpeDict.cpeGen(target, version);
  console.log({ target, cpe });
}

const args = process.argv.slice(2);
main(args[0], args[1]);
