import {createFilter} from 'rollup-pluginutils';
import parse5 from 'parse5';
import dom5 from 'dom5';
import path from 'path';
import MagicString from 'magic-string';

function transformHtmlToJs(htmlDocument, htmlPath) {
  const magicString = new MagicString(htmlDocument);

  const ast = parse5.parseFragment(htmlDocument);
  const basePath = path.dirname(htmlPath);

  const htmlImports = dom5.queryAll(ast, isHtmlImportNode);

  const jsImports = [];
  for (const htmlImport of htmlImports) {
    const href = dom5.getAttribute(htmlImport, 'href');
    const importPath = path.resolve(basePath, href);
    const line = `import htmlImport${jsImports.length} from './${href}';`;
    jsImports.push(line);

    dom5.remove(htmlImport);
  }

  let html = JSON.stringify(parse5.serialize(ast));
  html = html.replace(/\\n/g, '\n');
  html = html.replace(/\`/g, '\\`');
  const jsDocument = `
${jsImports.join('\n')}

const html = \`${html}\`;

const range = document.createRange();
const fragment = range.createContextualFragment(html);

const link = document.createElement('link');
link.appendChild(fragment);
document.head.appendChild(link);

export default fragment;
`;

  magicString.slice(0);
  magicString.append(jsDocument);

  // magicString.overwrite(0, -1, jsDocument);

  // console.log(jsDocument);

  return {code: magicString.toString(), map: magicString.generateMap({hires: true})};

  // return jsDocument;
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
        return transformHtmlToJs(code, id);
      }
    }
  };
}
