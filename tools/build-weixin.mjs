import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const cli = require.resolve('@dcloudio/vite-plugin-uni/bin/uni.js')
const result = spawnSync(process.execPath, [cli, 'build', '-p', 'mp-weixin'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production', UNI_PLATFORM: 'mp-weixin',
    UNI_INPUT_DIR: root, UNI_OUTPUT_DIR: path.join(root, 'unpackage/dist/build/mp-weixin'),
    UNI_CLI_CONTEXT: root }
})
if (result.error) throw result.error
process.exit(result.status ?? 1)
