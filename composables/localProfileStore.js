import { persistLocalAvatar, readLocalAvatar, removeLocalAvatar } from './localAvatar.js'

export const PROFILE_STORAGE_KEY = 'mushanchuan_local_profile'
const LEGACY_STORAGE_KEY = 'mushanchuan_wechat_login'

function normalizeProfile(value) {
  if (!value || typeof value !== 'object') return null
  return {
    nickname: typeof value.nickname === 'string' && value.nickname.trim()
      ? value.nickname.trim().slice(0, 24) : '暮山川用户',
    avatar: readLocalAvatar(value.avatar)
  }
}

// Kept independent of Vue so persistence and failure recovery can be tested.
export function createLocalProfileStore(storage, avatars = {
  save: persistLocalAvatar, remove: removeLocalAvatar
}) {
  return {
    read() {
      const profile = normalizeProfile(storage.getStorageSync(PROFILE_STORAGE_KEY))
      const legacy = storage.getStorageSync(LEGACY_STORAGE_KEY)
      if (!legacy) return profile
      // Keep only the nickname. Remove the previous identity record and avatar
      // filename, which may contain the old account identifier.
      const migrated = profile || normalizeProfile({ nickname: legacy.nickname })
      if (migrated) storage.setStorageSync(PROFILE_STORAGE_KEY, migrated)
      storage.removeStorageSync(LEGACY_STORAGE_KEY)
      if (legacy.avatar !== migrated?.avatar) avatars.remove(legacy.avatar)
      return migrated
    },
    async save(current, changes) {
      const previousAvatar = current?.avatar || ''
      const avatar = 'avatar' in changes ? await avatars.save(changes.avatar) : previousAvatar
      const next = normalizeProfile({ ...current, ...changes, avatar })
      // The avatar was just persisted; use its returned path rather than
      // requiring an additional filesystem lookup before committing storage.
      next.avatar = avatar
      try {
        storage.setStorageSync(PROFILE_STORAGE_KEY, next)
      } catch (error) {
        if (avatar !== previousAvatar) avatars.remove(avatar)
        throw new Error('资料保存失败，请检查设备存储空间', { cause: error })
      }
      if (previousAvatar !== avatar) avatars.remove(previousAvatar)
      return next
    },
    clear(current) {
      storage.removeStorageSync(PROFILE_STORAGE_KEY)
      avatars.remove(current?.avatar)
    }
  }
}
