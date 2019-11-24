//import typescript from 'rollup-plugin-typescript2';
import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';


export default {
  input: './src/main.ts',
  plugins: [
    nodeResolve({browser: true}),
    typescript(),
  ],
  output: {
    format: 'esm',
    file: 'build/main.js',
  },
}
