/**
 * Synthesizer generates synthesis arguments from multiple perspectives
 */
class Synthesizer {
  /**
   * Generates a synthesis from multiple arguments
   */
  static generateSynthesis(arguments, graph) {
    if (arguments.length < 2) {
      throw new Error('Synthesis requires at least 2 arguments');
    }
    
    const analysis = this.analyzeArguments(arguments);
    const synthesis = this.constructSynthesis(arguments, analysis);
    
    // Validate synthesis quality
    const quality = this.evaluateSynthesisQuality(synthesis, arguments);
    
    return {
      synthesis,
      quality,
      analysis
    };
  }
  
  /**
   * Analyzes multiple arguments for synthesis opportunities
   */
  static analyzeArguments(arguments) {
    const analysis = {
      sharedThemes: [],
      complementaryPremises: [],
      conflictingClaims: [],
      reconcilableDifferences: [],
      irreconcilableDifferences: []
    };
    
    // Find shared themes
    const allThemes = arguments.flatMap(arg => this.extractThemes(arg));
    const themeFrequency = {};
    
    allThemes.forEach(theme => {
      themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
    });
    
    analysis.sharedThemes = Object.entries(themeFrequency)
      .filter(([theme, count]) => count > 1)
      .map(([theme]) => theme);
    
    // Find complementary and conflicting elements
    for (let i = 0; i < arguments.length; i++) {
      for (let j = i + 1; j < arguments.length; j++) {
        const arg1 = arguments[i];
        const arg2 = arguments[j];
        
        // Check for complementary premises
        const complementary = this.findComplementaryPremises(arg1, arg2);
        analysis.complementaryPremises.push(...complementary);
        
        // Check for conflicting claims
        if (this.areClaimsConflicting(arg1.claim, arg2.claim)) {
          analysis.conflictingClaims.push({
            arg1Id: arg1.id,
            arg2Id: arg2.id,
            reconcilable: this.isReconcilable(arg1, arg2)
          });
        }
      }
    }
    
    // Categorize differences
    analysis.conflictingClaims.forEach(conflict => {
      if (conflict.reconcilable) {
        analysis.reconcilableDifferences.push(conflict);
      } else {
        analysis.irreconcilableDifferences.push(conflict);
      }
    });
    
    return analysis;
  }
  
  /**
   * Constructs synthesis argument from analysis
   */
  static constructSynthesis(arguments, analysis) {
    const synthesis = {
      claim: this.synthesizeClaim(arguments, analysis),
      premises: this.synthesizePremises(arguments, analysis),
      conclusion: this.synthesizeConclusion(arguments, analysis),
      type: 'synthesis',
      supports: arguments.map(arg => arg.id),
      confidence: this.calculateSynthesisConfidence(arguments, analysis)
    };
    
    return synthesis;
  }
  
  /**
   * Synthesizes claim from multiple arguments
   */
  static synthesizeClaim(arguments, analysis) {
    // Use shared themes for synthesis
    const primaryTheme = analysis.sharedThemes[0] || 'multiple perspectives';
    
    // Integrate conflicting claims if reconcilable
    if (analysis.reconcilableDifferences.length > 0) {
      return `Integrating ${primaryTheme} while balancing ${analysis.reconcilableDifferences.length} distinct perspectives`;
    }
    
    return `Comprehensive integration of ${primaryTheme} from ${arguments.length} perspectives`;
  }
  
  /**
   * Synthesizes premises from multiple arguments
   */
  static synthesizePremises(arguments, analysis) {
    const synthesizedPremises = [];
    
    // Add shared premises
    const sharedPremises = this.findSharedPremises(arguments);
    sharedPremises.forEach(premise => {
      synthesizedPremises.push(`Commonly accepted: ${premise}`);
    });
    
    // Add complementary premises
    analysis.complementaryPremises.forEach(comp => {
      synthesizedPremises.push(`${comp.from} complements ${comp.to}`);
    });
    
    // Add reconciled differences
    analysis.reconcilableDifferences.forEach(diff => {
      const arg1 = arguments.find(a => a.id === diff.arg1Id);
      const arg2 = arguments.find(a => a.id === diff.arg2Id);
      synthesizedPremises.push(`Balancing ${arg1.claim} with ${arg2.claim}`);
    });
    
    return synthesizedPremises;
  }
  
  /**
   * Synthesizes conclusion from multiple arguments
   */
  static synthesizeConclusion(arguments, analysis) {
    let conclusion = '';
    
    if (analysis.irreconcilableDifferences.length === 0) {
      conclusion = 'A unified approach that successfully integrates all perspectives';
    } else {
      conclusion = `A balanced solution that maximizes common ground while acknowledging ${analysis.irreconcilableDifferences.length} irreconcilable differences`;
    }
    
    // Add consideration of shared themes
    if (analysis.sharedThemes.length > 0) {
      conclusion += `, emphasizing ${analysis.sharedThemes.join(', ')}`;
    }
    
    return conclusion;
  }
  
  /**
   * Calculates confidence in synthesis
   */
  static calculateSynthesisConfidence(arguments, analysis) {
    let confidence = 0;
    
    // Base confidence from original arguments
    const avgConfidence = arguments.reduce((acc, curr) => acc + curr.confidence, 0) / arguments.length;
    confidence += avgConfidence * 0.4;
    
    // Boost for shared themes
    confidence += Math.min(analysis.sharedThemes.length * 0.1, 0.3);
    
    // Boost for complementary premises
    confidence += Math.min(analysis.complementaryPremises.length * 0.05, 0.2);
    
    // Penalty for irreconcilable differences
    confidence -= Math.min(analysis.irreconcilableDifferences.length * 0.1, 0.3);
    
    return Math.max(0, Math.min(1, confidence));
  }
  
  /**
   * Evaluates synthesis quality
   */
  static evaluateSynthesisQuality(synthesis, originalArguments) {
    const quality = {
      coverage: 0,
      coherence: 0,
      advancement: 0,
      overallScore: 0
    };
    
    // Coverage: How well does synthesis cover original arguments?
    const coveredConcepts = this.calculateConceptCoverage(synthesis, originalArguments);
    quality.coverage = coveredConcepts;
    
    // Coherence: Internal consistency of synthesis
    quality.coherence = this.evaluateCoherence(synthesis);
    
    // Advancement: Does synthesis advance understanding beyond originals?
    quality.advancement = this.evaluateAdvancement(synthesis, originalArguments);
    
    // Overall score
    quality.overallScore = (quality.coverage * 0.4 + quality.coherence * 0.3 + quality.advancement * 0.3);
    
    return quality;
  }
  
  /**
   * Extracts themes from argument
   */
  static extractThemes(argument) {
    const themes = new Set();
    const text = `${argument.claim} ${argument.premises.join(' ')} ${argument.conclusion}`;
    
    // Extract key phrases (simplified)
    const phrases = text.match(/[A-Za-z\s]+(?=[.,;:]|\s+(?:and|but|however|therefore))/g) || [];
    phrases.forEach(phrase => {
      if (phrase.length > 10 && phrase.length < 50) {
        themes.add(phrase.trim());
      }
    });
    
    return Array.from(themes);
  }
  
  /**
   * Finds complementary premises between arguments
   */
  static findComplementaryPremises(arg1, arg2) {
    const complementary = [];
    
    arg1.premises.forEach(premise1 => {
      arg2.premises.forEach(premise2 => {
        if (this.areComplementary(premise1, premise2)) {
          complementary.push({
            from: premise1,
            to: premise2
          });
        }
      });
    });
    
    return complementary;
  }
  
  /**
   * Checks if two premises are complementary
   */
  static areComplementary(premise1, premise2) {
    // Simplified check: different but related concepts
    const keywords1 = this.extractKeywords(premise1);
    const keywords2 = this.extractKeywords(premise2);
    
    const overlap = keywords1.filter(kw => keywords2.includes(kw)).length;
    const total = keywords1.length + keywords2.length;
    
    // Premises are complementary if they share some keywords but aren't identical
    return overlap > 0 && overlap < Math.min(keywords1.length, keywords2.length);
  }
  
  /**
   * Checks if claims are conflicting
   */
  static areClaimsConflicting(claim1, claim2) {
    // Simple negation check
    const negationIndicators = /\b(not|no|never|none|isn't|aren't|doesn't|don't)\b/i;
    
    const hasNegation1 = negationIndicators.test(claim1);
    const hasNegation2 = negationIndicators.test(claim2);
    
    // Check for opposite stances on similar topics
    if (hasNegation1 !== hasNegation2) {
      const keywords1 = this.extractKeywords(claim1);
      const keywords2 = this.extractKeywords(claim2);
      const overlap = keywords1.filter(kw => keywords2.includes(kw)).length;
      
      return overlap > keywords1.length / 2;
    }
    
    return false;
  }
  
  /**
   * Checks if conflicting arguments are reconcilable
   */
  static isReconcilable(arg1, arg2) {
    // Check for nuance and qualification in arguments
    const hasQualifiers1 = this.hasQualifiers(arg1);
    const hasQualifiers2 = this.hasQualifiers(arg2);
    
    // Check for shared underlying values
    const sharedValues = this.findSharedValues(arg1, arg2);
    
    return (hasQualifiers1 || hasQualifiers2) && sharedValues.length > 0;
  }
  
  /**
   * Checks if argument contains qualifiers
   */
  static hasQualifiers(argument) {
    const qualifiers = /\b(might|could|possibly|perhaps|likely|probably|tends?\s+to|sometimes|often)\b/i;
    const text = `${argument.claim} ${argument.premises.join(' ')} ${argument.conclusion}`;
    return qualifiers.test(text);
  }
  
  /**
   * Finds shared values between arguments
   */
  static findSharedValues(arg1, arg2) {
    const values = ['justice', 'equality', 'freedom', 'security', 'prosperity', 'sustainability', 'welfare'];
    const sharedValues = [];
    
    const text1 = `${arg1.claim} ${arg1.premises.join(' ')} ${arg1.conclusion}`.toLowerCase();
    const text2 = `${arg2.claim} ${arg2.premises.join(' ')} ${arg2.conclusion}`.toLowerCase();
    
    values.forEach(value => {
      if (text1.includes(value) && text2.includes(value)) {
        sharedValues.push(value);
      }
    });
    
    return sharedValues;
  }
  
  /**
   * Finds shared premises between arguments
   */
  static findSharedPremises(arguments) {
    const premiseCounts = {};
    
    arguments.forEach(arg => {
      arg.premises.forEach(premise => {
        const normalized = premise.toLowerCase().trim();
        premiseCounts[normalized] = (premiseCounts[normalized] || 0) + 1;
      });
    });
    
    return Object.entries(premiseCounts)
      .filter(([_, count]) => count > 1)
      .map(([premise]) => premise);
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
   * Calculates concept coverage of synthesis
   */
  static calculateConceptCoverage(synthesis, originalArguments) {
    const synthesisKeywords = new Set(this.extractKeywords(
      `${synthesis.claim} ${synthesis.premises.join(' ')} ${synthesis.conclusion}`
    ));
    
    let totalKeywords = 0;
    let coveredKeywords = 0;
    
    originalArguments.forEach(arg => {
      const argKeywords = this.extractKeywords(
        `${arg.claim} ${arg.premises.join(' ')} ${arg.conclusion}`
      );
      totalKeywords += argKeywords.length;
      argKeywords.forEach(kw => {
        if (synthesisKeywords.has(kw)) {
          coveredKeywords++;
        }
      });
    });
    
    return totalKeywords > 0 ? coveredKeywords / totalKeywords : 0;
  }
  
  /**
   * Evaluates coherence of synthesis
   */
  static evaluateCoherence(synthesis) {
    let score = 0;
    
    // Check claim-premise coherence
    const claimKeywords = this.extractKeywords(synthesis.claim);
    const premiseKeywords = synthesis.premises.flatMap(p => this.extractKeywords(p));
    const claimPremiseOverlap = claimKeywords.filter(kw => premiseKeywords.includes(kw)).length;
    
    score += (claimPremiseOverlap / claimKeywords.length) * 0.4;
    
    // Check premise-conclusion coherence
    const conclusionKeywords = this.extractKeywords(synthesis.conclusion);
    const premiseConclusionOverlap = conclusionKeywords.filter(kw => premiseKeywords.includes(kw)).length;
    
    score += (premiseConclusionOverlap / conclusionKeywords.length) * 0.4;
    
    // Check for logical flow
    score += 0.2; // Assume basic logical flow
    
    return Math.min(1, score);
  }
  
  /**
   * Evaluates if synthesis advances understanding
   */
  static evaluateAdvancement(synthesis, originalArguments) {
    // Count novel insights in synthesis
    const synthesisText = `${synthesis.claim} ${synthesis.premises.join(' ')} ${synthesis.conclusion}`;
    const synConcepts = new Set(this.extractKeywords(synthesisText));
    
    let novelConcepts = 0;
    const allOriginalConcepts = new Set();
    
    originalArguments.forEach(arg => {
      const argText = `${arg.claim} ${arg.premises.join(' ')} ${arg.conclusion}`;
      const argConcepts = this.extractKeywords(argText);
      argConcepts.forEach(c => allOriginalConcepts.add(c));
    });
    
    synConcepts.forEach(concept => {
      if (!allOriginalConcepts.has(concept)) {
        novelConcepts++;
      }
    });
    
    // Also check for integration patterns
    const integrationIndicators = /\b(integrat|combin|balanc|reconcil|harmoniz)\w*/gi;
    const integrationMatches = synthesisText.match(integrationIndicators) || [];
    
    const noveltyScore = novelConcepts / synConcepts.size;
    const integrationScore = Math.min(integrationMatches.length / 5, 1);
    
    return (noveltyScore * 0.6 + integrationScore * 0.4);
  }
}

module.exports = Synthesizer;
