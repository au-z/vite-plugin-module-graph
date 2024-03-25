import path from 'path'
import { defineConfig } from 'vite'
const resolve = (rel) => path.resolve(__dirname, rel)
import { ModuleGraph } from './src/plugin'

export default defineConfig({
  server: {
    port: 8080,
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        'module-graph': 'src/module-graph.ts',
        'plugin': 'src/plugin.ts',
      },
      formats: ['es'],
    },
    outDir: resolve('dist'),
  },
  plugins: [
    ModuleGraph({
			output: './graph.json',
			exclude: [
				// /node_modules/,
				// /^vite/,
				// /^commonjsHelpers\.js$/,
        // /^__vite-browser-external/,
			],
		}),
  ]
})