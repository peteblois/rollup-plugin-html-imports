# rollup-plugin-html-imports

Seamless integration between [Rollup](https://github.com/rollup/rollup) and 
[Polymer](https://www.polymer-project.org/1.0/docs/devguide/feature-overview) HTML resources.

## Installation

```bash
yarn add rollup-plugin-html-imports -dev
yarn add @polymer/paper-input
yarn install --flat
```

## Example

**config**

```javascript
import { rollup } from 'rollup';
import htmlImports from 'rollup-plugin-html-imports';

rollup({
  entry: 'main.js',
  plugins: [
    htmlImports(),
    nodeResolve({ jsnext: true }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ]
}).then(...)
```

**entry**

```javascript
import {} from '@polymer/paper-input/paper-input.html';

const input = document.createElement('paper-input');
document.body.appendChild(input);
```
