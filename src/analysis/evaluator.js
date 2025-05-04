/**
 * Evaluator analyzes argument quality and identifies strengths/weaknesses
 */
class Evaluator {
  /**
   * Evaluates an argument for strengths and weaknesses
   */
  static evaluateArgument(argument, graph) {
    const evaluation = {
      strengths: [],
      weaknesses: [],
      score: 0,
      supportScore: 0,
      logicalScore: 0,
      evidenceScore: 0
    };
    
    // Evaluate logical structure
    evaluation.logicalScore = this.evaluateLogicalStructure(argument);
    
    // Evaluate evidence quality
    evaluation.evidenceScore = this.evaluateEvidence(argument);
    
    // Evaluate support from other arguments
    evaluation.supportScore = this.evaluateSupport(argument, graph);
    
    // Identify specific strengths
    evaluation.strengths = this.identifyStrengths(argument, evaluation);
    
    // Identify specific weaknesses
    evaluation.weaknesses = this.identifyWeaknesses(argument, evaluation);
    
    // Calculate overall score
    evaluation.score = this.calculateOverallScore(evaluation);
    
    return evaluation;
  }
  
  /**
   * Evaluates the logical structure of an argument
   */
  static evaluateLogicalStructure(argument) {
    let score = 0;
    
    // Check if conclusion follows from premises
    const conclusionKeywords = this.extractKeywords(argument.conclusion);
    const premiseKeywords = argument.premises.flatMap(p => this.extractKeywords(p));
    
    const keywordOverlap = conclusionKeywords.filter(kw => premiseKeywords.includes(kw)).length;
    score += keywordOverlap / conclusionKeywords.length * 0.4;
    
    // Check for logical fallacies
    const fallacies = this.detectFallacies(argument);
    score -= fallacies.length * 0.1;
    
    // Check for coherence
    if (this.checkCoherence(argument)) {
      score += 0.3;
    }
    
    // Check for completeness
    if (argument.premises.length >= 2) {
      score += 0.2;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Evaluates the quality of evidence in premises
   */
  static evaluateEvidence(argument) {
    let score = 0;
    
    argument.premises.forEach(premise => {
      // Check for empirical data
      if (this.containsData(premise)) {
        score += 0.2;
      }
      
      // Check for citations or references
      if (this.containsCitations(premise)) {
        score += 0.15;
      }
      
      // Check for qualifiers (shows nuance)
      if (this.containsQualifiers(premise)) {
        score += 0.1;
      }
    });
    
    return Math.min(1, score);
  }
  
  /**
   * Evaluates support from other arguments
   */
  static evaluateSupport(argument, graph) {
    const supporters = graph.getSupporters(argument.id);
    const contradictors = graph.getContradictors(argument.id);
    
    let score = 0;
    
    // Count supporting arguments
    score += Math.min(supporters.length * 0.2, 0.6);
    
    // Penalize for contradictions
    score -= Math.min(contradictors.length * 0.15, 0.45);
    
    // Consider confidence of supporters
    const avgSupporterConfidence = supporters.reduce((acc, curr) => acc + curr.confidence, 0) / 
                                   (supporters.length || 1);
    score += avgSupporterConfidence * 0.2;
    
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Identifies strengths of an argument
   */
  static identifyStrengths(argument, evaluation) {
    const strengths = [];
    
    if (evaluation.logicalScore > 0.7) {
      strengths.push("Strong logical structure");
    }
    
    if (evaluation.evidenceScore > 0.6) {
      strengths.push("Well-supported with evidence");
    }
    
    if (evaluation.supportScore > 0.5) {
      strengths.push("Strong support from related arguments");
    }
    
    if (argument.confidence > 0.8) {
      strengths.push("High confidence level");
    }
    
    if (argument.premises.length >= 3) {
      strengths.push("Comprehensive premise set");
    }
    
    return strengths;
  }
  
  /**
   * Identifies weaknesses of an argument
   */
  static identifyWeaknesses(argument, evaluation) {
    const weaknesses = [];
    
    if (evaluation.logicalScore < 0.4) {
      weaknesses.push("Weak logical connection between premises and conclusion");
    }
    
    if (evaluation.evidenceScore < 0.3) {
      weaknesses.push("Insufficient evidence or data");
    }
    
    if (evaluation.supportScore < 0.2) {
      weaknesses.push("Lack of supporting arguments");
    }
    
    if (argument.confidence < 0.4) {
      weaknesses.push("Low confidence level");
    }
    
    if (argument.premises.length < 2) {
      weaknesses.push("Insufficient premises");
    }
    
    // Check for overreliance on single premise
    if (argument.premises.length === 1) {
      weaknesses.push("Overly dependent on single premise");
    }
    
    return weaknesses;
  }
  
  /**
   * Calculates overall argument score
   */
  static calculateOverallScore(evaluation) {
    const weights = {
      logical: 0.4,
      evidence: 0.3,
      support: 0.3
    };
    
    return (
      evaluation.logicalScore * weights.logical +
      evaluation.evidenceScore * weights.evidence +
      evaluation.supportScore * weights.support
    );
  }
  
  /**
   * Extracts keywords from text
   */
  static extractKeywords(text) {
    const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'is', 'was', 'for', 'it']);
    return text.toLowerCase()
               .split(/\W+/)
               .filter(word => word.length > 2 && !stopWords.has(word));
  }
  
  /**
   * Detects common logical fallacies
   */
  static detectFallacies(argument) {
    const fallacies = [];
    const text = argument.claim + ' ' + argument.premises.join(' ') + ' ' + argument.conclusion;
    
    // Check for ad hominem
    if (text.match(/\bpeople\s+who\s+(believe|think|say)\b/i)) {
      fallacies.push('Possible ad hominem');
    }
    
    // Check for straw man
    if (text.match(/\b(nobody|no one|everyone)\s+(thinks|believes|says)\b/i)) {
      fallacies.push('Possible straw man');
    }
    
    // Check for false dichotomy
    if (text.match(/\b(either|only)\s+.*\bor\b/i)) {
      fallacies.push('Possible false dichotomy');
    }
    
    return fallacies;
  }
  
  /**
   * Checks coherence of argument
   */
  static checkCoherence(argument) {
    // Simple coherence check: look for keyword overlap
    const claimKeywords = this.extractKeywords(argument.claim);
    const premiseKeywords = argument.premises.flatMap(p => this.extractKeywords(p));
    const conclusionKeywords = this.extractKeywords(argument.conclusion);
    
    const overlap = claimKeywords.filter(kw => 
      premiseKeywords.includes(kw) || conclusionKeywords.includes(kw)
    ).length;
    
    return overlap >= 2;
  }
  
  /**
   * Checks if text contains data or statistics
   */
  static containsData(text) {
    return /\b\d+(\.\d+)?(%|\s*(percent|percentage|data|study|research|evidence))/i.test(text);
  }
  
  /**
   * Checks if text contains citations
   */
  static containsCitations(text) {
    return /\(.*\d{4}.*\)|et\s+al\.|according\s+to/i.test(text);
  }
  
  /**
   * Checks if text contains qualifiers
   */
  static containsQualifiers(text) {
    return /\b(might|may|could|possibly|perhaps|likely|probably|generally|tends?\s+to)\b/i.test(text);
  }
}

module.exports = Evaluator;
