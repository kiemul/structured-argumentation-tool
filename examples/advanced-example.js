const { StructuredArgumentationTool } = require('../src/index');

// Create a new instance for complex argumentation
const tool = new StructuredArgumentationTool();

console.log("=== Advanced Structured Argumentation Example ===\n");

// Simulate a complex debate about climate policy
console.log("Scenario: Analyzing Carbon Tax vs Carbon Trading Policies\n");

// Initial thesis on carbon tax
const carbonTaxThesis = tool.createArgument(
  "A carbon tax is the most effective policy for reducing emissions",
  [
    "Carbon taxes provide price certainty for businesses",
    "Revenue can fund green initiatives",
    "Simple to implement and understand"
  ],
  "Therefore, governments should implement carbon taxes immediately",
  "thesis",
  0.8
);

// Antithesis supporting carbon trading
const carbonTradingAntithesis = tool.createArgument(
  "Emissions trading schemes are superior to carbon taxes",
  [
    "Trading allows market efficiency in emission reductions",
    "Provides certainty on total emission reductions",
    "More flexible for businesses to adapt"
  ],
  "Therefore, carbon trading should be preferred over taxation",
  "antithesis",
  0.75
);

// Add contradiction
tool.addRelationship(carbonTradingAntithesis.id, carbonTaxThesis.id, 'contradict');

// Supporting arguments for carbon tax
const taxSimplicitySupport = tool.createArgument(
  "Administrative simplicity favors carbon taxation",
  [
    "No complex market infrastructure needed",
    "Harder to manipulate than trading markets",
    "Lower implementation costs"
  ],
  "Carbon taxes have significant administrative advantages",
  "objection",
  0.7
);

const taxStabilitySupport = tool.createArgument(
  "Carbon taxes provide stable revenue streams",
  [
    "Predictable government income for green investments",
    "Enables long-term planning for climate initiatives",
    "Reduces budget volatility"
  ],
  "Stable revenue enhances climate policy effectiveness",
  "rebuttal", 
  0.65
);

// Supporting arguments for carbon trading
const tradingEfficiencySupport = tool.createArgument(
  "Market mechanisms optimize emission reduction costs",
  [
    "Allows trading between low and high-cost reducers",
    "Discovers true cost of emissions through price discovery",
    "Incentivizes innovation in green technologies"
  ],
  "Trading maximizes economic efficiency in climate policy",
  "objection",
  0.8
);

// Add support relationships
tool.addRelationship(taxSimplicitySupport.id, carbonTaxThesis.id, 'support');
tool.addRelationship(taxStabilitySupport.id, carbonTaxThesis.id, 'support');
tool.addRelationship(tradingEfficiencySupport.id, carbonTradingAntithesis.id, 'support');

// Create a synthesis argument
const policyMixSynthesis = tool.createArgument(
  "A hybrid approach combining carbon pricing with trading achieves both efficiency and stability",
  [
    "Carbon price floor provides stability from taxation",
    "Trading mechanisms optimize efficiency above floor price",
    "Hybrid system captures advantages of both approaches",
    "Provides policy flexibility for different sectors"
  ],
  "A combined carbon pricing system maximizes climate policy effectiveness",
  "synthesis",
  0.85
);

// Connect synthesis to both main arguments
tool.addRelationship(policyMixSynthesis.id, carbonTaxThesis.id, 'support');
tool.addRelationship(policyMixSynthesis.id, carbonTradingAntithesis.id, 'support');

// Generate suggestions for next arguments
console.log("=== Suggested Next Arguments ===");
const suggestions = tool.suggestNextArguments();
suggestions.forEach((suggestion, index) => {
  console.log(`${index + 1}. ${suggestion.claim} [${suggestion.type}]`);
});
console.log();

// Visualize the complex argument structure
console.log("=== Argument Structure Visualization ===");
console.log(tool.visualize('ascii'));
console.log();

// Generate comprehensive report
console.log("=== Comprehensive Analysis Report ===");
const report = tool.generateReport('markdown');
console.log(report);

// Export for interactive analysis
const exportedData = tool.export();
require('fs').writeFileSync('examples/carbon-policy-debate.json', JSON.stringify(exportedData, null, 2));
console.log("\nExported debate data to carbon-policy-debate.json");
