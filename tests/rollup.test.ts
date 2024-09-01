import path from 'node:path'
import process from 'node:process'
import {
  rollupBuild,
  RollupToStringPlugin,
  testFixtures,
} from '@sxzz/test-utils'
import { describe } from 'vitest'
import UnpluginUnused from '../src/rollup'

describe('rollup', async () => {
  const { dirname } = import.meta
  await testFixtures(
    '*.{js,tsx,vue}',
    async (args, id) => {
      try {
        const { snapshot } = await rollupBuild(id, [
          UnpluginUnused({
            level: 'error',
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
