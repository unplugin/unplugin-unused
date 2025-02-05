import type { FilterPattern } from 'unplugin-utils'

export type DepKind = 'dependencies' | 'devDependencies' | 'peerDependencies'

export interface Options {
  root?: string
  include?: FilterPattern
  exclude?: FilterPattern
  ignore?: string[] | Partial<Record<DepKind, string[]>>
  /**
   * @default 'warning'
   */
  level?: 'warning' | 'error'
  /**
   * @default ['dependencies', 'peerDependencies']
   */
  depKinds?: Array<DepKind>
}

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type OptionsResolved = Overwrite<
  Required<Options>,
  Pick<Options, 'root'>
>

export function resolveOptions(options: Options): OptionsResolved {
  return {
    include: options.include || [/\.([cm]?[jt]sx?|vue)$/],
    exclude: options.exclude || [/node_modules/],
    ignore: options.ignore || [],
    level: options.level || 'warning',
    depKinds: options.depKinds || ['dependencies', 'peerDependencies'],
  }
}
