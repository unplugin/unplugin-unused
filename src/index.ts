import path from 'node:path'
import process from 'node:process'
import escapeStringRegexp from 'escape-string-regexp'
import jsTokens from 'js-tokens'
import pc from 'picocolors'
import { readPackageJSON, resolvePackageJSON } from 'pkg-types'
import {
  createUnplugin,
  type UnpluginBuildContext,
  type UnpluginInstance,
} from 'unplugin'
import { createFilter } from 'unplugin-utils'
import { resolveOptions, type DepKind, type Options } from './core/options'

export type { DepKind, Options }

export const Unused: UnpluginInstance<Options | undefined, false> =
  createUnplugin((rawOptions = {}) => {
    const options = resolveOptions(rawOptions)
    const filter = createFilter(options.include, options.exclude)
    const depsRegex: Record<string, RegExp> = {}
    const depsState = new WeakMap<object, Set<string>>()
    let pkgPath: string
    const defaultKey: object = {}

    function getBuildId(context: UnpluginBuildContext): object {
      const native = context.getNativeBuildContext?.()
      if (!native) return defaultKey
      if (native.framework === 'esbuild') {
        return native.build
      }
      if (native.framework === 'rspack' || native.framework === 'webpack') {
        return native.compiler
      }
      if (native.framework === 'farm') {
        return native.context
      }
      return defaultKey
    }

    const name = 'unplugin-unused'
    return {
      name,
      enforce: 'pre',

      async buildStart() {
        options.root ||= process.cwd()
        pkgPath = path.resolve(await resolvePackageJSON(options.root))
        const pkg = await readPackageJSON(pkgPath)

        const deps = new Set<string>()
        for (const kind of options.depKinds) {
          const dependencies = Object.keys(pkg[kind] || {})
          for (const dep of dependencies) {
            const ignore = Array.isArray(options.ignore)
              ? options.ignore
              : options.ignore[kind] || []
            if (ignore.includes(dep) || deps.has(dep)) continue
            deps.add(dep)
            depsRegex[dep] = new RegExp(`["']${escapeStringRegexp(dep)}['"\\/]`)
          }
        }

        const buildId = getBuildId(this)
        depsState.set(buildId, deps)
      },

      transformInclude(id) {
        return filter(id)
      },

      transform(code, id): undefined {
        const tokens = jsTokens(code, { jsx: /\.[jt]sx?$/.test(id) })
        const deps = depsState.get(getBuildId(this)) || new Set()
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

      buildEnd(...args: any[]) {
        const hasError = !!args[0]
        // already has error
        if (hasError) return

        const id = getBuildId(this)
        const deps = depsState.get(id)
        if (deps?.size) {
          const message =
            `Unused ${pc.cyan(deps.size)} dependencies found: \n\n` +
            `${Array.from(deps)
              .map((dep) => `- ${pc.bold(dep)}`)
              .join('\n')}\n\n` +
            `You can remove them from ${pkgPath}`

          if (options.level === 'error') {
            throw new Error(String(pc.red(message)))
          } else {
            const error = new Error(pc.yellow(message))
            console.warn(error)
          }
        }
      },

      vite: {
        apply: 'build',
        configResolved(config) {
          options.root ||= config.root
        },
      },
    }
  })
