import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import url from 'rollup-plugin-url';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss({
      extensions: ['.css'],
      extract: true,  // Creates a separate CSS file in the dist folder
      minimize: true,
    }),
    url({
      include: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
      limit: 0,  // Don’t inline, copy to dist folder
      emitFiles: true,
      fileName: 'fonts/[name][extname]',  // Save to `dist/fonts`
    }),
    copy({
      targets: [
        { src: 'src/assets/fonts', dest: 'dist/assets' }  // Copy `assets/fonts` to `dist`
      ],
      verbose: true,
    }),
  ],
};
