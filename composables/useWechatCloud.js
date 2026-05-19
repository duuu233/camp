import { cloudEnvId } from '../data/campData.js'

let wxCloudReady = false

export function ensureWechatCloudReady() {
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    if (wxCloudReady) {
      resolve()
      return
    }

    if (typeof wx === 'undefined' || !wx.cloud) {
      reject(new Error('当前微信版本不支持云开发'))
      return
    }

    try {
      wx.cloud.init({
        env: cloudEnvId,
        traceUser: true
      })
      wxCloudReady = true
      resolve()
    } catch (error) {
      reject(error)
    }
  })
  // #endif

  // #ifndef MP-WEIXIN
  return Promise.reject(new Error('请在微信小程序中使用微信云开发能力'))
  // #endif
}

export async function callWechatCloudFunction({ name, data = {} }) {
  await ensureWechatCloudReady()

  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => {
        resolve(res.result || {})
      },
      fail: reject
    })
  })
}

export async function uploadWechatCloudFile({ cloudPath, filePath }) {
  await ensureWechatCloudReady()

  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        resolve(res.fileID || '')
      },
      fail: reject
    })
  })
}
