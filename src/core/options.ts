import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {
  root?: string
  include?: FilterPattern
  exclude?: FilterPattern
  ignore?: string[]
  /**
   * @default 'warning'
   */
  level?: 'warning' | 'error'
  /**
   * @default ['dependencies', 'peerDependencies']
   */
  depKinds?: Array<'dependencies' | 'devDependencies' | 'peerDependencies'>
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
