import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeLocalImage } from '../composables/localImage.js'
import { persistLocalAvatar, readLocalAvatar, removeLocalAvatar } from '../composables/localAvatar.js'
import { buildShareMessage, buildShareTimeline } from '../composables/useShare.js'
import { hero, ingredientPackages } from '../data/campData.js'

test('share cards use packaged image paths and retain existing routes', () => {
  assert.deepEqual(buildShareMessage({ path: '/pages/index/index', imageUrl: { value: hero.poster } }), {
    title: '暮山川 · 露营租赁 · 活动策划', path: '/pages/index/index', imageUrl: '/static/posters/package-4p.jpg'
  })
  assert.equal(buildShareMessage({ path: '/pages/ingredients/index', imageUrl: () => ingredientPackages[0].image }).imageUrl,
    '/pages/ingredients/static/meal-4-package.jpg')
  assert.equal(buildShareTimeline({ imageUrl: hero.poster }).imageUrl, hero.poster)
})

test('reject remote and old cloud image references; preserve device and packaged paths', () => {
  for (const source of ['cloud://old/avatar.png', 'https://example.com/a.jpg', '//example.com/a.jpg', 'http://example.com/a.jpg', 'ftp://example.com/a.jpg']) {
    assert.equal(normalizeLocalImage(source), '')
  }
  for (const source of ['/static/logo-white.png', '/pages/ingredients/static/meal.jpg', 'wxfile://tmp/avatar.jpg', 'http://tmp/avatar.jpg', 'http://usr/avatar.jpg']) {
    assert.equal(normalizeLocalImage(source), source)
  }
})

test('avatar persists on device, missing file falls back, only owned files are removed', async () => {
  const files = new Set()
  const copies = []
  globalThis.wx = {
    env: { USER_DATA_PATH: 'wxfile://usr' },
    getFileSystemManager: () => ({
      copyFile: options => { copies.push(options); files.add(options.destPath); options.success() },
      accessSync: file => { if (!files.has(file)) throw new Error('Missing') },
      unlinkSync: file => { files.delete(file) }
    })
  }
  try {
    const avatar = await persistLocalAvatar('http://tmp/avatar.png')
    assert(avatar.startsWith('wxfile://usr/camp-avatar-local-'))
    assert.equal(copies.length, 1)
    assert.equal(readLocalAvatar(avatar), avatar)
    assert.equal(await persistLocalAvatar(avatar), avatar)
    assert.equal(copies.length, 1)
    assert.equal(await persistLocalAvatar('cloud://old/avatar.png'), '')
    assert.equal(readLocalAvatar('wxfile://tmp/expired.png'), '')
    removeLocalAvatar('/static/logo-mark.png')
    assert(files.has(avatar))
    removeLocalAvatar(avatar)
    assert.equal(readLocalAvatar(avatar), '')
  } finally { delete globalThis.wx }
})
