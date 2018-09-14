import path from 'path';
import Importable from './Importable';

describe('Prettier = new Importable()', () => {
  const Prettier = new Importable(
    import('prettier'),
    async modules => {
      const [prettier] = modules;

      const options = await prettier.resolveConfig(path.resolve(__dirname, '../.prettierrc.json'));

      return {
        options: {
          parser: 'babylon',
          ...options,
        },
        initializedAt: new Date(),
      };
    },
    async (modules, initializationResults) => {
      const [prettier] = modules;

      return {
        format: prettier.format,
        ...initializationResults,
      };
    },
  );

  it('imports prettier and initializes it', async () => {
    const prettier = await Prettier.import();

    expect(prettier.options).toEqual({
      parser: 'babylon',
      printWidth: 100,
      singleQuote: true,
      trailingComma: 'all',
    });
  });

  it('only initializes once', async () => {
    const prettier1 = await Prettier.import();
    const prettier2 = await Prettier.import();

    expect(prettier1.initializedAt).toBe(prettier2.initializedAt);
  });

  it('can be used like normal', async () => {
    const prettier = await Prettier.import();

    expect(prettier.format('const cry="Forth Eorlingas"', prettier.options)).toBe(
      "const cry = 'Forth Eorlingas';\n",
    );
  });
});
