import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';

var pkg = require('./package.json');

export default {
  entry: 'src/index.js',
  plugins: [
    //nodeResolve({ jsnext: true }),
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
