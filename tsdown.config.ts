import { defineConfig } from 'tsdown'
import Unused from './src/rolldown'

export default defineConfig({
  entry: './src/*.ts',
  plugins: [Unused({ level: 'error' })],
})
