const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

function extractFunction(name) {
  const start = html.indexOf(`function ${name}`);
  assert.notStrictEqual(start, -1, `${name} should exist in index.html`);

  const braceStart = html.indexOf('{', start);
  let depth = 0;

  for (let i = braceStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}') depth--;
    if (depth === 0) return html.slice(start, i + 1);
  }

  throw new Error(`Could not extract ${name}`);
}

const context = { URL };
vm.createContext(context);
vm.runInContext(extractFunction('getAccessSlugForLocation'), context);

assert.strictEqual(context.getAccessSlugForLocation('https://partofff.web.id/'), 'utama');
assert.strictEqual(context.getAccessSlugForLocation('https://partofff.web.id/?lang=id'), 'utama-id');
assert.strictEqual(context.getAccessSlugForLocation('https://partofff.web.id/?lang=in'), 'utama-id');
assert.strictEqual(context.getAccessSlugForLocation('https://partofff.web.id/?lang=en'), 'utama-en');
assert.strictEqual(context.getAccessSlugForLocation('https://partofff.web.id/?to=fida&lang=en'), 'fida');
assert.strictEqual(context.getAccessSlugForLocation('https://partofff.web.id/fida'), 'fida');
assert.strictEqual(context.getAccessSlugForLocation('https://partofff.web.id/#keluarga%20andi'), 'keluarga andi');

console.log('access gate tests passed');
