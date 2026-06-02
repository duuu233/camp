import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { brand } from '../data/campData.js'

const defaultShareTitle = `${brand.name} · ${brand.tagline}`
const defaultSharePath = '/pages/index/index'

function readShareImage(imageUrl) {
  if (typeof imageUrl === 'function') {
    return imageUrl()
  }

  if (imageUrl && typeof imageUrl === 'object' && 'value' in imageUrl) {
    return imageUrl.value
  }

  return typeof imageUrl === 'string' ? imageUrl : ''
}

// 统一注册微信小程序的「分享给好友」和「分享到朋友圈」。
// imageUrl 支持字符串、ref 或 getter，分享时再读取，未解析到时交给微信截图兜底。
export function useShare(options = {}) {
  const {
    title = defaultShareTitle,
    path = defaultSharePath,
    query = '',
    imageUrl
  } = options

  // #ifdef MP-WEIXIN
  onShareAppMessage(() => {
    const message = { title, path }
    const resolvedImage = readShareImage(imageUrl)

    if (resolvedImage) {
      message.imageUrl = resolvedImage
    }

    return message
  })

  onShareTimeline(() => {
    const message = { title, query }
    const resolvedImage = readShareImage(imageUrl)

    if (resolvedImage) {
      message.imageUrl = resolvedImage
    }

    return message
  })
  // #endif
}
