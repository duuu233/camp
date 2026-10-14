import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createLocalImagePreview } from '../composables/localImagePreview.js'

function fixture() {
  const calls = { info: [], copy: [], preview: [], toast: [] }
  const missing = new Set()
  const api = {
    getImageInfo(options) {
      calls.info.push(options.src)
      if (missing.has(options.src)) options.fail({ errMsg: 'getImageInfo:fail file not found' })
      else options.success({ path: options.src.startsWith('/') ? options.src.slice(1) : options.src })
    },
    previewImage(options) {
      calls.preview.push(options)
      options.success()
    },
    showToast(options) { calls.toast.push(options) }
  }
  const fileSystem = {
    copyFile(options) { calls.copy.push(options); options.success() }
  }
  const preview = createLocalImagePreview(api, { fileSystem, userDirectory: 'wxfile://usr' })
  return { calls, missing, api, fileSystem, preview }
}

test('main-package poster is copied to a device file before native preview; repeat taps reuse the copy', async () => {
  const { calls, preview } = fixture()
  const source = '/static/posters/package-4p.jpg'
  assert.equal(await preview(source), true)
  assert.equal(calls.copy[0].srcPath, 'static/posters/package-4p.jpg')
  assert(calls.copy[0].destPath.startsWith('wxfile://usr/camp-preview-'))
  assert(!calls.copy[0].destPath.includes('%'), 'Native preview must not URL-decode the cache filename')
  assert.deepEqual(calls.preview[0].urls, [calls.copy[0].destPath])
  assert.equal(calls.preview[0].current, calls.copy[0].destPath)
  await preview(source)
  assert.equal(calls.copy.length, 1)
})

test('subpackage gallery preserves the tapped image and removes duplicates and empty entries', async () => {
  const { calls, preview } = fixture()
  const first = '/pages/ingredients/static/meal-4-package.jpg'
  const second = '/pages/ingredients/static/meal-8-package.jpg'
  assert.equal(await preview(second, [first, '', second, first]), true)
  assert.equal(calls.copy.length, 2)
  assert.equal(calls.preview[0].current, calls.copy[1].destPath)
  assert.deepEqual(calls.preview[0].urls, calls.copy.map(call => call.destPath))
})

test('a missing secondary poster does not prevent viewing the tapped poster', async () => {
  const { calls, missing, preview } = fixture()
  const source = '/static/posters/package-4p.jpg'
  missing.add('/static/missing.jpg')
  assert.equal(await preview(source, ['/static/missing.jpg', source]), true)
  assert.equal(calls.preview[0].urls.length, 1)
  assert.equal(calls.toast.length, 0)
})

test('a failed copy reports the error and is retried on the next tap', async t => {
  t.mock.method(console, 'warn', () => {})
  const { calls, fileSystem, preview } = fixture()
  const copy = fileSystem.copyFile
  fileSystem.copyFile = options => options.fail({ errMsg: 'copyFile:fail' })
  assert.equal(await preview('/static/posters/package-4p.jpg'), false)
  assert.equal(calls.preview.length, 0)
  assert.equal(calls.toast.length, 1)
  fileSystem.copyFile = copy
  assert.equal(await preview('/static/posters/package-4p.jpg'), true)
})

test('existing device-local avatars are previewed without creating another copy', async () => {
  const { calls, preview } = fixture()
  const avatar = 'http://tmp/avatar.jpg'
  assert.equal(await preview(avatar), true)
  assert.equal(calls.copy.length, 0)
  assert.equal(calls.preview[0].current, avatar)
})

test('cloud or remote references never trigger image loading or native preview', async () => {
  const { calls, preview } = fixture()
  assert.equal(await preview('cloud://old/poster.jpg'), false)
  assert.equal(await preview('https://example.com/poster.jpg'), false)
  assert.equal(calls.info.length, 0)
  assert.equal(calls.preview.length, 0)
})

test('a missing current poster reports failure and can be retried after it becomes available', async t => {
  t.mock.method(console, 'warn', () => {})
  const { calls, missing, preview } = fixture()
  const source = '/pages/packages/static/equipment-details.jpg'
  missing.add(source)
  assert.equal(await preview(source), false)
  assert.equal(calls.preview.length, 0)
  assert.equal(calls.toast.length, 1)
  missing.delete(source)
  assert.equal(await preview(source), true)
})

test('native preview failure is visible and resets the cached files for a fresh retry', async t => {
  t.mock.method(console, 'warn', () => {})
  const { calls, api, preview } = fixture()
  const open = api.previewImage
  api.previewImage = options => options.fail({ errMsg: 'previewImage:fail' })
  assert.equal(await preview('/static/posters/package-2p.jpg'), false)
  api.previewImage = open
  assert.equal(await preview('/static/posters/package-2p.jpg'), true)
  assert.equal(calls.copy.length, 2)
  assert.equal(calls.toast.length, 1)
})

test('repeated taps during image resolution open only one native preview', async () => {
  const { calls, api, preview } = fixture()
  let finish
  api.getImageInfo = options => { finish = () => options.success({ path: 'static/posters/package-2p.jpg' }) }
  const first = preview('/static/posters/package-2p.jpg')
  assert.equal(await preview('/static/posters/package-2p.jpg'), false)
  finish()
  assert.equal(await first, true)
  assert.equal(calls.preview.length, 1)
})
