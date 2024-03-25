import {define, dispatch, html} from 'hybrids'
import {getset, effect, ref, cssVar} from '@auzmartist/hybrids-helpers'
import Graph, {ForceGraph3DInstance} from '3d-force-graph'
import styles from './module-graph.css?inline'

export interface ModuleGraph extends HTMLElement {
  // control type for the graph
  control: 'orbit' | 'trackball' | 'fly',
  // url to the graph json
  href: string
  // whether to show the directory tree
  notree?: boolean
  // show the nav info
  nav?: boolean

  // ---- private ----
  // the element where we mount the graph
  ref: HTMLElement
  // the graph instance
  graph: ForceGraph3DInstance
  data: {nodes: any[], links: any[]}
  directory: Record<string, any>
}
type H = ModuleGraph

export const ModuleGraph = define<H>({
  tag: 'module-graph',
  control: 'orbit',
  notree: false,
  nav: false,
  href: '',
  ref: effect(ref('#graph'), init),
  graph: effect(getset(undefined), (host, graph: ForceGraph3DInstance) => {
    host.init && host.init(graph)
  }),
  data: getset({nodes: [], links: []}),
  directory: ({data}: H) => {
    const directory = {}
    data.nodes.forEach(({id}) => {
      const parts = id.split('/')
      let dir = directory
      for(const part of parts) {
        if(!dir[part]) dir[part] = {}
        dir = dir[part]
      }
    })
    return directory
  },
  render: (h: H) => html`<main>
    <div class="left-panel">
      ${!h.notree ? html`<file-tree data="${h.directory}"></file-tree>` : html``}
    </div>
    <div class="right-panel">
      <div id="graph"></div>
    </div>
  </main>
  `.css`
    :host {
      --left-panel-width: ${h.notree ? '0' : 'minmax(400px, 30%)'};
    }
  `.style(styles),
})

async function init(h: H, ref: HTMLElement) {
  let graph: ForceGraph3DInstance
  
  function resize() {
    const {width, height} = h.getBoundingClientRect()
    console.log('resize', width, height)
    graph?.width(width).height(height)
  }

  if(!h.href) throw new Error('module-graph requires an href attribute')

  await fetch(h.href, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }).then((res) => res.ok ? res.json() : (() => { throw new Error(res.statusText)})())
    .then((data) => h.data = data)

  graph = Graph({
    controlType: h.control,
  })(ref)
    .graphData(h.data)
    .backgroundColor('#00000000')
    .showNavInfo(h.nav)

  window.addEventListener('resize', resize)
  resize()

  // const bloomPass = new UnrealBloomPass(new Vector2(0, 0), 2, 0.5, 0.01);
  // host.graph.postProcessingComposer().addPass(bloomPass);
  h.graph = graph
  dispatch(h, 'load', {detail: {graph, data: h.data}, bubbles: true, composed: true})
}

// utility components

define<any>({
  tag: 'file-tree',
  data: getset({}),
  close: false,
  render: ({data, close}) => html`<ul>
    ${Object.entries(data).map(([item, children]) => {
      const dir = Object.keys(children).length > 0
      return html`<li class="${{dir, file: !dir, close}}">
        <label onclick="${(h) => {
          if(dir) { h.close = !h.close }
        }}">${item}</label>
        ${dir ? html`<file-tree data="${children}" style="${{display: close ? 'none' : 'initial'}}"></file-tree>` : html``}
      </li>`
    })}
  </ul>`.css`
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    li > label {
      width: 100%;
      padding: 0 1rem 0 2.4rem;
      margin-left: -2rem;
    }
    li.dir > label {
      cursor: pointer;
    }
    li.dir::before {
      content: '🗁';
    }
    li.dir.close::before {
      content: '🗀';
    }
    li.file::before {
      content: '◎';
    }
    li {
      padding-left: 0.75em;
    }
  `,
  renderFile: ({data}) => html``,
})