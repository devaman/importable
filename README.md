# ‹ importable › [![npm](https://img.shields.io/npm/v/importable.svg)](https://www.npmjs.com/package/importable) [![GitHub](https://img.shields.io/github/license/michaelwm/importable.svg)](https://github.com/michaelwm/importable/blob/master/LICENSE)

Safely lazy load and initialize packages across your app

## Why?

Lazy loading is great, but as soon as you need to do anything more than import a single package, it can get messy. With Importable, you can import the packages you need, initialize them, and use them like normal; all while making sure your packages are only initialized once.

## Usage

Install using your favorite package manager

```bash
yarn add importable
```

Create an Importable package

```js
import Importable from 'importable';

const LazyPackage = new Importable(
  // import the packages you need
  [import('lazy-package'), import('lazy-config')],

  // initialize them
  async modules => {
    const [lazyPackage, lazyConfig] = modules;

    lazyPackage.initialize({ apiKey: lazyConfig.apiKey });
  },

  // and return them ready to use
  async modules => {
    const [lazyPackage] = modules;

    return lazyPackage;
  },
);

export default LazyPackage;
```

Import your package with `await` and use it like normal

```js
import LazyPackage from '../importables/LazyPackage';

const asyncFunction = async () => {
  // get your package
  const lazyPackage = await LazyPackage.import();

  // use it like normal
  lazyPackage.doSomething();
};

// and do it as often as you like
asyncFunction();
asyncFunction();
asyncFunction();
```

Importable ensures your package i

See the [test cases](https://github.com/michaelwm/importable/blob/master/src/Importable.test.js) for more in depth usage.
