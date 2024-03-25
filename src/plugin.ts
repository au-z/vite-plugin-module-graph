import fs from 'fs'

export interface ModuleGraphOptions {
  output: string,
  exclude?: RegExp[],
}

const DEFAULT_OPTIONS: ModuleGraphOptions = {
  output: './module-graph.json',
  exclude: [],
}

export function ModuleGraph(options: ModuleGraphOptions = DEFAULT_OPTIONS) {
  let exclude = (str) => options.exclude?.some((regex) => str.match(regex));

  return {
    name: 'module-graph',
    generateBundle() {
      let modules = []
      for(const moduleId of this.getModuleIds()) {
        if(!exclude(moduleId.replace(/\x00/g, ''))) {
          modules.push(moduleId)
        }
      }

      // determine common module prefix
      let prefix = getPrefix(modules.map((id) => id.replace(/\x00/g, '')))
      let strip = (str) => str.substring(prefix.length)

      // generate graph
      const graph = { nodes: [], links: [] }
      modules.forEach((id) => {
        const nodeId = strip(id.replace(/\x00/g, ''))
        const linkTargets = this.getModuleInfo(id).importedIds
          .map((id) => id.replace(/\x00/g, ''))
          .filter((id) => !exclude(id))
          .map((id) => strip(id))

        graph.nodes.push({ id: nodeId })
        linkTargets.forEach((target) => {
          graph.links.push({ source: nodeId, target })
        })
      })

      // write
      fs.writeFileSync(options.output, JSON.stringify(graph))
    }
  }
}

function getPrefix(ids) {
  if (ids.length < 2) {
    return '';
  }
  return ids.reduce((prefix, id) => {
    id = id.replace(/\\x00/g, '')
    while (id.indexOf(prefix) != 0) {
      prefix = prefix.substring(0, prefix.length - 1);
    }
    return prefix;
  });
}

