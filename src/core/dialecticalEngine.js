const ArgumentGraph = require('./argumentGraph');
const Argument = require('./argument');

/**
 * DialecticalEngine orchestrates the dialectical reasoning process
 */
class DialecticalEngine {
  constructor() {
    this.graph = new ArgumentGraph();
    this.dialecticHistory = [];
  }
  
  /**
   * Adds an argument and tracks dialectical progression
   */
  addArgument(argumentData) {
    const argument = this.graph.addArgument(argumentData);
    
    // Log dialectical step
    this.dialecticHistory.push({
      timestamp: new Date(),
      action: 'added',
      argumentId: argument.id,
      argumentType: argument.type,
      context: this.getCurrentContext(argument)
    });
    
    return argument;
  }
  
  /**
   * Gets the current context of the dialectic
   */
  getCurrentContext(currentArgument) {
    const context = {
      thesis: [],
      antithesis: [],
      synthesis: [],
      objections: [],
      rebuttals: []
    };
    
    this.graph.arguments.forEach(arg => {
      context[arg.type].push(arg.id);
    });
    
    return context;
  }
  
  /**
   * Suggests the next argument type needed
   */
  suggestNextArgumentType() {
    const types = {
      thesis: 0,
      antithesis: 0,
      synthesis: 0,
      objection: 0,
      rebuttal: 0
    };
    
    this.graph.arguments.forEach(arg => {
      types[arg.type]++;
    });
    
    // Decision logic for next argument type
    if (types.thesis === 0) return 'thesis';
    if (types.thesis > 0 && types.antithesis === 0) return 'antithesis';
    if (types.thesis > 0 && types.antithesis > 0 && types.synthesis === 0) return 'synthesis';
    if (types.objection < types.thesis + types.antithesis) return 'objection';
    if (types.rebuttal < types.objection) return 'rebuttal';
    
    // If all types are covered, suggest synthesis for higher-level integration
    return 'synthesis';
  }
  
  /**
   * Finds arguments ready for synthesis
   */
  findSynthesisCandidates() {
    const theses = this.graph.getArgumentsByType('thesis');
    const antitheses = this.graph.getArgumentsByType('antithesis');
    
    const candidates = [];
    
    theses.forEach(thesis => {
      const relatedAntitheses = antitheses.filter(anti => 
        anti.respondsTo === thesis.id ||
        anti.contradicts.includes(thesis.id) ||
        thesis.contradicts.includes(anti.id)
      );
      
      relatedAntitheses.forEach(antithesis => {
        const existingSynthesis = Array.from(this.graph.arguments.values()).find(arg =>
          arg.type === 'synthesis' &&
          arg.supports.includes(thesis.id) &&
          arg.supports.includes(antithesis.id)
        );
        
        if (!existingSynthesis) {
          candidates.push({
            thesis: thesis.id,
            antithesis: antithesis.id,
            potential: this.calculateSynthesisPotential(thesis, antithesis)
          });
        }
      });
    });
    
    return candidates.sort((a, b) => b.potential - a.potential);
  }
  
  /**
   * Calculates synthesis potential between two arguments
   */
  calculateSynthesisPotential(arg1, arg2) {
    let potential = 0;
    
    // Check for complementary premises
    const sharedConcepts = this.findSharedConcepts(arg1.premises, arg2.premises);
    potential += sharedConcepts.length * 0.3;
    
    // Check for resolvable differences
    const resolvableDiffs = this.findResolvableDifferences(arg1, arg2);
    potential += resolvableDiffs * 0.4;
    
    // Consider confidence levels
    potential += (arg1.confidence + arg2.confidence) * 0.15;
    
    // Consider argument quality (based on strengths vs weaknesses)
    const arg1Quality = (arg1.strengths.length - arg1.weaknesses.length) / 
                        (arg1.strengths.length + arg1.weaknesses.length + 1);
    const arg2Quality = (arg2.strengths.length - arg2.weaknesses.length) / 
                        (arg2.strengths.length + arg2.weaknesses.length + 1);
    potential += (arg1Quality + arg2Quality) * 0.15;
    
    return Math.min(potential, 1);
  }
  
  /**
   * Finds shared concepts between premises
   */
  findSharedConcepts(premises1, premises2) {
    const concepts1 = this.extractConcepts(premises1);
    const concepts2 = this.extractConcepts(premises2);
    
    return concepts1.filter(concept => concepts2.includes(concept));
  }
  
  /**
   * Extracts key concepts from premises (simplified)
   */
  extractConcepts(premises) {
    const allWords = premises.join(' ').toLowerCase().split(/\W+/);
    const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'is', 'was', 'for']);
    const concepts = allWords.filter(word => 
      word.length > 3 && 
      !stopWords.has(word)
    );
    
    return [...new Set(concepts)];
  }
  
  /**
   * Finds resolvable differences between arguments
   */
  findResolvableDifferences(arg1, arg2) {
    // Simplified: count non-contradictory differences
    let resolvable = 0;
    
    if (!arg1.contradicts.includes(arg2.id) && !arg2.contradicts.includes(arg1.id)) {
      resolvable += 0.5;
    }
    
    if (Math.abs(arg1.confidence - arg2.confidence) < 0.3) {
      resolvable += 0.3;
    }
    
    if (this.findSharedConcepts(arg1.premises, arg2.premises).length > 0) {
      resolvable += 0.2;
    }
    
    return resolvable;
  }
  
  /**
   * Gets dialectical progression summary
   */
  getDialecticalSummary() {
    const summary = {
      totalArguments: this.graph.arguments.size,
      byType: {},
      relationships: {
        supports: 0,
        contradicts: 0,
        responds: 0
      },
      synthesisOpportunities: this.findSynthesisCandidates().length,
      nextRecommendedType: this.suggestNextArgumentType(),
      history: this.dialecticHistory
    };
    
    // Count arguments by type
    this.graph.arguments.forEach(arg => {
      summary.byType[arg.type] = (summary.byType[arg.type] || 0) + 1;
    });
    
    // Count relationships
    this.graph.adjacencyList.forEach(rel => {
      summary.relationships.supports += rel.supports.length;
      summary.relationships.contradicts += rel.contradicts.length;
      if (rel.respondsTo) summary.relationships.responds++;
    });
    
    return summary;
  }
  
  /**
   * Generates synthesis argument from candidates
   */
  generateSynthesis(thesisId, antithesisId) {
    const thesis = this.graph.getArgument(thesisId);
    const antithesis = this.graph.getArgument(antithesisId);
    
    if (!thesis || !antithesis) {
      throw new Error('Invalid argument IDs for synthesis');
    }
    
    // Extract shared premises
    const sharedConcepts = this.findSharedConcepts(thesis.premises, antithesis.premises);
    
    // Create synthesis claim
    const synthesisClaim = `Integration of "${thesis.claim}" and "${antithesis.claim}"`;
    
    // Combine relevant premises
    const synthesisPremises = [
      ...thesis.premises.filter(p => sharedConcepts.some(c => p.toLowerCase().includes(c))),
      ...antithesis.premises.filter(p => sharedConcepts.some(c => p.toLowerCase().includes(c)))
    ];
    
    // Create synthesis conclusion
    const synthesisConclusion = `A balanced approach that incorporates strengths from both perspectives: ${thesis.conclusion} and ${antithesis.conclusion}`;
    
    return {
      claim: synthesisClaim,
      premises: synthesisPremises,
      conclusion: synthesisConclusion,
      type: 'synthesis',
      supports: [thesisId, antithesisId],
      confidence: Math.min(thesis.confidence, antithesis.confidence) + 0.1
    };
  }
}

module.exports = DialecticalEngine;
