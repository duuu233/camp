import { onMounted, shallowRef, watch } from 'vue'
import { ensureWechatCloudReady } from './useWechatCloud.js'

const capsuleFallbackStyle = {
  '--status-bar-height': '88rpx',
  '--capsule-safe-right': '30rpx',
  '--capsule-top-gap': '22rpx',
  '--capsule-after-gap': '28rpx',
  '--capsule-button-height': '64rpx',
  '--capsule-reserved-height': '174rpx',
  '--capsule-block-offset': '114rpx'
}

export function logImageRenderEvent(scope, rawSrc, resolvedSrc, event) {
  void scope
  void rawSrc
  void resolvedSrc
  void event
}

function readSource(source) {
  if (typeof source === 'function') {
    return source()
  }

  if (source && typeof source === 'object' && 'value' in source) {
    return source.value
  }

  return source
}

function getCloudFallbackUrl(fileId) {
  if (typeof fileId !== 'string') {
    return ''
  }

  const normalizedFileId = fileId.replace(/\\/g, '/')
  const fileName = normalizedFileId.split('/').filter(Boolean).pop()

  if (!fileName) {
    return ''
  }

  if (normalizedFileId.includes('/Ingredients/')) {
    return `/static/Ingredients/${fileName}`
  }

  return `/static/${fileName}`
}

function resolveCloudFallback(fileId) {
  return getCloudFallbackUrl(fileId)
}

export function resolveCloudImageUrl(fileId) {
  if (!fileId) {
    return Promise.resolve('')
  }

  if (typeof fileId !== 'string' || !fileId.startsWith('cloud://')) {
    return Promise.resolve(fileId)
  }

  // #ifdef MP-WEIXIN
  const hasWx = typeof wx !== 'undefined'
  const hasWxCloud = hasWx && !!wx.cloud

  if (!hasWxCloud) {
    return Promise.resolve(resolveCloudFallback(fileId))
  }

  return ensureWechatCloudReady()
    .then(
      () =>
        new Promise(resolve => {
          wx.cloud.getTempFileURL({
            fileList: [fileId],
            success: res => {
              const file = res.fileList && res.fileList[0]
              const resolvedUrl =
                file && file.status === 0 ? file.tempFileURL : ''

              if (resolvedUrl) {
                resolve(resolvedUrl)
                return
              }

              resolve(resolveCloudFallback(fileId))
            },
            fail: error => {
              void error
              resolve(resolveCloudFallback(fileId))
            }
          })
        })
    )
    .catch(error => {
      void error
      return resolveCloudFallback(fileId)
    })
  // #endif

  // #ifndef MP-WEIXIN
  return Promise.resolve(fileId)
  // #endif
}

export function useCloudImageUrl(source) {
  const imageUrl = shallowRef('')

  watch(
    () => readSource(source),
    async fileId => {
      const resolvedUrl = await resolveCloudImageUrl(fileId)
      imageUrl.value = resolvedUrl
    },
    { immediate: true }
  )

  return imageUrl
}

export function previewImageUrl(current, urls) {
  const currentUrl = readSource(current)
  const previewUrls = (Array.isArray(urls) ? urls : [current])
    .map(url => readSource(url))
    .filter(Boolean)

  if (!currentUrl || !previewUrls.length || typeof uni === 'undefined') {
    return
  }

  uni.previewImage({
    current: currentUrl,
    urls: previewUrls
  })
}

function readCapsuleStyle() {
  // #ifdef MP-WEIXIN
  try {
    const systemInfo =
      typeof uni.getSystemInfoSync === 'function' ? uni.getSystemInfoSync() : {}
    const menuButton =
      typeof uni.getMenuButtonBoundingClientRect === 'function'
        ? uni.getMenuButtonBoundingClientRect()
        : typeof wx !== 'undefined' &&
            typeof wx.getMenuButtonBoundingClientRect === 'function'
          ? wx.getMenuButtonBoundingClientRect()
          : null

    if (!menuButton || !menuButton.width || !systemInfo.windowWidth) {
      return capsuleFallbackStyle
    }

    const statusBarHeight = systemInfo.statusBarHeight || 0
    const menuTop = Math.max(menuButton.top || statusBarHeight, statusBarHeight)
    const topGap = Math.max(menuTop - statusBarHeight, 6)
    const buttonHeight = Math.max(menuButton.height, 32)
    const safeRight = Math.max(
      systemInfo.windowWidth - menuButton.left + 8,
      104
    )
    const afterGap = Math.max(topGap + 10, 18)
    const reservedHeight = menuTop + buttonHeight

    return {
      '--status-bar-height': `${statusBarHeight}px`,
      '--capsule-safe-right': `${safeRight}px`,
      '--capsule-top-gap': `${topGap}px`,
      '--capsule-after-gap': `${afterGap}px`,
      '--capsule-button-height': `${buttonHeight}px`,
      '--capsule-reserved-height': `${reservedHeight}px`,
      '--capsule-block-offset': `${topGap + buttonHeight + afterGap}px`
    }
  } catch (error) {
    return capsuleFallbackStyle
  }
  // #endif

  return capsuleFallbackStyle
}

export function useCapsuleSafeArea() {
  const safeAreaStyle = shallowRef(readCapsuleStyle())

  onMounted(() => {
    safeAreaStyle.value = readCapsuleStyle()
  })

  return safeAreaStyle
}
