import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import * as data from '../data/campData.js'

const root = path.resolve(import.meta.dirname, '..')
const require = createRequire(path.join(root, '.asset-qa/package.json'))
const automator = require('miniprogram-automator')
const miniProgram = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
const report = []
const errors = []
miniProgram.on('exception', error => errors.push(error))
try {
  for (const [route, images] of [
    ['/pages/index/index', [data.hero.poster, data.housekeepingRules.image, ...data.bbqPackages.slice(0, 4).map(item => item.image)]],
    ['/pages/packages/index', [data.equipmentDetails.image, ...data.bbqPackages.map(item => item.image)]],
    ['/pages/ingredients/index', data.ingredientPackages.map(item => item.image)],
    ['/pages/mine/index', [data.brand.logos.white, data.brand.logos.mark]]
  ]) {
    const page = await miniProgram.reLaunch(route)
    assert(page, `Unable to open ${route}`)
    await page.waitFor(1000)
    for (const src of new Set(images)) {
      const info = await miniProgram.callWxMethod('getImageInfo', { src })
      assert(info.width > 0 && info.height > 0, `Cannot decode ${src}`)
    }
    const screenshot = path.join(root, '.asset-qa', route.split('/')[2] + '.png')
    await miniProgram.screenshot({ path: screenshot })
    report.push({ route, images: images.length, screenshot })
    console.log('PASS', route, images.length, 'local images decoded')
  }
  assert.equal(errors.length, 0, JSON.stringify(errors))
  fs.writeFileSync(path.join(root, '.asset-qa/smoke-report.json'), JSON.stringify(report, null, 2))
} finally {
  miniProgram.disconnect()
}
