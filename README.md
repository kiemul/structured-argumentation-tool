# Structured Argumentation Tool

A comprehensive tool for systematic dialectical reasoning and argument analysis. This tool helps analyze complex questions through formal argumentation structures, facilitating the creation, critique, and synthesis of competing arguments.

## Features

- **Argument Creation**: Create formal arguments with claims, premises, and conclusions
- **Relationship Mapping**: Define relationships between arguments (support, contradict, respond)
- **Dialectical Engine**: Automatic generation of syntheses and counter-arguments
- **Argument Evaluation**: Smart scoring of argument quality and logical coherence
- **Visualization**: Multiple visualization formats (ASCII, Mermaid, DOT)
- **Reporting**: Comprehensive analysis reports with metrics and recommendations
- **Import/Export**: Save and load argument graphs for later analysis

## Installation

```bash
git clone https://github.com/kiemul/structured-argumentation-tool.git
cd structured-argumentation-tool
npm install
```

## Quick Start

```javascript
const { StructuredArgumentationTool } = require('./src/index');

// Create a new instance
const tool = new StructuredArgumentationTool();

// Create a thesis argument
const thesis = tool.createArgument(
  "All employees should have flexible working hours",
  ["Flexibility improves work-life balance", "Happier employees are more productive"],
  "Therefore, flexible working hours benefit both employees and employers",
  "thesis",
  0.85
);

// Generate a visualization
console.log(tool.visualize('ascii'));

// Generate a comprehensive report
const report = tool.generateReport('markdown');
console.log(report);
```

## Core Concepts

### Argument Types

1. **Thesis**: Initial proposition or claim
2. **Antithesis**: Counter-argument opposing a thesis
3. **Synthesis**: Argument that reconciles conflicting perspectives
4. **Objection**: Challenge to specific premises or conclusions
5. **Rebuttal**: Response defending against objections

### Relationship Types

- **Support**: One argument strengthens another
- **Contradict**: One argument opposes another
- **Respond**: Direct response to another argument

## Examples

### Basic Usage

```javascript
const tool = new StructuredArgumentationTool();

// Create arguments
const arg1 = tool.createArgument("Claim", ["Premise 1"], "Conclusion", "thesis", 0.8);
const arg2 = tool.createArgument("Counter-claim", ["Premise 2"], "Counter-conclusion", "antithesis", 0.7);

// Add relationship
tool.addRelationship(arg2.id, arg1.id, 'contradict');

// Visualize
console.log(tool.visualize());
```

### Advanced Example

See `examples/advanced-example.js` for a complex carbon policy debate analysis.

## Project Structure

```
structured-argumentation-tool/
├── src/
│   ├── core/                # Core argument and graph structures
│   ├── analysis/            # Evaluation and synthesis modules
│   ├── visualization/       # Visualization and reporting tools
│   └── index.js            # Main tool interface
├── examples/                # Usage examples
├── tests/                   # Unit tests
└── package.json
```

## API Reference

### StructuredArgumentationTool

#### Methods

- `createArgument(claim, premises, conclusion, type, confidence)`: Create a new argument
- `addRelationship(fromId, toId, type)`: Add relationship between arguments
- `suggestNextArguments()`: Get AI-suggested follow-up arguments
- `synthesize(argumentIds)`: Generate synthesis from multiple arguments
- `visualize(format)`: Generate visual representation
- `generateReport(format)`: Generate analysis report
- `export()`: Export argument data
- `import(data)`: Import argument data

### Visualization Formats

- `ascii`: Text-based visualization
- `mermaid`: Mermaid.js graph syntax
- `dot`: GraphViz DOT format
- `html`: Interactive HTML visualization

### Report Formats

- `markdown`: Comprehensive markdown report
- `html`: HTML report with embedded visualizations
- `json`: Raw data export
- `text`: Plain text summary

## Testing

```bash
npm test
```

## Examples

Run the basic example:

```bash
npm run example
```

Run the advanced example:

```bash
node examples/advanced-example.js
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Use Cases

- **Policy Analysis**: Analyze competing policy proposals
- **Ethical Dilemmas**: Explore different moral perspectives
- **Scientific Debates**: Map out competing hypotheses and evidence
- **Educational Tools**: Teaching critical thinking and logic
- **Decision Making**: Structure complex decision processes

## License

MIT

## Support

For support, please create an issue in the GitHub repository.

## Acknowledgments

This tool facilitates structured dialectical reasoning inspired by classical argumentation theory and modern critical thinking frameworks.
