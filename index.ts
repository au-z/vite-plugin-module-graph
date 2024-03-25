import {ForceGraph3DInstance} from '3d-force-graph'

const moduleGraph = document.querySelector('module-graph');
if(!moduleGraph) {
  throw new Error('module-graph element not found');
}

(<any>moduleGraph).addEventListener('load', (e: CustomEvent<{
  graph: ForceGraph3DInstance,
  data: {nodes: any[], links: any[]}
}>) => {
  const {graph, data} = e.detail;
  console.log(data);
  graph.nodeLabel('id')
    .nodeColor(() => '#EA706C')
    .linkColor(() => '#FFFFFF')
    .linkOpacity(1)
    .linkWidth(1)
    .linkCurvature(() => 0.25)
});