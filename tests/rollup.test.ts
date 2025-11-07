import path from 'node:path'
import process from 'node:process'
import {
  rollupBuild,
  RollupToStringPlugin,
  testFixtures,
} from '@sxzz/test-utils'
import { describe } from 'vitest'
import UnpluginUnused from '../src/rollup.ts'
import type { Plugin } from 'rollup'

describe('rollup', async () => {
  const { dirname } = import.meta
  await testFixtures(
    '*.{js,tsx,vue}',
    async (args, id) => {
      try {
        const EarlyError = id.includes('early-error')
          ? ({
              name: 'rollup-plugin-early-error',
              transform() {
                this.error(new Error('Early error'))
              },
            } satisfies Plugin)
          : false

        const { snapshot } = await rollupBuild(id, [
          EarlyError,
          UnpluginUnused({
            level: 'error',
            root: id.includes('error-root') ? '/does/not/exist' : undefined,
          }),
          RollupToStringPlugin(),
        ])
        return snapshot
      } catch (error: any) {
        error.message = error.message.replaceAll(
          process.cwd() + path.sep,
          '#CWD#/',
        )
        throw error
      }
    },
    {
      cwd: path.resolve(dirname, 'fixtures'),
      promise: true,
    },
  )
})
