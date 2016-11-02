const assert = require('assert');
const {rollup} = require('rollup');
const htmlImport = require('../');

process.chdir('test');

function makeBundle(options, importOptions) {
  options.plugins = [
    htmlImport(importOptions),
  ];
  return rollup(options);
}

describe('rollup-plugin-html-imports', () => {
  it('should order code correctly', () => {
    return makeBundle({entry: 'fixtures/ordering.js'}).then((bundle) => {
      const { code } = bundle.generate();
      const aHtmlIndex = code.indexOf('from a.html');

      const script1Index = code.indexOf('from script 1');
      assert.ok(aHtmlIndex < script1Index, 'script1 should be after first HTML import.');

      const aDivIndex = code.indexOf('a div');
      assert.ok(script1Index < aDivIndex, 'first div should be after first script import.');

      const bHtmlIndex = code.indexOf('from b.html');
      assert.ok(aDivIndex < bHtmlIndex, 'second import should be after inline div.');

      const script2Index = code.indexOf('from script 2');
      assert.ok(bHtmlIndex < script2Index, 'second script import should be after second import.');
    });
  }),

  it('should omit comments', () => {
    return makeBundle({entry: 'fixtures/comments.js'}).then((bundle) => {
      const { code } = bundle.generate();
      assert.equal(-1, code.indexOf('one comment'), 'First comment should be stripped.');
      assert.notEqual(-1, code.indexOf('some text'), 'Text nodes are maintained.');
      assert.equal(-1, code.indexOf('two comment'), 'First comment should be stripped.');
    });
  }),

  it('should support es6 imports from inline script elements', () => {
    return makeBundle({entry: 'fixtures/es6_inline_imports.js'}).then((bundle) => {
      const { code } = bundle.generate();
      assert.notEqual(-1, code.indexOf('from a.js'), 'Imports should be included in document.');
    });
  }),

  it('should support es6 imports from script source elements', () => {
    return makeBundle({entry: 'fixtures/es6_script_src.js'}).then((bundle) => {
      const { code } = bundle.generate();
      assert.notEqual(-1, code.indexOf('from a.js'), 'Imports should be included in document.');
    });
  })
});
