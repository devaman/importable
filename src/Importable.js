class Importable {
  constructor(imports, initialize, map) {
    this.imports = Array.isArray(imports) ? imports : [imports];
    this.initialize = initialize;
    this.map = map;

    this.waiting = [];
  }

  awaitInitialization(modules) {
    return new Promise(resolve => {
      if (this.initialized) {
        return resolve(this.initializationResults);
      }

      if (this.begunInitialization) {
        return this.waiting.push(resolve);
      }

      this.begunInitialization = true;

      return this.initialize(modules).then(initializationResults => {
        this.initializationResults = initializationResults;
        this.initialized = true;

        resolve(initializationResults);

        if (this.waiting.length) {
          this.waiting.forEach(res => res(initializationResults));
          this.waiting = [];
        }
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
