/**
 * This entry file is for rspack plugin.
 *
 * @module
 */

import { Unused } from './index.ts'

/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.js
 * module.exports = {
 *  plugins: [require('unplugin-unused/rspack')()],
 * }
 * ```
 */
const rspack = Unused.rspack as typeof Unused.rspack
export default rspack
export { rspack as 'module.exports' }
