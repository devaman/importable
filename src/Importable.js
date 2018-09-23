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
        return resolve(this.initializationResults);
      }

      if (this.begunInitialization) {
        return this.awaitingInitialization.push(resolve);
      }

      this.begunInitialization = true;

      return this.initialize(modules).then(initializationResults => {
        this.initializationResults = initializationResults;
        this.initialized = true;

        resolve(initializationResults);

        this.awaitingInitialization.forEach(res => res(initializationResults));
        this.awaitingInitialization = [];
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
