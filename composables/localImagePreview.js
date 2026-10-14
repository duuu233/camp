import { normalizeLocalImage } from './localImage.js'

// Native preview needs a device file, rather than a code-package image URL.
export function createLocalImagePreview(api, { fileSystem, userDirectory } = {}) {
  const files = new Map()
  let opening = false

  function resolveImage(source) {
    if (files.has(source)) return files.get(source)
    const request = new Promise((resolve, reject) => {
      api.getImageInfo({
        src: source,
        success: info => {
          if (!info.path) {
            reject(new Error('Image info returned no file path'))
            return
          }
          if (!source.startsWith('/') || !fileSystem || !userDirectory) {
            resolve(normalizeLocalImage(info.path) || `/${info.path}`)
            return
          }

          // Stable names bound cache size to the number of packaged images.
          // Copy again after each cold start so updated posters are not stale.
          const fileName = encodeURIComponent(source).replaceAll('_', '%5F').replaceAll('%', '_')
          const target = `${userDirectory}/camp-preview-${fileName}`
          try {
            fileSystem.copyFile({
              srcPath: info.path,
              destPath: target,
              success: () => resolve(target),
              fail: reject
            })
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
    files.set(source, request)
    request.catch(() => files.delete(source))
    return request
  }

  return async function preview(current, urls = [current]) {
    const currentSource = normalizeLocalImage(current)
    if (!currentSource || opening) return false
    const sources = [...new Set((Array.isArray(urls) ? urls : [current])
      .map(normalizeLocalImage).filter(Boolean))]
    if (!sources.includes(currentSource)) sources.unshift(currentSource)

    opening = true
    try {
      const results = await Promise.allSettled(sources.map(resolveImage))
      const currentResult = results[sources.indexOf(currentSource)]
      if (currentResult.status === 'rejected') throw currentResult.reason
      const previewUrls = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)

      await new Promise((resolve, reject) => api.previewImage({
        current: currentResult.value,
        urls: previewUrls,
        success: resolve,
        fail: reject
      }))
      return true
    } catch (error) {
      sources.forEach(source => files.delete(source))
      if (!/cancel/i.test(error?.errMsg || '')) {
        console.warn('[local-image-preview]', currentSource, error)
        api.showToast({ title: '图片加载失败，请重试', icon: 'none' })
      }
      return false
    } finally {
      opening = false
    }
  }
}
