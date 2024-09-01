import path from 'node:path'
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
      const { snapshot } = await rollupBuild(id, [
        UnpluginUnused({
          level: 'error',
        }),
        RollupToStringPlugin(),
      ])
      return snapshot
    },
    {
      cwd: path.resolve(dirname, 'fixtures'),
      promise: true,
    },
  )
})
