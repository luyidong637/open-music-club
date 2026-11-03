const PICTURE_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
])

async function readMusicMetadata(filePath) {
  const { parseFile } = await import('music-metadata')
  const metadata = await parseFile(filePath)
  const common = metadata.common || {}
  const format = metadata.format || {}
  const picture = Array.isArray(common.picture) ? common.picture[0] : null
  const pictureMimeType = picture?.format?.toLowerCase()

  return {
    // 风格标签只取第一个 genre，供音乐盲盒做标签过滤；缺失时留空，不做猜测。
    genre: Array.isArray(common.genre) ? String(common.genre[0] || '').slice(0, 60) : '',
    title: common.title || '',
    artist: common.artist || common.albumartist || '',
    album: common.album || '',
    durationMs: Number.isFinite(format.duration)
      ? Math.max(0, Math.round(format.duration * 1000))
      : 0,
    container: format.container || '',
    picture:
      picture && PICTURE_TYPES.has(pictureMimeType)
        ? {
            data: Buffer.from(picture.data),
            mimeType: pictureMimeType,
            extension: PICTURE_TYPES.get(pictureMimeType),
          }
        : null,
  }
}

module.exports = {
  readMusicMetadata,
}
