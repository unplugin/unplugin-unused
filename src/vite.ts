/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { Unused } from './index.ts'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Unused from 'unplugin-unused/vite'
 *
 * export default defineConfig({
 *   plugins: [Unused()],
 * })
 * ```
 */
const vite = Unused.vite as typeof Unused.vite
export default vite
export { vite as 'module.exports' }
