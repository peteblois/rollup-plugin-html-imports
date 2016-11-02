# rollup-plugin-html-imports

Seamless integration between [Rollup](https://github.com/rollup/rollup) and 
[Polymer](https://www.polymer-project.org/1.0/docs/devguide/feature-overview) HTML resources.

This plugin exposes the contents of HTML imports to the Rollup dependency management
system to allow both HTML and Javascript dependencies to be managed by Rollup.

## What you get


### Declare dependencies on HTML resources from Javascript

The transitive closure of dependencies for an HTML import can be referenced directly from
javascript, from locations such as NPM modules.

From vanilla Javascript:

```javascript
import {} from '@polymer/paper-input/paper-input.html';

const input = document.createElement('paper-input');
document.body.appendChild(input);
```

Or with React:

```javascript
import React from 'react'
import {} from '@polymer/paper-button/paper-button.html';

export class ReactComponent extends React.Component {
  render () {
    return (
      <paper-button raised>ok</paper-button>
    )
  }
}
```

Because the dependencies between individual HTML resources are also handled by Rollup, overlapping imports only pull in the additional dependencies.

```javascript
import {} from '@polymer/paper-button/paper-button.html';
import {} from '@polymer/paper-dropdown-menu/paper-dropdown-menu.html';
import {} from '@polymer/paper-input/paper-input.html';

// Did not pull in the framework 3 times!
```

### Use ES6 imports from inline script tags

Inline scripts are extracted from the HTML file and can have their own set of dependencies which are managed by Rollup.

```html
<link rel='import' href='@polymer/polymer/polymer.html'>
<dom-module id='polymer-component'>
  <template>
    <div id='react'></div>
  </template>
</dom-module>

<script>
  import React from 'react';
  import ReactDOM from 'react-dom';
  import { ReactComponent } from './react-component.jsx';

  Polymer({
    is: 'polymer-component',
    attached() {
      ReactDOM.render(<ReactComponent />, this.$.react);
    }
  });
</script>
```

## Installation

(Once it's actually published)

```bash
yarn add rollup-plugin-html-imports -dev
yarn add @polymer/paper-input
yarn install --flat
```

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
