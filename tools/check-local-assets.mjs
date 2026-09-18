import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const config = JSON.parse(fs.readFileSync(path.join(root, 'pages.json'), 'utf8'))
const data = await import(pathToFileURL(path.join(root, 'data/campData.js')))
const imagePaths = new Set()
function collect(value) {
  if (typeof value === 'string' && /\.(?:png|jpg|jpeg|webp)$/.test(value)) imagePaths.add(value)
  else if (Array.isArray(value)) value.forEach(collect)
  else if (value && typeof value === 'object') Object.values(value).forEach(collect)
}
Object.values(data).forEach(collect)
imagePaths.add('/static/wx-customer-service.jpg')
for (const image of imagePaths) {
  assert(image.startsWith('/'), `Image must be packaged: ${image}`)
  assert(fs.existsSync(path.join(root, image)), `Missing source image: ${image}`)
}
const subRoots = config.subPackages.map(pkg => pkg.root + '/')
const homeImages = [data.hero.poster, data.housekeepingRules.image, ...data.bbqPackages.slice(0, 4).map(item => item.image)]
homeImages.forEach(image => assert(!subRoots.some(prefix => image.slice(1).startsWith(prefix)), `Home depends on a subpackage image: ${image}`))
const routes = [...config.pages.map(page => page.path), ...config.subPackages.flatMap(pkg => pkg.pages.map(page => `${pkg.root}/${page.path}`))]
routes.forEach(route => assert(fs.existsSync(path.join(root, route + '.vue')), `Missing route: ${route}`))
const build = path.join(root, 'unpackage/dist/build/mp-weixin')
const app = JSON.parse(fs.readFileSync(path.join(build, 'app.json'), 'utf8'))
const project = JSON.parse(fs.readFileSync(path.join(build, 'project.config.json'), 'utf8'))
assert(!app.copyToVersion && !app.cloudfunctionRoot && !project.cloudfunctionRoot, 'Cloud build configuration remains')
const backendCalls = /(?:wx|uni)\s*\.\s*(?:cloud\b|login\s*\(|request\s*\(|uploadFile\s*\(|downloadFile\s*\(|connectSocket\s*\(|getUserProfile\s*\(|getPhoneNumber\s*\()/
for (const directory of ['pages', 'components', 'composables', 'data']) {
  for (const relative of fs.readdirSync(path.join(root, directory), { recursive: true })) {
    if (!/\.(?:js|vue)$/.test(relative)) continue
    const source = fs.readFileSync(path.join(root, directory, relative), 'utf8')
    assert(!backendCalls.test(source), `Backend/network call in ${directory}/${relative}`)
    assert(!/cloudEnvId|cloudbase-|wx-server-sdk|getphonenumber|useWechatLogin|useWechatCloud/.test(source), `Cloud/auth dependency in ${relative}`)
  }
}
assert.deepEqual((app.subPackages || app.subpackages).map(pkg => pkg.root).sort(), config.subPackages.map(pkg => pkg.root).sort())
const sizes = { main: 0, ...Object.fromEntries(config.subPackages.map(pkg => [pkg.root, 0])) }
for (const relative of fs.readdirSync(build, { recursive: true })) {
  const file = path.join(build, relative)
  if (!fs.statSync(file).isFile()) continue
  const normalized = relative.replaceAll('\\', '/')
  const pkg = config.subPackages.find(pkg => normalized.startsWith(pkg.root + '/'))?.root || 'main'
  sizes[pkg] += fs.statSync(file).size
  if (relative.endsWith('.js')) {
    const source = fs.readFileSync(file, 'utf8')
    assert(!/getTempFileURL|\.uploadFile\(|\.downloadFile\(|tcb\.qcloud\.la|cloud:\/\/|wx\.cloud|cloudbase-|quickLogin|wx-server-sdk/.test(source), `Cloud dependency in ${relative}`)
  }
}
for (const image of imagePaths) assert(fs.existsSync(path.join(build, image)), `Missing compiled image: ${image}`)
for (const [pkg, bytes] of Object.entries(sizes)) {
  console.log(`${pkg}: ${bytes} bytes (${(bytes / 1024 / 1024).toFixed(3)} MiB)`)
  assert(bytes < 2 * 1024 * 1024, `${pkg} exceeds 2 MiB`)
}
console.log(`PASS: ${imagePaths.size} local images, ${routes.length} routes, image ownership, compiled assets and no backend/auth/network calls in application source.`)
