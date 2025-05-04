const Argument = require('../src/core/argument');

describe('Argument', () => {
  test('should create argument with basic properties', () => {
    const arg = new Argument(
      "Test claim",
      ["Premise 1", "Premise 2"],
      "Test conclusion",
      "thesis",
      0.8
    );
    
    expect(arg.claim).toBe("Test claim");
    expect(arg.premises).toEqual(["Premise 1", "Premise 2"]);
    expect(arg.conclusion).toBe("Test conclusion");
    expect(arg.type).toBe("thesis");
    expect(arg.confidence).toBe(0.8);
  });
  
  test('should generate random ID', () => {
    const arg1 = new Argument("Claim 1", [], "Conclusion 1", "thesis", 0.7);
    const arg2 = new Argument("Claim 2", [], "Conclusion 2", "thesis", 0.7);
    
    expect(arg1.id).not.toBe(arg2.id);
    expect(arg1.id).toMatch(/arg_[a-z0-9]{8}/);
  });
  
  test('should create empty strengths and weaknesses arrays', () => {
    const arg = new Argument("Test", [], "Test", "synthesis", 0.9);
    
    expect(Array.isArray(arg.strengths)).toBe(true);
    expect(Array.isArray(arg.weaknesses)).toBe(true);
    expect(arg.strengths.length).toBe(0);
    expect(arg.weaknesses.length).toBe(0);
  });
  
  test('should accept valid argument types', () => {
    const validTypes = ['thesis', 'antithesis', 'synthesis', 'objection', 'rebuttal'];
    
    validTypes.forEach(type => {
      const arg = new Argument("Test", [], "Test", type, 0.5);
      expect(arg.type).toBe(type);
    });
  });
  
  test('should throw error for invalid argument type', () => {
    expect(() => {
      new Argument("Test", [], "Test", "invalid", 0.5);
    }).toThrow("Invalid argument type");
  });
  
  test('should accept confidence between 0 and 1', () => {
    const arg = new Argument("Test", [], "Test", "thesis", 0.75);
    expect(arg.confidence).toBe(0.75);
  });
  
  test('should throw error for confidence out of range', () => {
    expect(() => {
      new Argument("Test", [], "Test", "thesis", 1.5);
    }).toThrow("Confidence must be between 0 and 1");
    
    expect(() => {
      new Argument("Test", [], "Test", "thesis", -0.1);
    }).toThrow("Confidence must be between 0 and 1");
  });
});
