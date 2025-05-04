# Structured Argumentation Tool

A detailed tool for systematic dialectical reasoning and argument analysis. This tool facilitates the creation, critique, and synthesis of competing arguments through formal argumentation structures.

## Features

- **Formal Argument Structure**: Break down arguments into claims, premises, and conclusions
- **Dialectical Progression**: Track relationships between arguments for thesis-antithesis-synthesis
- **Argument Evaluation**: Assess argument strengths and weaknesses
- **Visual Argument Mapping**: Visualize argument relationships and structures
- **Confidence Tracking**: Monitor confidence levels in arguments
- **Comprehensive Analysis**: Includes objections, rebuttals, and synthesis capabilities

## Core Concepts

1. **Argument Types**:
   - Thesis: Main argument or claim
   - Antithesis: Counter-argument challenging the thesis
   - Synthesis: Resolution combining aspects of thesis and antithesis
   - Objection: Specific critique of an argument
   - Rebuttal: Response to an objection

2. **Argument Structure**:
   - Claims: Central propositions being argued
   - Premises: Supporting evidence or assumptions
   - Conclusions: Logical consequences of accepting claims
   - Confidence: Level of confidence in the argument (0.0-1.0)

3. **Relationships**:
   - Supports: Arguments that strengthen other arguments
   - Contradicts: Arguments that oppose other arguments
   - Responds to: Arguments addressing other arguments

## Use Cases

- Evaluating competing perspectives and claims
- Analyzing complex ethical dilemmas
- Assessing policy proposals with multiple stakeholders
- Exploring scientific hypotheses and counter-arguments
- Academic debate and philosophical analysis

## Installation

```bash
npm install structured-argumentation-tool
```

## Usage Example

```javascript
const { StructuredArgumentation } = require('structured-argumentation-tool');

const tool = new StructuredArgumentation();

// Create a thesis argument
tool.addArgument({
  argumentId: "thesis-1",
  claim: "Renewable energy is the best solution for climate change",
  premises: [
    "Renewable energy sources are sustainable",
    "They produce minimal greenhouse gas emissions",
    "Technology has made them increasingly cost-effective"
  ],
  conclusion: "Countries should prioritize renewable energy investment",
  argumentType: "thesis",
  confidence: 0.8
});

// Add an antithesis
tool.addArgument({
  argumentId: "antithesis-1",
  claim: "Nuclear energy offers better immediate solutions",
  premises: [
    "Nuclear has higher energy density than renewables",
    "Nuclear can provide consistent baseload power",
    "Modern reactors are significantly safer"
  ],
  conclusion: "Nuclear should be the priority for immediate climate action",
  argumentType: "antithesis",
  respondsTo: "thesis-1",
  contradicts: ["thesis-1"],
  confidence: 0.7
});

// Get argument visualization
const visualization = tool.visualizeArguments();
```

## Architecture

```
structured-argumentation-tool/
├── src/
│   ├── core/
│   │   ├── argument.js          # Core argument data structure
│   │   ├── argumentGraph.js     # Graph representation
│   │   └── dialecticalEngine.js # Logic engine
│   ├── analysis/
│   │   ├── evaluator.js         # Argument evaluation
│   │   └── synthesizer.js       # Synthesis generation
│   └── visualization/
│       ├── graphVisualizer.js   # Argument network visualization
│       └── reportGenerator.js   # Generate argument reports
├── tests/
├── docs/
└── examples/
```

## API Reference

### Main Methods

- `addArgument(argumentData)`: Add a new argument to the system
- `evaluateArgument(argumentId)`: Evaluate strengths and weaknesses
- `findSynthesis(argumentIds)`: Find synthesis between arguments
- `visualizeArguments()`: Generate visual representation
- `generateReport()`: Create comprehensive argument analysis

### Argument Structure

```typescript
interface Argument {
  argumentId: string;
  claim: string;
  premises: string[];
  conclusion: string;
  argumentType: 'thesis' | 'antithesis' | 'synthesis' | 'objection' | 'rebuttal';
  confidence: number;
  respondsTo?: string;
  supports?: string[];
  contradicts?: string[];
  strengths?: string[];
  weaknesses?: string[];
}
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by formal argumentation theory and dialectical reasoning
- Built for academic, professional, and educational applications

