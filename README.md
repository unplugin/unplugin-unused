# unplugin-unused [![npm](https://img.shields.io/npm/v/unplugin-unused.svg)](https://npmjs.com/package/unplugin-unused)

[![Unit Test](https://github.com/unplugin/unplugin-unused/actions/workflows/unit-test.yml/badge.svg)](https://github.com/unplugin/unplugin-unused/actions/workflows/unit-test.yml)

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
  ignore: ['vue'],
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

[MIT](./LICENSE) License © 2024-PRESENT [三咲智子](https://github.com/sxzz)
