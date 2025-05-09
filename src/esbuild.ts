/**
 * This entry file is for esbuild plugin.
 *
 * @module
 */

import { Unused } from './index.ts'

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * import { build } from 'esbuild'
 *
 * build({
 *   plugins: [require('unplugin-unused/esbuild')()],
 * })
 * ```
 */
const esbuild = Unused.esbuild as typeof Unused.esbuild
export default esbuild
export { esbuild as 'module.exports' }
