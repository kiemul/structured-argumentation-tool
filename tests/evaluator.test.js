const Evaluator = require('../src/analysis/evaluator');
const Argument = require('../src/core/argument');
const ArgumentGraph = require('../src/core/argumentGraph');

describe('Evaluator', () => {
  let graph;
  let arg1, arg2, arg3;
  
  beforeEach(() => {
    graph = new ArgumentGraph();
    
    arg1 = new Argument(
      "Climate change is real",
      ["Global temperatures rising", "Ice caps melting"],
      "We must act now",
      "thesis",
      0.9
    );
    
    arg2 = new Argument(
      "Economic costs are minimal",
      ["Green tech creates jobs", "Prevents future damages"],
      "Investment is worthwhile",
      "thesis",
      0.7
    );
    
    arg3 = new Argument(
      "Transition costs outweigh benefits",
      ["Industry disruption", "Job losses in traditional sectors"],
      "We should delay action",
      "antithesis",
      0.5
    );
    
    graph.addArgument(arg1);
    graph.addArgument(arg2);
    graph.addArgument(arg3);
  });
  
  test('should evaluate single argument', () => {
    const evaluation = Evaluator.evaluateArgument(arg1, graph);
    
    expect(evaluation.logicalScore).toBeGreaterThan(0);
    expect(evaluation.evidentialScore).toBeGreaterThan(0);
    expect(evaluation.contextualScore).toBeGreaterThan(0);
    expect(evaluation.score).toBeGreaterThan(0);
    expect(Array.isArray(evaluation.strengths)).toBe(true);
    expect(Array.isArray(evaluation.weaknesses)).toBe(true);
  });
  
  test('should evaluate argument with relationships', () => {
    graph.addSupport(arg2.id, arg1.id);
    graph.addContradiction(arg3.id, arg1.id);
    
    const evaluation = Evaluator.evaluateArgument(arg1, graph);
    
    expect(evaluation.contextualScore).toBeGreaterThan(0.5);
    expect(evaluation.strengths).toContain("Well-supported by 1 argument(s)");
    expect(evaluation.weaknesses).toContain("Has 1 contradiction(s)");
  });
  
  test('should identify argument strengths', () => {
    arg1.confidence = 0.9;
    arg1.premises = ["Strong evidence 1", "Strong evidence 2", "Strong evidence 3"];
    
    const evaluation = Evaluator.evaluateArgument(arg1, graph);
    
    expect(evaluation.strengths.length).toBeGreaterThan(0);
    expect(evaluation.strengths).toContain("High confidence (0.9)");
    expect(evaluation.strengths).toContain("Well-supported with multiple premises");
  });
  
  test('should identify argument weaknesses', () => {
    arg1.confidence = 0.2;
    arg1.premises = [];
    
    const evaluation = Evaluator.evaluateArgument(arg1, graph);
    
    expect(evaluation.weaknesses.length).toBeGreaterThan(0);
    expect(evaluation.weaknesses).toContain("Low confidence (<0.5)");
    expect(evaluation.weaknesses).toContain("Lacks supporting premises");
  });
  
  test('should compute relationship strength matrix', () => {
    graph.addSupport(arg2.id, arg1.id);
    graph.addContradiction(arg3.id, arg2.id);
    
    const matrix = Evaluator.computeRelationshipStrengthMatrix(graph);
    
    expect(matrix[arg2.id]).toBeDefined();
    expect(matrix[arg2.id][arg1.id]).toBeGreaterThan(0);
    expect(matrix[arg3.id][arg2.id]).toBeLessThan(0);
  });
  
  test('should score argument paths', () => {
    graph.addSupport(arg2.id, arg1.id);
    
    const path = [arg2.id, arg1.id];
    const score = Evaluator.scoreArgumentPath(path, graph);
    
    expect(score).toBeGreaterThan(0);
  });
  
  test('should identify most influential arguments', () => {
    graph.addSupport(arg2.id, arg1.id);
    graph.addSupport(arg1.id, arg3.id);
    
    const influential = Evaluator.findMostInfluentialArguments(graph);
    
    expect(influential.length).toBeGreaterThan(0);
    expect(influential[0].id).toBe(arg1.id); // Most central argument
  });
});
