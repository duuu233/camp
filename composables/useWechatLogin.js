import { computed, onMounted, readonly, shallowRef } from 'vue'
import {
  callWechatCloudFunction,
  uploadWechatCloudFile
} from './useWechatCloud.js'

const LOGIN_STORAGE_KEY = 'mushanchuan_wechat_login'
const defaultNickname = '暮山川用户'

const currentUser = shallowRef(null)
const isLoginLoading = shallowRef(false)
const isProfileSaving = shallowRef(false)
const loginError = shallowRef('')
const isLoggedIn = computed(
  () => !!currentUser.value && !!currentUser.value.openid
)

let hasHydratedLogin = false

function canUseStorage() {
  return (
    typeof uni !== 'undefined' &&
    typeof uni.getStorageSync === 'function' &&
    typeof uni.setStorageSync === 'function'
  )
}

function normalizeLoginUser(payload) {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const openid = typeof payload.openid === 'string' ? payload.openid : ''

  if (!openid) {
    return null
  }

  return {
    openid,
    appid: typeof payload.appid === 'string' ? payload.appid : '',
    unionid: typeof payload.unionid === 'string' ? payload.unionid : '',
    env: typeof payload.env === 'string' ? payload.env : '',
    nickname:
      typeof payload.nickname === 'string' && payload.nickname.trim()
        ? payload.nickname.trim()
        : defaultNickname,
    avatar: typeof payload.avatar === 'string' ? payload.avatar : '',
    phoneNumber:
      typeof payload.phoneNumber === 'string' ? payload.phoneNumber : '',
    loginAt: typeof payload.loginAt === 'number' ? payload.loginAt : Date.now()
  }
}

function normalizeNickname(nickname) {
  return typeof nickname === 'string' && nickname.trim()
    ? nickname.trim()
    : defaultNickname
}

function normalizeAvatarUrl(avatar) {
  return typeof avatar === 'string' ? avatar : ''
}

function getAvatarFileExtension(filePath) {
  if (typeof filePath !== 'string') {
    return 'jpg'
  }

  const cleanPath = filePath.split('?')[0]
  const matched = cleanPath.match(/\.([a-z0-9]+)$/i)
  const extension = matched ? matched[1].toLowerCase() : 'jpg'
  return ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? extension : 'jpg'
}

async function uploadUserAvatar(openid, avatarUrl) {
  if (
    !avatarUrl ||
    avatarUrl.startsWith('cloud://') ||
    /^https?:\/\//.test(avatarUrl)
  ) {
    return avatarUrl
  }

  const extension = getAvatarFileExtension(avatarUrl)
  const cloudPath = `user-avatars/${openid}/${Date.now()}.${extension}`
  const fileID = await uploadWechatCloudFile({
    cloudPath,
    filePath: avatarUrl
  })

  return fileID || avatarUrl
}

function readStoredUser() {
  if (!canUseStorage()) {
    return null
  }

  try {
    return normalizeLoginUser(uni.getStorageSync(LOGIN_STORAGE_KEY))
  } catch (error) {
    return null
  }
}

function writeStoredUser(user) {
  if (!canUseStorage()) {
    return
  }

  try {
    uni.setStorageSync(LOGIN_STORAGE_KEY, user)
  } catch (error) {
    console.warn('保存微信登录态失败', error)
  }
}

function removeStoredUser() {
  if (
    typeof uni === 'undefined' ||
    typeof uni.removeStorageSync !== 'function'
  ) {
    return
  }

  try {
    uni.removeStorageSync(LOGIN_STORAGE_KEY)
  } catch (error) {
    console.warn('清除微信登录态失败', error)
  }
}

function hydrateLogin() {
  if (hasHydratedLogin || !canUseStorage()) {
    return
  }

  hasHydratedLogin = true
  currentUser.value = readStoredUser()
}

function getLoginErrorMessage(error) {
  const errMsg = error && (error.errMsg || error.message)

  if (typeof errMsg === 'string' && /cancel|deny|auth deny/.test(errMsg)) {
    return '已取消登录'
  }

  return '微信登录失败，请稍后重试'
}

export function useWechatLogin() {
  hydrateLogin()
  onMounted(hydrateLogin)

  async function loginWithWechat(options = {}) {
    if (isLoginLoading.value) {
      return currentUser.value
    }

    isLoginLoading.value = true
    loginError.value = ''

    try {
      const result = await callWechatCloudFunction({
        name: 'quickLogin',
        data: {
          phoneCode:
            typeof options.phoneCode === 'string' ? options.phoneCode : ''
        }
      })
      const loginUser = normalizeLoginUser(result)

      if (!loginUser) {
        throw new Error('云登录未返回 openid')
      }

      currentUser.value = loginUser
      writeStoredUser(loginUser)
      return loginUser
    } catch (error) {
      const message = getLoginErrorMessage(error)
      loginError.value = message
      throw new Error(message)
    } finally {
      isLoginLoading.value = false
    }
  }

  function logout() {
    currentUser.value = null
    loginError.value = ''
    removeStoredUser()
  }

  async function updateWechatProfile(profile = {}) {
    if (!currentUser.value || !currentUser.value.openid) {
      throw new Error('请先登录')
    }

    if (isProfileSaving.value) {
      return currentUser.value
    }

    isProfileSaving.value = true

    try {
      const avatar =
        'avatar' in profile
          ? await uploadUserAvatar(
              currentUser.value.openid,
              normalizeAvatarUrl(profile.avatar)
            )
          : currentUser.value.avatar
      const nextUser = normalizeLoginUser({
        ...currentUser.value,
        nickname:
          'nickname' in profile
            ? normalizeNickname(profile.nickname)
            : currentUser.value.nickname,
        avatar
      })

      if (!nextUser) {
        throw new Error('用户信息无效')
      }

      currentUser.value = nextUser
      writeStoredUser(nextUser)
      return nextUser
    } finally {
      isProfileSaving.value = false
    }
  }

  return {
    user: readonly(currentUser),
    isLoggedIn,
    isLoginLoading: readonly(isLoginLoading),
    isProfileSaving: readonly(isProfileSaving),
    loginError: readonly(loginError),
    loginWithWechat,
    updateWechatProfile,
    logout
  }
}
