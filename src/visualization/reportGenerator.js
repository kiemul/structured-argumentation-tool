const Evaluator = require('../analysis/evaluator');
const GraphVisualizer = require('./graphVisualizer');

/**
 * ReportGenerator creates comprehensive reports on argumentation analysis
 */
class ReportGenerator {
  /**
   * Generates a complete analysis report
   */
  static generateReport(graph, options = {}) {
    const defaultOptions = {
      format: 'markdown',
      includeDiagrams: true,
      includeMetrics: true,
      includeScoring: true,
      depth: 'comprehensive'
    };
    
    const config = { ...defaultOptions, ...options };
    
    const report = {
      metadata: this.generateMetadata(graph),
      summary: this.generateSummary(graph),
      arguments: this.analyzeArguments(graph),
      structure: this.analyzeStructure(graph),
      quality: this.analyzeQuality(graph)
    };
    
    if (config.includeMetrics) {
      report.metrics = this.generateMetrics(graph);
    }
    
    if (config.includeScoring) {
      report.scoring = this.generateScoringReport(graph);
    }
    
    if (config.includeDiagrams) {
      report.visualizations = this.generateVisualizations(graph);
    }
    
    return this.formatReport(report, config.format);
  }
  
  /**
   * Generates report metadata
   */
  static generateMetadata(graph) {
    return {
      timestamp: new Date().toISOString(),
      argumentCount: graph.arguments.length,
      relationshipCount: this.countRelationships(graph),
      types: this.countArgumentTypes(graph),
      complexity: this.assessComplexity(graph)
    };
  }
  
  /**
   * Generates executive summary
   */
  static generateSummary(graph) {
    const mainArguments = this.identifyMainArguments(graph);
    const keyConflicts = this.identifyKeyConflicts(graph);
    const syntheses = graph.arguments.filter(arg => arg.type === 'synthesis');
    
    return {
      overview: this.generateOverview(graph),
      mainArguments: mainArguments,
      keyConflicts: keyConflicts,
      syntheses: syntheses.length > 0 ? syntheses : null,
      conclusion: this.generateExecutiveConclusion(graph)
    };
  }
  
  /**
   * Analyzes individual arguments
   */
  static analyzeArguments(graph) {
    const analyses = [];
    
    graph.arguments.forEach(arg => {
      const analysis = {
        id: arg.id,
        type: arg.type,
        evaluation: Evaluator.evaluateArgument(arg, graph),
        relationships: this.getArgumentRelationships(arg, graph),
        criticalPath: this.traceCriticalPath(arg, graph),
        impact: this.assessArgumentImpact(arg, graph)
      };
      
      analyses.push(analysis);
    });
    
    return analyses;
  }
  
  /**
   * Analyzes argument structure
   */
  static analyzeStructure(graph) {
    return {
      hierarchicalLevels: this.analyzeHierarchy(graph),
      clusters: this.identifyClusters(graph),
      criticalPaths: this.findCriticalPaths(graph),
      density: this.calculateDensity(graph),
      centrality: this.calculateCentrality(graph)
    };
  }
  
  /**
   * Analyzes overall quality
   */
  static analyzeQuality(graph) {
    const qualityMetrics = {
      logicalCoherence: this.assessLogicalCoherence(graph),
      evidentialSupport: this.assessEvidentialSupport(graph),
      dialogicDepth: this.assessDialogicDepth(graph),
      synthesisQuality: this.assessSynthesisQuality(graph),
      completeness: this.assessCompleteness(graph)
    };
    
    return {
      metrics: qualityMetrics,
      overallScore: this.calculateOverallQualityScore(qualityMetrics),
      strengths: this.identifyOverallStrengths(graph),
      weaknesses: this.identifyOverallWeaknesses(graph),
      recommendations: this.generateRecommendations(graph, qualityMetrics)
    };
  }
  
  /**
   * Generates metrics dashboard
   */
  static generateMetrics(graph) {
    return {
      argumentDistribution: this.generateArgumentDistribution(graph),
      relationshipMatrix: this.generateRelationshipMatrix(graph),
      qualityDistribution: this.generateQualityDistribution(graph),
      confidenceDistribution: this.generateConfidenceDistribution(graph),
      dialecticalProgress: this.trackDialecticalProgress(graph)
    };
  }
  
  /**
   * Generates scoring report
   */
  static generateScoringReport(graph) {
    const scores = {
      individualArguments: {},
      argumentTypes: {},
      overallDialogue: this.calculateDialogueScore(graph)
    };
    
    // Score individual arguments
    graph.arguments.forEach(arg => {
      const evaluation = Evaluator.evaluateArgument(arg, graph);
      scores.individualArguments[arg.id] = {
        score: evaluation.score,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses
      };
    });
    
    // Score by argument type
    const types = ['thesis', 'antithesis', 'synthesis', 'objection', 'rebuttal'];
    types.forEach(type => {
      const typeArgs = graph.arguments.filter(arg => arg.type === type);
      if (typeArgs.length > 0) {
        const avgScore = typeArgs.reduce((acc, arg) => {
          const eval = Evaluator.evaluateArgument(arg, graph);
          return acc + eval.score;
        }, 0) / typeArgs.length;
        scores.argumentTypes[type] = avgScore;
      }
    });
    
    return scores;
  }
  
  /**
   * Generates visualizations
   */
  static generateVisualizations(graph) {
    return {
      graphVisualization: GraphVisualizer.generateMermaidGraph(graph),
      dotGraph: GraphVisualizer.generateDotGraph(graph),
      htmlVisualization: GraphVisualizer.generateHtmlVisualization(graph),
      asciiDiagram: GraphVisualizer.generateAsciiGraph(graph)
    };
  }
  
  /**
   * Formats report in specified format
   */
  static formatReport(report, format) {
    switch (format.toLowerCase()) {
      case 'markdown':
        return this.formatAsMarkdown(report);
      case 'html':
        return this.formatAsHTML(report);
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'text':
        return this.formatAsText(report);
      default:
        return this.formatAsMarkdown(report);
    }
  }
  
  /**
   * Formats report as Markdown
   */
  static formatAsMarkdown(report) {
    const lines = [];
    
    // Title and metadata
    lines.push('# Structured Argumentation Analysis Report');
    lines.push('');
    lines.push(`Generated: ${report.metadata.timestamp}`);
    lines.push(`Arguments: ${report.metadata.argumentCount} | Relationships: ${report.metadata.relationshipCount}`);
    lines.push('');
    
    // Executive Summary
    lines.push('## Executive Summary');
    lines.push('');
    lines.push(report.summary.overview);
    lines.push('');
    
    // Main arguments
    if (report.summary.mainArguments.length > 0) {
      lines.push('### Main Arguments');
      lines.push('');
      report.summary.mainArguments.forEach((arg, idx) => {
        lines.push(`${idx + 1}. **${arg.claim}** (${arg.type})`);
        lines.push(`   - Confidence: ${arg.confidence}`);
      });
      lines.push('');
    }
    
    // Key conflicts
    if (report.summary.keyConflicts.length > 0) {
      lines.push('### Key Conflicts');
      lines.push('');
      report.summary.keyConflicts.forEach((conflict, idx) => {
        lines.push(`${idx + 1}. **${conflict.arg1.claim}** vs **${conflict.arg2.claim}**`);
        lines.push(`   - Reconcilable: ${conflict.reconcilable ? 'Yes' : 'No'}`);
      });
      lines.push('');
    }
    
    // Quality Analysis
    lines.push('## Quality Analysis');
    lines.push('');
    lines.push(`Overall Score: **${(report.quality.overallScore * 100).toFixed(1)}%**`);
    lines.push('');
    
    // Strengths
    lines.push('### Strengths');
    lines.push('');
    report.quality.strengths.forEach(strength => {
      lines.push(`- ${strength}`);
    });
    lines.push('');
    
    // Weaknesses
    lines.push('### Weaknesses');
    lines.push('');
    report.quality.weaknesses.forEach(weakness => {
      lines.push(`- ${weakness}`);
    });
    lines.push('');
    
    // Recommendations
    lines.push('### Recommendations');
    lines.push('');
    report.quality.recommendations.forEach(rec => {
      lines.push(`- ${rec}`);
    });
    lines.push('');
    
    // Argument Analysis
    lines.push('## Individual Argument Analysis');
    lines.push('');
    
    // Group arguments by type
    const types = ['thesis', 'antithesis', 'synthesis', 'objection', 'rebuttal'];
    types.forEach(type => {
      const typeArgs = report.arguments.filter(arg => arg.type === type);
      if (typeArgs.length > 0) {
        lines.push(`### ${type.charAt(0).toUpperCase() + type.slice(1)} Arguments`);
        lines.push('');
        
        typeArgs.forEach(arg => {
          lines.push(`#### [${arg.id}] ${arg.evaluation.claim}`);
          lines.push('');
          lines.push(`- **Overall Score**: ${(arg.evaluation.score * 100).toFixed(1)}%`);
          lines.push(`- **Confidence**: ${arg.evaluation.confidence}`);
          lines.push('');
          
          if (arg.evaluation.strengths.length > 0) {
            lines.push('**Strengths**:');
            arg.evaluation.strengths.forEach(s => lines.push(`- ${s}`));
            lines.push('');
          }
          
          if (arg.evaluation.weaknesses.length > 0) {
            lines.push('**Weaknesses**:');
            arg.evaluation.weaknesses.forEach(w => lines.push(`- ${w}`));
            lines.push('');
          }
        });
      }
    });
    
    // Visualizations
    if (report.visualizations) {
      lines.push('## Argument Structure Visualization');
      lines.push('');
      lines.push('```mermaid');
      lines.push(report.visualizations.graphVisualization);
      lines.push('```');
      lines.push('');
    }
    
    // Metrics
    if (report.metrics) {
      lines.push('## Detailed Metrics');
      lines.push('');
      lines.push('### Argument Distribution');
      lines.push('');
      Object.entries(report.metrics.argumentDistribution).forEach(([type, count]) => {
        lines.push(`- ${type}: ${count}`);
      });
      lines.push('');
    }
    
    return lines.join('\n');
  }
  
  /**
   * Identifies main arguments
   */
  static identifyMainArguments(graph) {
    // Main arguments are typically:
    // 1. Root arguments (no parent arguments)
    // 2. High confidence arguments
    // 3. Arguments referenced by many others
    
    const rootArgs = graph.arguments.filter(arg => {
      const respondents = graph.getResponders(arg.id);
      return respondents.length === 0; // No responses to this argument
    });
    
    const highConfidenceArgs = graph.arguments.filter(arg => arg.confidence >= 0.7);
    const frequentlyReferencedArgs = this.findMostReferencedArguments(graph);
    
    // Combine and deduplicate
    const mainArgs = new Set();
    rootArgs.forEach(arg => mainArgs.add(arg));
    highConfidenceArgs.forEach(arg => mainArgs.add(arg));
    frequentlyReferencedArgs.forEach(arg => mainArgs.add(arg));
    
    return Array.from(mainArgs).slice(0, 5); // Top 5 main arguments
  }
  
  /**
   * Identifies key conflicts
   */
  static identifyKeyConflicts(graph) {
    const conflicts = [];
    
    graph.adjacencyList.forEach((relations, fromId) => {
      const fromArg = graph.getArgument(fromId);
      relations.contradicts.forEach(toId => {
        const toArg = graph.getArgument(toId);
        
        // Check if this is a significant conflict
        if (fromArg.confidence > 0.5 && toArg.confidence > 0.5) {
          conflicts.push({
            arg1: fromArg,
            arg2: toArg,
            reconcilable: this.isConflictReconcilable(fromArg, toArg, graph)
          });
        }
      });
    });
    
    return conflicts.slice(0, 3); // Top 3 key conflicts
  }
  
  /**
   * Calculates overall quality score
   */
  static calculateOverallQualityScore(metrics) {
    // Weighted average of quality metrics
    const weights = {
      logicalCoherence: 0.25,
      evidentialSupport: 0.2,
      dialogicDepth: 0.2,
      synthesisQuality: 0.15,
      completeness: 0.2
    };
    
    let score = 0;
    Object.entries(weights).forEach(([metric, weight]) => {
      score += metrics[metric] * weight;
    });
    
    return score;
  }
  
  /**
   * Generates recommendations
   */
  static generateRecommendations(graph, qualityMetrics) {
    const recommendations = [];
    
    // Analyze weaknesses and create recommendations
    if (qualityMetrics.logicalCoherence < 0.5) {
      recommendations.push('Strengthen logical connections between premises and conclusions');
    }
    
    if (qualityMetrics.evidentialSupport < 0.5) {
      recommendations.push('Add more evidence and data to support claims');
    }
    
    if (qualityMetrics.dialogicDepth < 0.5) {
      recommendations.push('Engage more deeply with opposing arguments');
    }
    
    if (qualityMetrics.synthesisQuality < 0.5) {
      recommendations.push('Develop higher quality syntheses that better integrate perspectives');
    }
    
    // Check for missing argument types
    const missingTypes = this.identifyMissingArgumentTypes(graph);
    if (missingTypes.length > 0) {
      recommendations.push(`Consider adding ${missingTypes.join(', ')} arguments to complete the dialectic`);
    }
    
    // Check for unaddressed arguments
    const unaddressed = this.findUnaddressedArguments(graph);
    if (unaddressed.length > 0) {
      recommendations.push(`Address the following arguments: ${unaddressed.slice(0, 3).map(a => a.id).join(', ')}`);
    }
    
    return recommendations;
  }
  
  /**
   * Assesses logical coherence
   */
  static assessLogicalCoherence(graph) {
    let totalScore = 0;
    let count = 0;
    
    graph.arguments.forEach(arg => {
      const evaluation = Evaluator.evaluateArgument(arg, graph);
      totalScore += evaluation.logicalScore;
      count++;
    });
    
    return count > 0 ? totalScore / count : 0;
  }
  
  /**
   * Assesses dialogic depth
   */
  static assessDialogicDepth(graph) {
    // Measure response depth and engagement
    const depths = [];
    
    graph.arguments.forEach(arg => {
      const depth = this.calculateArgumentDepth(arg, graph);
      depths.push(depth);
    });
    
    if (depths.length === 0) return 0;
    
    const avgDepth = depths.reduce((a, b) => a + b, 0) / depths.length;
    const maxDepth = Math.max(...depths);
    
    return (avgDepth / 3 + maxDepth / 5) / 2; // Normalized score
  }
  
  /**
   * Tracks dialectical progress
   */
  static trackDialecticalProgress(graph) {
    const progress = [];
    
    // Sort arguments by creation order (if available)
    const sortedArgs = [...graph.arguments].sort((a, b) => {
      if (a.id < b.id) return -1;
      return 1;
    });
    
    // Track evolution of argument types over time
    let cumulative = {
      thesis: 0,
      antithesis: 0,
      synthesis: 0,
      objection: 0,
      rebuttal: 0
    };
    
    sortedArgs.forEach(arg => {
      cumulative[arg.type]++;
      progress.push({
        argumentId: arg.id,
        type: arg.type,
        cumulative: { ...cumulative }
      });
    });
    
    return progress;
  }
  
  // Helper methods
  static countRelationships(graph) {
    let count = 0;
    graph.adjacencyList.forEach(relations => {
      count += relations.supports.length + relations.contradicts.length;
      if (relations.respondsTo) count++;
    });
    return count;
  }
  
  static countArgumentTypes(graph) {
    const counts = {};
    graph.arguments.forEach(arg => {
      counts[arg.type] = (counts[arg.type] || 0) + 1;
    });
    return counts;
  }
  
  static findMostReferencedArguments(graph) {
    const references = {};
    
    graph.adjacencyList.forEach((relations, fromId) => {
      relations.supports.forEach(toId => {
        references[toId] = (references[toId] || 0) + 1;
      });
      relations.contradicts.forEach(toId => {
        references[toId] = (references[toId] || 0) + 1;
      });
      if (relations.respondsTo) {
        references[relations.respondsTo] = (references[relations.respondsTo] || 0) + 1;
      }
    });
    
    return Object.entries(references)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => graph.getArgument(id));
  }
}

module.exports = ReportGenerator;