// Only packaged assets and device-local files are allowed. In WeChat DevTools,
// local files use http://tmp/ and http://usr/ rather than wxfile://.
export function normalizeLocalImage(value) {
  if (typeof value !== 'string') return ''
  const source = value.trim()
  if (source.startsWith('//')) return ''
  return /^(?:\/|\.\.?\/|wxfile:\/\/|https?:\/\/(?:tmp|usr)\/|blob:|data:image\/)/i.test(source)
    ? source
    : ''
}
