import path from 'node:path'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const hx = process.env.HBUILDERX_PATH || 'D:/Program Files/HBuilderX'
const plugins = path.join(hx, 'plugins')
const compiler = path.join(plugins, 'uniapp-cli-vite')
const cli = path.join(compiler, 'node_modules/@dcloudio/vite-plugin-uni/bin/uni.js')
if (!fs.existsSync(cli)) throw new Error('Set HBUILDERX_PATH to an installation with the Vue 3 compiler.')
const result = spawnSync(process.execPath, [cli, 'build', '-p', 'mp-weixin'], {
  cwd: compiler,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production', UNI_PLATFORM: 'mp-weixin',
    UNI_INPUT_DIR: root, UNI_OUTPUT_DIR: path.join(root, 'unpackage/dist/build/mp-weixin'),
    UNI_HBUILDERX_PLUGINS: plugins, UNI_CLI_CONTEXT: compiler }
})
process.exit(result.status ?? 1)
