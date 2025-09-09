import { defineConfig } from 'tsdown'
import Unused from './src/rolldown.ts'

export default defineConfig({
  entry: './src/*.ts',
  exports: true,
  plugins: [
    Unused({
      level: 'error',
    }),
  ],
})
