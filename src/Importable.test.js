import path from 'path';
import Importable from './Importable';

describe('Prettier = new Importable()', () => {
  const Prettier = new Importable(
    import('prettier'),
    async modules => {
      const [prettier] = modules;

      const options = await prettier.resolveConfig(path.resolve(__dirname, '../.prettierrc.json'));

      return {
        options,
        initializedAt: new Date(),
      };
    },
    async (modules, initializationResults) => {
      const [prettier] = modules;

      return {
        format: str =>
          prettier.format(str, {
            parser: 'babel',
            ...initializationResults.options,
          }),
        ...initializationResults,
      };
    },
  );

  it('imports prettier and initializes it once', async () => {
    const prettiers = await Promise.all([Prettier.import(), Prettier.import()]);

    expect(prettiers[0].initializedAt).toBe(prettiers[1].initializedAt);
  });

  it('initializes correctly', async () => {
    const prettier = await Prettier.import();

    expect(prettier.options).toEqual({
      printWidth: 100,
      singleQuote: true,
      trailingComma: 'all',
    });
  });

  it('can be used like normal', async () => {
    const prettier = await Prettier.import();

    expect(prettier.format('const cry="Forth Eorlingas"')).toBe("const cry = 'Forth Eorlingas';\n");
  });
});
