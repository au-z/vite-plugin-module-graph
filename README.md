# vite-plugin-module-graph
> Visualize and explore your module import graph

## Installation
```bash
npm i -D vite-plugin-module-graph
# pnpm
pnpm add -D vite-plugin-module-graph
```

## Usage
1. Generate a module graph on every build by adding the plugin to your `vite.config.ts` file.
You can tune your graph to exclude node_modules or other directories by using the `exclude` option.

```ts
import {defineConfig} from 'vite'
import {ModuleGraph} from 'vite-plugin-module-graph'

export default defineConfig({
  /* ... */
  plugins: [
    ModuleGraph({
      output: './graph.json',
      exclude: [/node_modules/],
    })
  ]
})
```

2. Visualize your graph by adding the `module-graph` element to your UI.

```html
<script type="module" src="./node_modules/vite-plugin-module-graph/module-graph"></script>

<module-graph href="./graph.json"></module-graph>

<script>
  const graph = document.querySelector('module-graph')
  graph.addEventListener('load', (e) => {
    const {graph, data} = e.detail

    // use the 3d-force-graph API directly to customize the graph after initialization
    // DOCS: https://github.com/vasturiano/3d-force-graph
    graph
      .nodeColor(() => 'blue')
      .linkColor(() => 'white')

    // freely access the graph data: {nodes: {id: string}[], links: {source: number, target: number}[]}
    console.log('Graph data:', data)
  })
</script>
```

## Plugin Options
- `output` - The path to save the module graph. Default: `./graph.json`
- `exclude` - An array of regex patterns to exclude modules from the graph. Default: `[]`

## Component Options
- `href` - The path to the module graph. Default: `./graph.json`
- `control` - The control type for the graph. Default: `orbit`
- `notree` - Whether to show the directory tree. Default: `false`
- `nav` - Show the nav info. Default: `false`

### CustomEvents Events
- `load` - Fired when the graph is loaded.

