# unplugin-unused

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Unit Test][unit-test-src]][unit-test-href]

Check unused dependencies.

## Installation

```bash
npm i -D unplugin-unused
```

## Usage

```ts
Unused({
  include: [/\.([cm]?[jt]sx?|vue)$/],
  exclude: [/node_modules/],
  level: 'warning', // or 'error'
  /**
   * Ignore some dependencies.
   */
  ignore: {
    peerDependencies: ['vue'],
  },
  // Or ignore all kinds of dependencies.
  // ignore: ['vue'],

  /**
   * Dependency kinds to check.
   */
  depKinds: ['dependencies', 'peerDependencies'],
})
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import UnpluginUnused from 'unplugin-unused/vite'

export default defineConfig({
  plugins: [UnpluginUnused()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import UnpluginUnused from 'unplugin-unused/rollup'

export default {
  plugins: [UnpluginUnused()],
}
```

<br></details>

<details>
<summary>Rolldown</summary><br>

```ts
// rolldown.config.js
import UnpluginUnused from 'unplugin-unused/rolldown'

export default {
  plugins: [UnpluginUnused()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'

build({
  plugins: [require('unplugin-unused/esbuild')()],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require('unplugin-unused/webpack')()],
}
```

<br></details>

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2024-PRESENT [Kevin Deng](https://github.com/sxzz)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unplugin-unused.svg
[npm-version-href]: https://npmjs.com/package/unplugin-unused
[npm-downloads-src]: https://img.shields.io/npm/dm/unplugin-unused
[npm-downloads-href]: https://www.npmcharts.com/compare/unplugin-unused?interval=30
[unit-test-src]: https://github.com/unplugin/unplugin-unused/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/unplugin/unplugin-unused/actions/workflows/unit-test.yml
