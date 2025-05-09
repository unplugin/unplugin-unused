/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { Unused } from './index.ts'

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import Unused from 'unplugin-unused/rollup'
 *
 * export default {
 *   plugins: [Unused()],
 * }
 * ```
 */
const rollup = Unused.rollup as typeof Unused.rollup
export default rollup
export { rollup as 'module.exports' }
