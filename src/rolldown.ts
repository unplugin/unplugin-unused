/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import { Unused } from './index.ts'

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import Unused from 'unplugin-unused/rolldown'
 *
 * export default {
 *   plugins: [Unused()],
 * }
 * ```
 */
const rolldown = Unused.rolldown as typeof Unused.rolldown
export default rolldown
export { rolldown as 'module.exports' }
