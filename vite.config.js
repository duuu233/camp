import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// uni-app copies the source project config, whose root is relative to the
// repository. An imported output directory must instead use its own root.
function weixinOutputConfig() {
  return {
    name: 'camp:weixin-output-config',
    apply: 'build',
    writeBundle: {
      order: 'post',
      sequential: true,
      handler() {
        if (process.env.UNI_PLATFORM !== 'mp-weixin') return
        const filename = resolve(process.env.UNI_OUTPUT_DIR, 'project.config.json')
        const config = JSON.parse(readFileSync(filename, 'utf8'))
        config.miniprogramRoot = './'
        // Deploy cloud functions from the repository's development project.
        delete config.cloudfunctionRoot
        writeFileSync(filename, JSON.stringify(config, null, 2) + '\n')
      }
    }
  }
}

export default defineConfig({
  plugins: [uni(), weixinOutputConfig()]
})
