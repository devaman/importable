class Importable {
  constructor(imports, initialize, map) {
    this.imports = Array.isArray(imports) ? imports : [imports];
    this.initialize = initialize;
    this.map = map;

    this.awaitingInitialization = [];
  }

  awaitInitialization(modules) {
    return new Promise(resolve => {
      if (this.initialized) {
        resolve(this.initializationResults);
      }

      if (this.begunInitialization) {
        this.awaitingInitialization.push(resolve);
      }

      this.begunInitialization = true;

      this.initialize(modules).then(initializationResults => {
        this.initializationResults = initializationResults;
        this.initialized = true;

        resolve(initializationResults);
        this.awaitingInitialization.forEach(resolve => resolve(initializationResults));
      });
    });
  }

  import() {
    return Promise.all(this.imports).then(modules =>
      this.awaitInitialization(modules).then(initializationResults =>
        this.map(modules, initializationResults),
      ),
    );
  }
}

export default Importable;
