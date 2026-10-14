import { defineConfig } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'

// The uni-app plugin is published as CommonJS; this project uses ESM.
const uni = uniPlugin.default ?? uniPlugin

export default defineConfig({
  plugins: [uni()]
})
