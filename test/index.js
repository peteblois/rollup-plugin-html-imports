var assert = require('assert');
var { rollup } = require('rollup');
var htmlImport = require('../');
var buble = require('rollup-plugin-buble');
var fs = require('fs');

process.chdir('test');

function makeBundle(options, importOptions) {
  options.plugins = [
    htmlImport(importOptions),
    buble({}),
  ];
  return rollup(options);
}

describe('rollup-plugin-html-imports', () => {
  it('should stringify importing template', () => {
    return makeBundle(
      {
        entry: 'fixtures/basic.js',
      },
      {
        include: 'fixtures/templates/*.html',
      }).then(bundle => {
        const { code } = bundle.generate({ format: 'iife', moduleName: 'tpl' });
        fs.writeFileSync('bundle.txt', code);
        // new Function('assert', code)(assert);
    });
  });

  // it('should output empty sourcemap', () => {
  //   return makeBundle({ entry: 'fixtures/basic.js' }, { include: '**/*.html' }).then(bundle => {
  //     const { code, map } = bundle.generate({ sourceMap: true });
  //     assert.ok(code);
  //     assert.ok(map);
  //   });
  // });

  // it('throws when include is not specified', () => {
  //   assert.throws(() => {
  //     makeBundle({ entry: 'fixtures/basic.js' });
  //   }, /include option should be specified/);
  // });
});
