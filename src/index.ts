import { readFile } from 'node:fs/promises'
import { styleText } from 'node:util'
import { up } from 'empathic/package'
import escapeStringRegexp from 'escape-string-regexp'
import jsTokens from 'js-tokens'
import {
  createUnplugin,
  type UnpluginBuildContext,
  type UnpluginInstance,
} from 'unplugin'
import { resolveOptions, type DepKind, type Options } from './core/options.ts'

export type { DepKind, Options }

export const Unused: UnpluginInstance<Options | undefined, false> =
  createUnplugin((rawOptions = {}) => {
    const options = resolveOptions(rawOptions)
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
        const pkgJsonPath = up({ cwd: options.root })
        if (!pkgJsonPath) {
          throw new Error(`Cannot find package.json from root: ${options.root}`)
        }
        pkgPath = pkgJsonPath
        const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))

        const deps = new Set<string>()
        for (const kind of options.depKinds) {
          const dependencies = Object.keys(pkg[kind] || {})
          for (const dep of dependencies) {
            const ignore = Array.isArray(options.ignore)
              ? options.ignore
              : options.ignore[kind] || []
            if (ignore.includes(dep) || deps.has(dep)) continue
            deps.add(dep)
            // build regexp: /["']dep['"\/]/
            depsRegex[dep] = new RegExp(
              String.raw`["']${escapeStringRegexp(dep)}['"\/]`,
            )
          }
        }

        const buildId = getBuildId(this)
        depsState.set(buildId, deps)
      },

      transform: {
        filter: {
          id: {
            include: options.include,
            exclude: options.exclude,
          },
        },
        handler(code, id): undefined {
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
      },

      buildEnd(...args: any[]) {
        const hasError = !!args[0]
        // already has error
        if (hasError) return

        const id = getBuildId(this)
        const deps = depsState.get(id)
        if (deps?.size) {
          const message =
            `Unused ${styleText('cyan', String(deps.size))} dependencies found: \n\n` +
            `${Array.from(deps)
              .map((dep) => `- ${styleText('bold', dep)}`)
              .join('\n')}\n\n` +
            `You can remove them from ${pkgPath}`

          if (options.level === 'error') {
            throw new Error(String(styleText('red', message)))
          } else {
            const error = new Error(styleText('yellow', message))
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
