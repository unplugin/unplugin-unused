import process from 'node:process'
import { createFilter } from '@rollup/pluginutils'
import escapeStringRegexp from 'escape-string-regexp'
import jsTokens from 'js-tokens'
import { readPackageJSON } from 'pkg-types'
import { createUnplugin, type UnpluginInstance } from 'unplugin'
import { resolveOptions, type Options } from './core/options'

const plugin: UnpluginInstance<Options | undefined, false> = createUnplugin(
  (rawOptions = {}) => {
    const options = resolveOptions(rawOptions)
    const filter = createFilter(options.include, options.exclude)
    const deps = new Set<string>()
    const depsRegex: Record<string, RegExp> = {}

    const name = 'unplugin-unused'
    return {
      name,
      enforce: 'pre',

      async buildStart() {
        options.root ||= process.cwd()
        const pkg = await readPackageJSON(options.root)
        const dependencies = Object.keys(pkg.dependencies || {})
        for (const dep of dependencies) {
          deps.add(dep)
          depsRegex[dep] = new RegExp(`["']${escapeStringRegexp(dep)}['"\\/]`)
        }
      },

      transformInclude(id) {
        return filter(id)
      },

      transform(code, id): undefined {
        const tokens = jsTokens(code, { jsx: /\.[jt]sx?$/.test(id) })
        for (const { value } of tokens) {
          for (const dep of deps) {
            const regex = depsRegex[dep]
            if (regex.test(value)) {
              deps.delete(dep)
              break
            }
          }
        }
      },

      buildEnd() {
        if (deps.size) {
          const error = new Error(
            `Unused dependencies found: ${Array.from(deps).join(', ')}`,
          )
          if (options.level === 'error') {
            throw error
          } else {
            console.warn(error)
          }
        }
      },

      vite: {
        configResolved(config) {
          options.root ||= config.root
        },
      },
    }
  },
)

export default plugin
