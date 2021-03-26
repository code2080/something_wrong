import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import PrefixWrap from 'postcss-prefixwrap';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: false,
      exports: 'auto',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: false,
      exports: 'auto',
    },
  ],
  external: [...Object.keys(pkg.peerDependencies)],
  plugins: [
    external(),
    postcss({
      inject: false,
      extract: 'te-prefs-lib.css',
      extensions: ['.css', '.scss', '.less'],
      use: [['less', { javascriptEnabled: true }], ['sass']],
      plugins: [PrefixWrap('.te-prefs-lib')],
      sourceMap: false,
    }),
    url(),
    svgr(),
    json(),
    typescript(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    resolve(),
  ],
};
