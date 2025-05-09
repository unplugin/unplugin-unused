/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import { Unused } from './index.ts'

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * module.exports = {
 *  plugins: [require('unplugin-unused/webpack')()],
 * }
 * ```
 */
const webpack = Unused.webpack as typeof Unused.webpack
export default webpack
export { webpack as 'module.exports' }
