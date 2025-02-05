import { defineConfig } from 'tsdown'
import Unused from './src/rolldown'

export default defineConfig({
  entry: ['./src/*.ts'],
  format: ['esm'],
  target: 'node18.12',
  clean: true,
  dts: true,
  plugins: [Unused({ level: 'error' })],
})
