/**
 * GraphVisualizer creates visual representations of argument networks
 */
class GraphVisualizer {
  /**
   * Generates a visual graph of arguments and their relationships
   */
  static generateGraph(graph, options = {}) {
    const defaultOptions = {
      format: 'ascii',
      showDetails: true,
      maxDepth: 3,
      highlightSynthesis: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    switch (config.format) {
      case 'ascii':
        return this.generateAsciiGraph(graph, config);
      case 'dot':
        return this.generateDotGraph(graph, config);
      case 'mermaid':
        return this.generateMermaidGraph(graph, config);
      default:
        return this.generateJsonGraph(graph, config);
    }
  }
  
  /**
   * Generates ASCII representation of argument graph
   */
  static generateAsciiGraph(graph, config) {
    const lines = ['Argument Graph Visualization', '================================', ''];
    
    // Group arguments by type
    const types = {
      thesis: [],
      antithesis: [],
      synthesis: [],
      objection: [],
      rebuttal: []
    };
    
    graph.arguments.forEach(arg => {
      types[arg.type].push(arg);
    });
    
    // Display each type
    Object.entries(types).forEach(([type, args]) => {
      if (args.length > 0) {
        lines.push(`${this.formatType(type)}:`);
        args.forEach((arg, index) => {
          lines.push(`  ${this.formatArgument(arg, index, config)}`);
          if (config.showDetails) {
            lines.push(...this.formatArgDetails(arg, graph, '    '));
          }
        });
        lines.push('');
      }
    });
    
    // Show relationships
    if (config.showDetails) {
      lines.push('Relationships:', '-------------');
      this.generateRelationshipMap(graph).forEach(rel => {
        lines.push(`  ${rel}`);
      });
    }
    
    return lines.join('\n');
  }
  
  /**
   * Generates DOT graph for Graphviz
   */
  static generateDotGraph(graph, config) {
    const lines = ['digraph ArgumentGraph {'];
    lines.push('  rankdir=LR;');
    lines.push('  node [shape=box];');
    lines.push('');
    
    // Add nodes
    graph.arguments.forEach(arg => {
      const label = this.escapeLabel(arg.claim);
      const color = this.getNodeColor(arg, config);
      lines.push(`  "${arg.id}" [label="${label}", fillcolor="${color}", style=filled];`);
    });
    
    lines.push('');
    
    // Add edges
    graph.adjacencyList.forEach((relations, fromId) => {
      relations.supports.forEach(toId => {
        lines.push(`  "${fromId}" -> "${toId}" [color=green, label="supports"];`);
      });
      relations.contradicts.forEach(toId => {
        lines.push(`  "${fromId}" -> "${toId}" [color=red, label="contradicts"];`);
      });
      if (relations.respondsTo) {
        lines.push(`  "${fromId}" -> "${relations.respondsTo}" [color=blue, label="responds to"];`);
      }
    });
    
    lines.push('}');
    return lines.join('\n');
  }
  
  /**
   * Generates Mermaid graph syntax
   */
  static generateMermaidGraph(graph, config) {
    const lines = ['graph TD'];
    
    // Add nodes
    graph.arguments.forEach(arg => {
      const shape = this.getMermaidShape(arg);
      const label = this.escapeLabel(arg.claim);
      lines.push(`  ${arg.id}${shape}${label}${shape}`);
    });
    
    lines.push('');
    
    // Add relationships
    graph.adjacencyList.forEach((relations, fromId) => {
      relations.supports.forEach(toId => {
        lines.push(`  ${fromId} -->|supports| ${toId}`);
      });
      relations.contradicts.forEach(toId => {
        lines.push(`  ${fromId} -.->|contradicts| ${toId}`);
      });
      if (relations.respondsTo) {
        lines.push(`  ${fromId} -->|responds to| ${relations.respondsTo}`);
      }
    });
    
    // Add styling
    lines.push('');
    lines.push('  classDef thesis fill:#bbdefb;');
    lines.push('  classDef antithesis fill:#ffcdd2;');
    lines.push('  classDef synthesis fill:#c8e6c9;');
    lines.push('  classDef objection fill:#ffe0b2;');
    lines.push('  classDef rebuttal fill:#f8bbd0;');
    
    graph.arguments.forEach(arg => {
      lines.push(`  class ${arg.id} ${arg.type};`);
    });
    
    return lines.join('\n');
  }
  
  /**
   * Generates JSON representation of the graph
   */
  static generateJsonGraph(graph, config) {
    const nodes = [];
    const edges = [];
    
    graph.arguments.forEach(arg => {
      nodes.push({
        id: arg.id,
        label: arg.claim,
        type: arg.type,
        confidence: arg.confidence,
        ...config.showDetails && {
          premises: arg.premises,
          conclusion: arg.conclusion,
          strengths: arg.strengths,
          weaknesses: arg.weaknesses
        }
      });
    });
    
    graph.adjacencyList.forEach((relations, fromId) => {
      relations.supports.forEach(toId => {
        edges.push({
          from: fromId,
          to: toId,
          type: 'supports',
          color: '#4caf50'
        });
      });
      relations.contradicts.forEach(toId => {
        edges.push({
          from: fromId,
          to: toId,
          type: 'contradicts',
          color: '#f44336'
        });
      });
      if (relations.respondsTo) {
        edges.push({
          from: fromId,
          to: relations.respondsTo,
          type: 'responds_to',
          color: '#2196f3'
        });
      }
    });
    
    return JSON.stringify({ nodes, edges }, null, 2);
  }
  
  /**
   * Formats argument type for display
   */
  static formatType(type) {
    return type.toUpperCase().padEnd(12, ' ');
  }
  
  /**
   * Formats argument for display
   */
  static formatArgument(arg, index, config) {
    const confidenceIndicator = this.getConfidenceIndicator(arg.confidence);
    const claimTruncated = this.truncateText(arg.claim, 50);
    
    let result = `[${arg.id}] ${claimTruncated} ${confidenceIndicator}`;
    
    if (config.highlightSynthesis && arg.type === 'synthesis') {
      result = `*** ${result} ***`;
    }
    
    return result;
  }
  
  /**
   * Formats argument details
   */
  static formatArgDetails(arg, graph, indent) {
    const lines = [];
    
    // Show premises
    if (arg.premises.length > 0) {
      lines.push(`${indent}Premises:`);
      arg.premises.forEach((premise, idx) => {
        lines.push(`${indent}  ${idx + 1}. ${premise}`);
      });
    }
    
    // Show conclusion
    lines.push(`${indent}Conclusion: ${arg.conclusion}`);
    
    // Show relationships
    const supporters = graph.getSupporters(arg.id);
    const contradictors = graph.getContradictors(arg.id);
    const responders = graph.getResponders(arg.id);
    
    if (supporters.length > 0) {
      lines.push(`${indent}Supported by: ${supporters.map(s => s.id).join(', ')}`);
    }
    if (contradictors.length > 0) {
      lines.push(`${indent}Contradicted by: ${contradictors.map(c => c.id).join(', ')}`);
    }
    if (responders.length > 0) {
      lines.push(`${indent}Responses: ${responders.map(r => r.id).join(', ')}`);
    }
    
    // Show strengths/weaknesses
    if (arg.strengths.length > 0) {
      lines.push(`${indent}Strengths: ${arg.strengths.join(', ')}`);
    }
    if (arg.weaknesses.length > 0) {
      lines.push(`${indent}Weaknesses: ${arg.weaknesses.join(', ')}`);
    }
    
    return lines;
  }
  
  /**
   * Generates relationship map
   */
  static generateRelationshipMap(graph) {
    const relationships = [];
    
    graph.adjacencyList.forEach((relations, fromId) => {
      const arg = graph.getArgument(fromId);
      const argName = this.truncateText(arg.claim, 20);
      
      relations.supports.forEach(toId => {
        const toArg = graph.getArgument(toId);
        const toName = this.truncateText(toArg.claim, 20);
        relationships.push(`${argName} → supports → ${toName}`);
      });
      
      relations.contradicts.forEach(toId => {
        const toArg = graph.getArgument(toId);
        const toName = this.truncateText(toArg.claim, 20);
        relationships.push(`${argName} → contradicts → ${toName}`);
      });
      
      if (relations.respondsTo) {
        const toArg = graph.getArgument(relations.respondsTo);
        const toName = this.truncateText(toArg.claim, 20);
        relationships.push(`${argName} → responds to → ${toName}`);
      }
    });
    
    return relationships;
  }
  
  /**
   * Gets node color based on argument type
   */
  static getNodeColor(arg, config) {
    const colors = {
      thesis: 'lightblue',
      antithesis: 'lightcoral',
      synthesis: 'lightgreen',
      objection: 'lightsalmon',
      rebuttal: 'lightpink'
    };
    
    if (config.highlightSynthesis && arg.type === 'synthesis') {
      return 'green';
    }
    
    return colors[arg.type] || 'lightgray';
  }
  
  /**
   * Gets Mermaid shape based on argument type
   */
  static getMermaidShape(arg) {
    const shapes = {
      thesis: '[',
      antithesis: '[[',
      synthesis: '{{',
      objection: '>[',
      rebuttal: '(('
    };
    
    return shapes[arg.type] || '[';
  }
  
  /**
   * Escapes text for use in graph labels
   */
  static escapeLabel(text) {
    return text.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }
  
  /**
   * Truncates text to specified length
   */
  static truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - 3) + '...';
  }
  
  /**
   * Gets confidence indicator symbol
   */
  static getConfidenceIndicator(confidence) {
    if (confidence >= 0.8) return '⬆';
    if (confidence <= 0.3) return '⬇';
    return '→';
  }
  
  /**
   * Generates HTML visualization
   */
  static generateHtmlVisualization(graph, options = {}) {
    const json = JSON.parse(this.generateJsonGraph(graph, options));
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Argument Graph Visualization</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis-network.min.js"></script>
    <style>
        #mynetworkid {
            width: 100%;
            height: 600px;
            border: 1px solid lightgray;
        }
        .legend {
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
        }
        .legend-item {
            margin: 5px 0;
        }
        .color-box {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            border: 1px solid #666;
        }
    </style>
</head>
<body>
    <h1>Argument Graph Visualization</h1>
    <div id="mynetworkid"></div>
    <div class="legend">
        <h3>Legend</h3>
        <div class="legend-item"><span class="color-box" style="background: #bbdefb;"></span>Thesis</div>
        <div class="legend-item"><span class="color-box" style="background: #ffcdd2;"></span>Antithesis</div>
        <div class="legend-item"><span class="color-box" style="background: #c8e6c9;"></span>Synthesis</div>
        <div class="legend-item"><span class="color-box" style="background: #ffe0b2;"></span>Objection</div>
        <div class="legend-item"><span class="color-box" style="background: #f8bbd0;"></span>Rebuttal</div>
    </div>
    <script type="text/javascript">
        const nodeColors = {
            thesis: '#bbdefb',
            antithesis: '#ffcdd2',
            synthesis: '#c8e6c9',
            objection: '#ffe0b2',
            rebuttal: '#f8bbd0'
        };
        
        const nodes = ${JSON.stringify(json.nodes)}.map(node => ({
            id: node.id,
            label: node.label,
            color: nodeColors[node.type] || '#ddd',
            title: \`Type: \${node.type}\\nConfidence: \${node.confidence}\\n\\nClick for details\`,
            shape: node.type === 'synthesis' ? 'star' : 'box'
        }));
        
        const edges = ${JSON.stringify(json.edges)}.map(edge => ({
            from: edge.from,
            to: edge.to,
            label: edge.type.replace('_', ' '),
            color: edge.color,
            arrows: 'to',
            smooth: { type: 'curvedCW', roundness: 0.2 }
        }));
        
        const container = document.getElementById('mynetworkid');
        const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
        const options = {
            physics: { stabilization: false },
            interaction: { hover: true },
            manipulation: false
        };
        
        const network = new vis.Network(container, data, options);
        
        network.on("click", function (params) {
            if (params.nodes.length === 1) {
                const nodeId = params.nodes[0];
                const node = ${JSON.stringify(json.nodes)}.find(n => n.id === nodeId);
                if (node) {
                    let content = \`<strong>\${node.label}</strong><br>\\n\`;
                    content += \`<strong>Type:</strong> \${node.type}<br>\\n\`;
                    content += \`<strong>Confidence:</strong> \${node.confidence}<br><br>\\n\`;
                    
                    if (node.premises) {
                        content += \`<strong>Premises:</strong><ul>\\n\`;
                        node.premises.forEach(p => content += \`<li>\${p}</li>\\n\`);
                        content += \`</ul>\\n\`;
                    }
                    
                    content += \`<strong>Conclusion:</strong> \${node.conclusion}<br><br>\\n\`;
                    
                    if (node.strengths && node.strengths.length > 0) {
                        content += \`<strong>Strengths:</strong> \${node.strengths.join(', ')}<br>\\n\`;
                    }
                    
                    if (node.weaknesses && node.weaknesses.length > 0) {
                        content += \`<strong>Weaknesses:</strong> \${node.weaknesses.join(', ')}<br>\\n\`;
                    }
                    
                    document.body.innerHTML += \`
                        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; max-width: 600px; max-height: 80%; overflow-y: auto;">
                                \${content}
                                <button onclick="this.parentElement.parentElement.remove()">Close</button>
                            </div>
                        </div>
                    \`;
                }
            }
        });
    </script>
</body>
</html>
    `;
    
    return html;
  }
}

module.exports = GraphVisualizer;
