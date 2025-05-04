const Argument = require('./core/argument');
const ArgumentGraph = require('./core/argumentGraph');
const DialecticalEngine = require('./core/dialecticalEngine');
const Evaluator = require('./analysis/evaluator');
const Synthesizer = require('./analysis/synthesizer');
const GraphVisualizer = require('./visualization/graphVisualizer');
const ReportGenerator = require('./visualization/reportGenerator');

/**
 * StructuredArgumentationTool - Main interface for the tool
 */
class StructuredArgumentationTool {
  constructor() {
    this.graph = new ArgumentGraph();
    this.engine = new DialecticalEngine(this.graph);
  }
  
  /**
   * Create new argument
   */
  createArgument(claim, premises, conclusion, type, confidence) {
    const argument = new Argument(claim, premises, conclusion, type, confidence);
    this.graph.addArgument(argument);
    
    // Apply automatic evaluation
    const evaluation = Evaluator.evaluateArgument(argument, this.graph);
    argument.strengths = evaluation.strengths;
    argument.weaknesses = evaluation.weaknesses;
    
    // Check if automatic synthesis is needed
    if (this.engine.shouldSynthesize()) {
      const syntheses = this.engine.generateSyntheses();
      syntheses.forEach(synthesis => {
        this.graph.addArgument(synthesis);
      });
    }
    
    return argument;
  }
  
  /**
   * Add relationships between arguments
   */
  addRelationship(fromArgId, toArgId, type) {
    if (type === 'support') {
      this.graph.addSupport(fromArgId, toArgId);
    } else if (type === 'contradict') {
      this.graph.addContradiction(fromArgId, toArgId);
    } else if (type === 'respond') {
      this.graph.addResponse(fromArgId, toArgId);
    }
  }
  
  /**
   * Suggest next arguments
   */
  suggestNextArguments() {
    return this.engine.suggestNextArguments();
  }
  
  /**
   * Generate synthesis
   */
  synthesize(argumentIds) {
    const args = argumentIds.map(id => this.graph.getArgument(id));
    const result = Synthesizer.generateSynthesis(args, this.graph);
    
    const synthesisArg = new Argument(
      result.synthesis.claim,
      result.synthesis.premises,
      result.synthesis.conclusion,
      'synthesis',
      result.synthesis.confidence
    );
    
    this.graph.addArgument(synthesisArg);
    
    // Add relationships to supported arguments
    argumentIds.forEach(id => {
      this.graph.addSupport(synthesisArg.id, id);
    });
    
    return synthesisArg;
  }
  
  /**
   * Visualize argument graph
   */
  visualize(format = 'ascii') {
    return GraphVisualizer.generateGraph(this.graph, { format });
  }
  
  /**
   * Generate report
   */
  generateReport(format = 'markdown') {
    return ReportGenerator.generateReport(this.graph, { format });
  }
  
  /**
   * Get argument by ID
   */
  getArgument(id) {
    return this.graph.getArgument(id);
  }
  
  /**
   * Get all arguments
   */
  getAllArguments() {
    return this.graph.arguments;
  }
  
  /**
   * Import argument data
   */
  import(data) {
    if (data.arguments) {
      data.arguments.forEach(argData => {
        const arg = new Argument(
          argData.claim,
          argData.premises,
          argData.conclusion,
          argData.type,
          argData.confidence
        );
        if (argData.id) arg.id = argData.id;
        this.graph.addArgument(arg);
      });
    }
    
    if (data.relationships) {
      data.relationships.forEach(rel => {
        this.addRelationship(rel.from, rel.to, rel.type);
      });
    }
  }
  
  /**
   * Export argument data
   */
  export() {
    const data = {
      arguments: this.graph.arguments.map(arg => ({
        id: arg.id,
        claim: arg.claim,
        premises: arg.premises,
        conclusion: arg.conclusion,
        type: arg.type,
        confidence: arg.confidence,
        strengths: arg.strengths,
        weaknesses: arg.weaknesses
      })),
      relationships: []
    };
    
    this.graph.adjacencyList.forEach((relations, fromId) => {
      relations.supports.forEach(toId => {
        data.relationships.push({ from: fromId, to: toId, type: 'support' });
      });
      relations.contradicts.forEach(toId => {
        data.relationships.push({ from: fromId, to: toId, type: 'contradict' });
      });
      if (relations.respondsTo) {
        data.relationships.push({ from: fromId, to: relations.respondsTo, type: 'respond' });
      }
    });
    
    return data;
  }
}

// Export for use
module.exports = {
  StructuredArgumentationTool,
  Argument,
  ArgumentGraph,
  DialecticalEngine,
  Evaluator,
  Synthesizer,
  GraphVisualizer,
  ReportGenerator
};

// Also create a simple CLI interface for testing
if (require.main === module) {
  const tool = new StructuredArgumentationTool();
  
  // Example usage
  console.log("Structured Argumentation Tool");
  console.log("=============================");
  
  // Add a sample argument
  const thesis = tool.createArgument(
    "Renewable energy should be prioritized",
    ["Climate change is accelerating", "Fossil fuels are finite"],
    "Therefore, we must transition to renewable energy sources",
    "thesis",
    0.8
  );
  
  console.log("\nCreated thesis argument:", thesis.id);
  console.log("Visualization:\n", tool.visualize('ascii'));
  console.log("\nReport:\n", tool.generateReport());
}