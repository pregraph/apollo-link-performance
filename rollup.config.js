import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const input = 'src/index.js'

const defaultOutputOptions = {
  name: pkg.name,
  exports: 'named',
  format: 'umd',
  globals: {
    '@apollo/client': 'ApolloLink',
  },
  banner: `/*! ${pkg.name} - ${pkg.description} (v${pkg.version}) !*/`,
  footer: '/* Copyright 2022-2025 — Pregraph (https://www.pregraph.com) | Follow us @pregraph_ */',
}

const defaultPlugins = [
  peerDepsExternal(),
  json(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'runtime',
    presets: ['@babel/preset-env'],
  }),
]

const external = ['@apollo/client']

export default [
  // UMD - Minified
  {
    input,
    external,
    output: [
      {
        ...defaultOutputOptions,
        file: `dist/${pkg.name}.min.js`,
        format: 'umd',
      },
    ],
    plugins: [
      ...defaultPlugins,
      terser(),
    ],
  },
  // UMD
  {
    input,
    external,
    output: [
      {
        ...defaultOutputOptions,
        file: `dist/${pkg.name}.js`,
        format: 'umd',
      },
    ],
    plugins: [
      ...defaultPlugins,
    ],
  },
  // ES
  {
    input,
    external,
    output: [
      {
        ...defaultOutputOptions,
        file: 'dist/esm/index.mjs',
        format: 'esm',
      },
    ],
    plugins: [
      ...defaultPlugins,
    ],
  },
  // CJS
  {
    input,
    external,
    output: [
      {
        ...defaultOutputOptions,
        file: 'dist/cjs/index.cjs',
        format: 'cjs',
        exports: 'auto',
      },
    ],
    plugins: [
      ...defaultPlugins,
    ],
  },
]
