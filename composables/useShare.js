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

// 重要：onShareAppMessage / onShareTimeline 必须在页面 <script setup> 里直接调用。
// uni-app 编译期通过静态分析识别这两个调用，才会给小程序 Page 注册分享方法；
// 一旦把它们封装进组合式函数，编译器扫不到，微信「···」里的转发按钮就会置灰。
// 所以这里只负责拼装分享内容，钩子注册留在各页面。
// imageUrl 支持字符串 / ref / getter，分享时再读取，解析不到就交给微信截图兜底。

export function buildShareMessage(options = {}) {
  const { title = defaultShareTitle, path = defaultSharePath, imageUrl } = options
  const message = { title, path }
  const resolvedImage = readShareImage(imageUrl)

  if (resolvedImage) {
    message.imageUrl = resolvedImage
  }

  return message
}

export function buildShareTimeline(options = {}) {
  const { title = defaultShareTitle, query = '', imageUrl } = options
  const message = { title, query }
  const resolvedImage = readShareImage(imageUrl)

  if (resolvedImage) {
    message.imageUrl = resolvedImage
  }

  return message
}

// 显式打开「转发」和「分享到朋友圈」菜单项，作为兜底——
// 即使某些机型/基础库默认把分享按钮置灰，这里也会主动启用。
// 放在页面 onShow 里调用即可。
export function enableShareMenu() {
  // #ifdef MP-WEIXIN
  if (typeof uni !== 'undefined' && typeof uni.showShareMenu === 'function') {
    uni.showShareMenu({
      withShareTicket: false,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
  // #endif
}
