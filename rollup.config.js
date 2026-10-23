import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';

import pack from './package.json' with { type: 'json' };

const banner = `/**
* ${pack.name}
* ${pack.description}
* @author ${pack.author}
* @version ${pack.version}
* @license
* Copyright (c) 2024 Alexander Vassbotn Røyne-Helgesen
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/`;
// Runtime dependencies stay external in the ES module and CommonJS builds, and
// are installed from npm. Only the UMD build for script tags and CDNs inlines
// them, since a script tag can't resolve dependencies.
const external = Object.keys(pack.dependencies ?? {});
const plugins = () => [
  nodeResolve(),
  ts({
    tsconfig: './tsconfig.build.json',
    useTsconfigDeclarationDir: true,
    sourceMap: false,
    typescript
  }),
  terser()
];

export default [
  {
    input: 'src/main.ts',
    external,
    output: [
      {
        file: './dist/angle.cjs',
        format: 'cjs',
        sourcemap: true,
        banner,
        exports: 'named'
      },
      {
        file: './dist/angle.esm.js',
        format: 'esm',
        sourcemap: true,
        banner,
        exports: 'named'
      }
    ],
    plugins: plugins()
  },
  {
    input: 'src/main.ts',
    output: {
      name: 'angle',
      file: './dist/angle.js',
      format: 'umd',
      sourcemap: true,
      banner,
      exports: 'named'
    },
    plugins: plugins()
  },
  {
    input: './dts/main.d.ts',
    external,
    output: [
      { file: './dist/angle.d.ts', format: 'es' },
      // CommonJS types for the require condition
      { file: './dist/angle.d.cts', format: 'es' }
    ],
    plugins: [dts()]
  }
];
