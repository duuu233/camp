import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createLocalProfileStore, PROFILE_STORAGE_KEY } from '../composables/localProfileStore.js'

function fixture(initial = {}) {
  const records = new Map(Object.entries(initial))
  const removed = []
  const storage = {
    getStorageSync: key => records.get(key),
    setStorageSync: (key, value) => records.set(key, value),
    removeStorageSync: key => records.delete(key)
  }
  const avatars = { save: async path => path, remove: path => { if (path) removed.push(path) } }
  return { records, removed, storage, avatars, store: createLocalProfileStore(storage, avatars) }
}

test('first save needs no identity, persists only nickname/avatar and survives reopening', async () => {
  const f = fixture()
  assert.equal(f.store.read(), null)
  const profile = await f.store.save(null, { nickname: '  山野  ', avatar: '/static/logo-mark.png', openid: 'ignored', phoneNumber: 'ignored' })
  assert.deepEqual(profile, { nickname: '山野', avatar: '/static/logo-mark.png' })
  assert.deepEqual(createLocalProfileStore(f.storage, f.avatars).read(), profile)
  assert.deepEqual([...f.records.keys()], [PROFILE_STORAGE_KEY])
})

test('legacy migration removes identity and phone, keeps nickname and cleans old avatar', () => {
  const f = fixture({ mushanchuan_wechat_login: { nickname: '老朋友', openid: 'old-id', phoneNumber: 'old-phone', avatar: 'wxfile://usr/camp-avatar-old-id.png' } })
  assert.deepEqual(f.store.read(), { nickname: '老朋友', avatar: '' })
  assert(!f.records.has('mushanchuan_wechat_login'))
  assert.deepEqual(f.records.get(PROFILE_STORAGE_KEY), { nickname: '老朋友', avatar: '' })
  assert.deepEqual(f.removed, ['wxfile://usr/camp-avatar-old-id.png'])
})

test('new local profile takes precedence over legacy cache', () => {
  const profile = { nickname: '新昵称', avatar: '/static/logo-mark.png' }
  const f = fixture({ [PROFILE_STORAGE_KEY]: profile, mushanchuan_wechat_login: { nickname: '旧昵称', avatar: 'cloud://old' } })
  assert.deepEqual(f.store.read(), profile)
  assert(!f.records.has('mushanchuan_wechat_login'))
})

test('failed storage write retains old profile and avatar, cleans the newly copied file', async () => {
  const previous = { nickname: '以前', avatar: '/old-avatar.png' }
  const f = fixture({ [PROFILE_STORAGE_KEY]: previous })
  f.avatars.save = async () => '/new-avatar.png'
  f.storage.setStorageSync = () => { throw new Error('Storage full') }
  await assert.rejects(f.store.save(previous, { nickname: '更新', avatar: 'wxfile://tmp/new.png' }), /资料保存失败/)
  assert.deepEqual(f.records.get(PROFILE_STORAGE_KEY), previous)
  assert.deepEqual(f.removed, ['/new-avatar.png'])
})

test('failed avatar copy never commits profile or removes the previous avatar', async () => {
  const previous = { nickname: '以前', avatar: '/old-avatar.png' }
  const f = fixture({ [PROFILE_STORAGE_KEY]: previous })
  f.avatars.save = async () => { throw new Error('Cannot copy') }
  await assert.rejects(f.store.save(previous, { avatar: 'wxfile://tmp/new.png' }), /Cannot copy/)
  assert.deepEqual(f.records.get(PROFILE_STORAGE_KEY), previous)
  assert.deepEqual(f.removed, [])
})

test('clear removes local profile and owned avatar; failed clear preserves the avatar', () => {
  const profile = { nickname: '朋友', avatar: '/saved-avatar.png' }
  const f = fixture({ [PROFILE_STORAGE_KEY]: profile })
  f.store.clear(profile)
  assert.equal(f.store.read(), null)
  assert.deepEqual(f.removed, ['/saved-avatar.png'])
  const failed = fixture({ [PROFILE_STORAGE_KEY]: profile })
  failed.storage.removeStorageSync = () => { throw new Error('Storage unavailable') }
  assert.throws(() => failed.store.clear(profile))
  assert.deepEqual(failed.removed, [])
})
