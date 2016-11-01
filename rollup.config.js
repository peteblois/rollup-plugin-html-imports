import buble from 'rollup-plugin-buble';

var pkg = require('./package.json');

export default {
  entry: 'src/index.js',
  plugins: [
    buble({
      transforms: {
        dangerousForOf: true
      }
    })
  ],
  targets: [
    {
      format: 'cjs',
      dest: pkg['main']
    },
    {
      format: 'es6',
      dest: pkg['jsnext:main']
    }
  ]
};
