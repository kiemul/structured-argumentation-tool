/**
 * Core Argument class representing a structured argument with claims, premises, and conclusions
 */
class Argument {
  constructor(data) {
    this.validateArgument(data);
    
    this.id = data.argumentId;
    this.claim = data.claim;
    this.premises = data.premises;
    this.conclusion = data.conclusion;
    this.type = data.argumentType;
    this.confidence = data.confidence;
    
    // Relationships
    this.respondsTo = data.respondsTo || null;
    this.supports = data.supports || [];
    this.contradicts = data.contradicts || [];
    
    // Evaluation
    this.strengths = data.strengths || [];
    this.weaknesses = data.weaknesses || [];
    
    // Metadata
    this.createdAt = new Date();
    this.lastModified = new Date();
  }
  
  /**
   * Validates the argument structure
   */
  validateArgument(data) {
    if (!data.argumentId) throw new Error('Argument ID is required');
    if (!data.claim) throw new Error('Claim is required');
    if (!Array.isArray(data.premises)) throw new Error('Premises must be an array');
    if (!data.conclusion) throw new Error('Conclusion is required');
    if (!data.argumentType) throw new Error('Argument type is required');
    
    const validTypes = ['thesis', 'antithesis', 'synthesis', 'objection', 'rebuttal'];
    if (!validTypes.includes(data.argumentType)) {
      throw new Error(`Invalid argument type. Must be one of: ${validTypes.join(', ')}`);
    }
    
    if (data.confidence !== undefined && (data.confidence < 0 || data.confidence > 1)) {
      throw new Error('Confidence must be between 0 and 1');
    }
  }
  
  /**
   * Updates the argument's confidence level
   */
  updateConfidence(newConfidence) {
    if (newConfidence < 0 || newConfidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }
    this.confidence = newConfidence;
    this.lastModified = new Date();
  }
  
  /**
   * Adds a strength to the argument
   */
  addStrength(strength) {
    this.strengths.push(strength);
    this.lastModified = new Date();
  }
  
  /**
   * Adds a weakness to the argument
   */
  addWeakness(weakness) {
    this.weaknesses.push(weakness);
    this.lastModified = new Date();
  }
  
  /**
   * Returns a string representation of the argument
   */
  toString() {
    return `${this.type.toUpperCase()}: ${this.claim}\nPremises: ${this.premises.join(', ')}\nConclusion: ${this.conclusion}\nConfidence: ${this.confidence}`;
  }
  
  /**
   * Converts the argument to a JSON object
   */
  toJSON() {
    return {
      id: this.id,
      claim: this.claim,
      premises: this.premises,
      conclusion: this.conclusion,
      type: this.type,
      confidence: this.confidence,
      respondsTo: this.respondsTo,
      supports: this.supports,
      contradicts: this.contradicts,
      strengths: this.strengths,
      weaknesses: this.weaknesses,
      createdAt: this.createdAt,
      lastModified: this.lastModified
    };
  }
}

module.exports = Argument;
