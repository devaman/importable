class Importable {
  constructor(modules, initialize, map) {
    this.modules = Array.isArray(modules) ? modules : [modules];
    this.initialize = initialize;
    this.map = map;
  }

  import() {
    return Promise.all(this.modules).then(modules => {
      if (!this.initialized) {
        if (!this.initialization) {
          this.initialization = new Promise(() => {
            this.initialized = true;
          });

          return this.initialize(modules).then(initializationResults => {
            this.initializationResults = initializationResults;

            this.initialization.then();

            return this.map(modules, initializationResults);
          });
        }

        return this.initialization.then(() => this.map(modules, this.initializationResults));
      }

      return this.map(modules, this.initializationResults);
    });
  }
}

export default Importable;
