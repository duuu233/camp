import { normalizeLocalImage } from './localImage.js'

function fileSystem() {
  return typeof wx !== 'undefined' && typeof wx.getFileSystemManager === 'function'
    ? wx.getFileSystemManager()
    : null
}

function ownedAvatar(filePath) {
  const directory = typeof wx !== 'undefined' && wx.env?.USER_DATA_PATH
  return !!directory && typeof filePath === 'string' && filePath.startsWith(`${directory}/camp-avatar-`)
}

export function readLocalAvatar(value) {
  const source = normalizeLocalImage(value)
  if (!source) return ''
  if (ownedAvatar(source)) {
    try { fileSystem().accessSync(source) } catch { return '' }
    return source
  }
  return source.startsWith('/static/') ? source : ''
}

export function removeLocalAvatar(value) {
  if (!ownedAvatar(value)) return
  try { fileSystem().unlinkSync(value) } catch { /* Already removed. */ }
}

export async function persistLocalAvatar(value) {
  const source = normalizeLocalImage(value)
  if (!source || source.startsWith('/static/') || ownedAvatar(source)) return readLocalAvatar(source)
  const fs = fileSystem()
  if (!fs || !wx.env?.USER_DATA_PATH) throw new Error('当前环境不支持保存本地头像')
  const extension = source.split('?')[0].match(/\.(png|jpe?g|webp)$/i)?.[1] || 'jpg'
  const target = `${wx.env.USER_DATA_PATH}/camp-avatar-local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
  await new Promise((resolve, reject) => fs.copyFile({
    srcPath: source,
    destPath: target,
    success: resolve,
    fail: () => reject(new Error('头像保存失败，请检查设备存储空间'))
  }))
  return target
}
