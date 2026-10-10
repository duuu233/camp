const { resolve } = require('node:path')

const mode = process.argv[2]
if (mode !== 'dev' && mode !== 'build') {
  throw new Error('Expected dev or build mode')
}

const projectRoot = resolve(__dirname, '..')
const compilerEntry = require.resolve('@dcloudio/vite-plugin-uni/bin/uni.js')

// uni-app's static resource copier needs absolute input and output directories.
process.chdir(projectRoot)
process.env.UNI_INPUT_DIR = projectRoot
process.env.UNI_OUTPUT_DIR = resolve(projectRoot, 'unpackage/dist', mode, 'mp-weixin')
process.argv = [
  process.execPath,
  compilerEntry,
  ...(mode === 'build' ? ['build'] : []),
  '-p',
  'mp-weixin'
]

console.log(`[camp] compiler pid: ${process.pid}`)
require(compilerEntry)
