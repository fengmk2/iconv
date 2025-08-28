import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/wrapper.ts',
  unbundle: true
})