import path from 'node:path'
import process from 'node:process'
import { createFilter } from '@rollup/pluginutils'
import escapeStringRegexp from 'escape-string-regexp'
import jsTokens from 'js-tokens'
import pc from 'picocolors'
import { readPackageJSON, resolvePackageJSON } from 'pkg-types'
import { createUnplugin, type UnpluginInstance } from 'unplugin'
import { resolveOptions, type Options } from './core/options'

const plugin: UnpluginInstance<Options | undefined, false> = createUnplugin(
  (rawOptions = {}) => {
    const options = resolveOptions(rawOptions)
    const filter = createFilter(options.include, options.exclude)
    const deps = new Set<string>()
    const depsRegex: Record<string, RegExp> = {}
    let pkgPath: string

    const name = 'unplugin-unused'
    return {
      name,
      enforce: 'pre',

      async buildStart() {
        options.root ||= process.cwd()
        pkgPath = path.resolve(await resolvePackageJSON(options.root))
        const pkg = await readPackageJSON(pkgPath)

        for (const kind of options.depKinds) {
          const dependencies = Object.keys(pkg[kind] || {})
          for (const dep of dependencies) {
            if (options.ignore.includes(dep) || deps.has(dep)) continue
            deps.add(dep)
            depsRegex[dep] = new RegExp(`["']${escapeStringRegexp(dep)}['"\\/]`)
          }
        }
      },

      transformInclude(id) {
        return filter(id)
      },

      transform(code, id): undefined {
        const tokens = jsTokens(code, { jsx: /\.[jt]sx?$/.test(id) })
        for (const { type, value } of tokens) {
          if (type.endsWith('Comment')) continue
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
          const message =
            `Unused ${pc.cyan(deps.size)} dependencies found: \n\n` +
            `${Array.from(deps)
              .map((dep) => `${pc.yellow('-')} ${pc.bold(dep)}`)
              .join('\n')}\n\n` +
            `You can remove them from ${pkgPath}`

          const error = new Error(message)
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
