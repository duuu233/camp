import { shallowRef, watch } from 'vue'
import { cloudEnvId } from '../data/campData.js'

const tempUrlCache = new Map()
const pendingUrlCache = new Map()
let wxCloudReady = false

function readSource(source) {
  if (typeof source === 'function') {
    return source()
  }

  if (source && typeof source === 'object' && 'value' in source) {
    return source.value
  }

  return source
}

function isCloudFileId(url) {
  return typeof url === 'string' && url.startsWith('cloud://')
}

function ensureWxCloud() {
  // #ifdef MP-WEIXIN
  if (typeof wx === 'undefined' || !wx.cloud) {
    return false
  }

  if (!wxCloudReady) {
    wx.cloud.init({
      env: cloudEnvId,
      traceUser: true
    })
    wxCloudReady = true
  }

  return true
  // #endif

  // #ifndef MP-WEIXIN
  return false
  // #endif
}

export function resolveCloudImageUrl(fileId) {
  if (!fileId) {
    return Promise.resolve('')
  }

  if (!isCloudFileId(fileId)) {
    return Promise.resolve(fileId)
  }

  if (tempUrlCache.has(fileId)) {
    return Promise.resolve(tempUrlCache.get(fileId))
  }

  if (pendingUrlCache.has(fileId)) {
    return pendingUrlCache.get(fileId)
  }

  if (!ensureWxCloud()) {
    return Promise.resolve('')
  }

  const request = new Promise(resolve => {
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: res => {
        const file = res.fileList && res.fileList[0]
        const tempUrl =
          file && file.status === 0 && file.tempFileURL ? file.tempFileURL : ''

        if (tempUrl) {
          tempUrlCache.set(fileId, tempUrl)
        }

        resolve(tempUrl)
      },
      fail: () => {
        resolve('')
      }
    })
  })

  pendingUrlCache.set(fileId, request)
  request.then(() => pendingUrlCache.delete(fileId))

  return request
}

export function useCloudImageUrl(source) {
  const imageUrl = shallowRef('')
  let requestId = 0

  watch(
    () => readSource(source),
    async fileId => {
      const currentRequestId = ++requestId
      const resolvedUrl = await resolveCloudImageUrl(fileId)

      if (currentRequestId === requestId) {
        imageUrl.value = resolvedUrl
      }
    },
    { immediate: true }
  )

  return imageUrl
}
