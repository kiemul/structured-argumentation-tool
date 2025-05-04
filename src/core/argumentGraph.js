const Argument = require('./argument');

/**
 * ArgumentGraph manages the network of arguments and their relationships
 */
class ArgumentGraph {
  constructor() {
    this.arguments = new Map();
    this.adjacencyList = new Map();
  }
  
  /**
   * Adds an argument to the graph
   */
  addArgument(argumentData) {
    const argument = new Argument(argumentData);
    
    if (this.arguments.has(argument.id)) {
      throw new Error(`Argument with ID ${argument.id} already exists`);
    }
    
    this.arguments.set(argument.id, argument);
    this.adjacencyList.set(argument.id, {
      supports: [],
      contradicts: [],
      respondsTo: null
    });
    
    // Establish relationships
    if (argument.supports.length > 0) {
      argument.supports.forEach(supportedId => {
        this.addSupportsRelationship(argument.id, supportedId);
      });
    }
    
    if (argument.contradicts.length > 0) {
      argument.contradicts.forEach(contradictedId => {
        this.addContradictsRelationship(argument.id, contradictedId);
      });
    }
    
    if (argument.respondsTo) {
      this.addRespondsToRelationship(argument.id, argument.respondsTo);
    }
    
    return argument;
  }
  
  /**
   * Adds a "supports" relationship between arguments
   */
  addSupportsRelationship(supporterId, supportedId) {
    if (!this.arguments.has(supporterId) || !this.arguments.has(supportedId)) {
      throw new Error('Both arguments must exist in the graph');
    }
    
    const supporter = this.adjacencyList.get(supporterId);
    supporter.supports.push(supportedId);
  }
  
  /**
   * Adds a "contradicts" relationship between arguments
   */
  addContradictsRelationship(contradictorId, contradictedId) {
    if (!this.arguments.has(contradictorId) || !this.arguments.has(contradictedId)) {
      throw new Error('Both arguments must exist in the graph');
    }
    
    const contradictor = this.adjacencyList.get(contradictorId);
    contradictor.contradicts.push(contradictedId);
  }
  
  /**
   * Adds a "responds to" relationship between arguments
   */
  addRespondsToRelationship(responderId, respondeeId) {
    if (!this.arguments.has(responderId) || !this.arguments.has(respondeeId)) {
      throw new Error('Both arguments must exist in the graph');
    }
    
    const responder = this.adjacencyList.get(responderId);
    responder.respondsTo = respondeeId;
  }
  
  /**
   * Gets an argument by ID
   */
  getArgument(id) {
    return this.arguments.get(id);
  }
  
  /**
   * Gets all arguments of a specific type
   */
  getArgumentsByType(type) {
    return Array.from(this.arguments.values()).filter(arg => arg.type === type);
  }
  
  /**
   * Gets all arguments that support a given argument
   */
  getSupporters(argumentId) {
    return Array.from(this.arguments.values()).filter(arg => 
      arg.supports.includes(argumentId)
    );
  }
  
  /**
   * Gets all arguments that contradict a given argument
   */
  getContradictors(argumentId) {
    return Array.from(this.arguments.values()).filter(arg => 
      arg.contradicts.includes(argumentId)
    );
  }
  
  /**
   * Gets all arguments that respond to a given argument
   */
  getResponders(argumentId) {
    return Array.from(this.arguments.values()).filter(arg => 
      arg.respondsTo === argumentId
    );
  }
  
  /**
   * Finds paths between two arguments
   */
  findPaths(startId, endId, visited = new Set()) {
    if (startId === endId) return [[startId]];
    
    visited.add(startId);
    const paths = [];
    const connections = this.adjacencyList.get(startId);
    
    if (connections) {
      const allConnected = [
        ...connections.supports,
        ...connections.contradicts,
        ...(connections.respondsTo ? [connections.respondsTo] : [])
      ];
      
      for (const nextId of allConnected) {
        if (!visited.has(nextId)) {
          const subpaths = this.findPaths(nextId, endId, new Set(visited));
          subpaths.forEach(subpath => {
            paths.push([startId, ...subpath]);
          });
        }
      }
    }
    
    return paths;
  }
  
  /**
   * Exports the graph to JSON
   */
  toJSON() {
    return {
      arguments: Array.from(this.arguments.values()).map(arg => arg.toJSON()),
      relationships: Array.from(this.adjacencyList.entries()).map(([id, rel]) => ({
        argumentId: id,
        ...rel
      }))
    };
  }
}

module.exports = ArgumentGraph;
