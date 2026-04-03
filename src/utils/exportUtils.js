import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const DEVICE_EXPORT = {
  iphone67: { exportW: 1290, exportH: 2796 },
  iphone65: { exportW: 1284, exportH: 2778 },
  ipad: { exportW: 2048, exportH: 2732 },
}

/**
 * Capture a hidden export card as a PNG data URL.
 *
 * html-to-image renders via SVG foreignObject — the browser handles all CSS
 * including object-fit:cover natively. However it requires the element to be
 * in the render tree (not off-screen / visibility:hidden).
 *
 * Fix: clone the element, append it to <body> at position fixed / z-index -1
 * (hidden behind the app's opaque background), capture, then remove the clone.
 */
async function captureElement(element, deviceType) {
  const { exportW, exportH } = DEVICE_EXPORT[deviceType] || DEVICE_EXPORT.iphone67
  const cssW = exportW / 3
  const cssH = exportH / 3

  await document.fonts.ready

  // Clone and mount on-screen so the browser lays it out and renders images
  const clone = element.cloneNode(true)
  Object.assign(clone.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: `${cssW}px`,
    height: `${cssH}px`,
    visibility: 'visible',
    zIndex: '-9999',
    pointerEvents: 'none',
  })
  document.body.appendChild(clone)

  // Wait for any images in the clone to finish loading (data URLs are instant
  // but the clone img elements still go through the decode pipeline)
  await Promise.all(
    [...clone.querySelectorAll('img')].map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => { img.onload = res; img.onerror = res }),
    ),
  )

  try {
    const dataUrl = await toPng(clone, {
      width: cssW,
      height: cssH,
      pixelRatio: 3,
      skipAutoScale: true,
    })
    return dataUrl
  } finally {
    document.body.removeChild(clone)
  }
}

/** Convert a PNG data URL to a Blob. */
function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export async function exportSingleScreenshot(screenshotId, template, deviceType, onProgress) {
  const el = document.getElementById(`export-card-${screenshotId}`)
  if (!el) return

  onProgress?.('Rendering…')
  try {
    const dataUrl = await captureElement(el, deviceType)
    saveAs(dataUrlToBlob(dataUrl), `screenshot-${screenshotId}.png`)
  } finally {
    onProgress?.(null)
  }
}

export async function exportAllScreenshots(screenshots, template, deviceType, onProgress) {
  if (screenshots.length === 0) return

  const zip = new JSZip()
  const folder = zip.folder('app-store-screenshots')

  for (let i = 0; i < screenshots.length; i++) {
    const ss = screenshots[i]
    onProgress?.(`Exporting ${i + 1} of ${screenshots.length}…`)

    const el = document.getElementById(`export-card-${ss.id}`)
    if (!el) continue

    const dataUrl = await captureElement(el, deviceType)
    folder.file(`screenshot-${String(i + 1).padStart(2, '0')}.png`, dataUrlToBlob(dataUrl))
  }

  onProgress?.('Creating ZIP…')
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, 'app-store-screenshots.zip')
  onProgress?.(null)
}
