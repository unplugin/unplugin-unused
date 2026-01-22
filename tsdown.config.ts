import { nodeLib } from 'tsdown-preset-sxzz'
import Unused from './src/rolldown.ts'

export default nodeLib(
  { entry: 'shallow' },
  {
    plugins: [
      Unused({
        level: 'error',
      }),
    ],
  },
)
