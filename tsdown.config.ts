import { defineConfig } from 'tsdown'
import Unused from './src/rolldown.ts'

export default defineConfig({
  entry: './src/*.ts',
  plugins: [Unused({ level: 'error' })],
})
