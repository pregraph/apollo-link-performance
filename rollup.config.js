import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const config = {
  input: 'src/index.js',
  output: {
    name: pkg.name,
    file: './index.js',
    exports: 'named',
    format: 'umd',
    globals: {
      '@apollo/client': ['ApolloLink', 'Operation'],
      'react': 'React',
    },
    banner: `/*! ${pkg.name} - ${pkg.description} !*/`,
    footer: '/* Copyright 2022 - Pregraph (https://www.pregraph.com) | Follow us @pregraph_ */',
  },
  external: ['ApolloLink', 'Operation', 'react'],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    json(),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(terser());
}

export default config;
