import {createFilter} from 'rollup-pluginutils';
import parse5 from 'parse5';
import dom5 from 'dom5';
import path from 'path';

function transformHtmlToJs(htmlDocument, htmlPath) {
  const ast = parse5.parseFragment(htmlDocument);
  const basePath = path.dirname(htmlPath);

  const htmlImports = dom5.queryAll(ast, isHtmlImportNode);

  const jsImports = [];
  for (const htmlImport of htmlImports) {
    const href = dom5.getAttribute(htmlImport, 'href');
    const importPath = path.resolve(basePath, href);
    const line = `import htmlImport${jsImports.length} from '${importPath}';\n`;
    jsImports.push(line);

    dom5.remove(htmlImport);
  }


  const jsDocument = `
${jsImports}

const html = ${JSON.stringify(parse5.serialize(ast))};

const range = document.createRange();
export default range.createContextualFragment(html);
`;
  console.log(jsDocument);
  return jsDocument;
}

const isHtmlImportNode = dom5.predicates.AND(
  dom5.predicates.hasTagName('link'),
  dom5.predicates.hasAttrValue('rel', 'import'),
  dom5.predicates.NOT(dom5.predicates.hasAttrValue('type', 'css'))
);

export default function htmlImport(opts = {}) {
  if (!opts.include) {
    throw Error('include option should be specified');
  }

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: 'htmlImport',

    transform(code, id) {
      if (filter(id)) {
        return {
          code: transformHtmlToJs(code, id),
          map: { mappings: '' }
        };
      }
    }
  };
}
