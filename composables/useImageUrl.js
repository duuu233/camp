import { computed, onMounted, shallowRef } from 'vue'
import { normalizeLocalImage } from './localImage.js'
import { createLocalImagePreview } from './localImagePreview.js'

let previewLocalImage

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

// Local assets resolve synchronously, including share cards on the first render.
export function useImageUrl(source) {
  return computed(() => normalizeLocalImage(readSource(source)))
}

export function previewImageUrl(current, urls) {
  if (typeof uni === 'undefined') return
  if (!previewLocalImage) {
    const options = {}
    // #ifdef MP-WEIXIN
    if (typeof wx !== 'undefined' && wx.getFileSystemManager && wx.env?.USER_DATA_PATH) {
      options.fileSystem = wx.getFileSystemManager()
      options.userDirectory = wx.env.USER_DATA_PATH
    }
    // #endif
    previewLocalImage = createLocalImagePreview(uni, options)
  }
  return previewLocalImage(
    readSource(current),
    Array.isArray(urls) ? urls.map(readSource) : undefined
  )
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
