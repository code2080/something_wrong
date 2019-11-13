import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import PrefixWrap from 'postcss-prefixwrap';

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: [
    ...Object.keys(pkg.peerDependencies)
  ],
  plugins: [
    external(),
    postcss({
      inject: false,
      extract: 'dist/te-prefs-lib.css',
      extensions: ['.css', '.scss', '.less'],
      use: [
        ['less', { javascriptEnabled: true }],
        ['sass']
      ],
      // plugins: [ PrefixWrap('.te-prefs-lib') ],
      sourceMap: true
    }),
    url(),
    svgr(),
    json(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      plugins: [ 'external-helpers', 'transform-runtime', 'transform-object-rest-spread' ]
    }),
    commonjs(),
    resolve(),
  ]
}
