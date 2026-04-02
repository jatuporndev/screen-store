import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const DEVICE_EXPORT = {
  iphone67: { exportW: 1290, exportH: 2796 },
  iphone65: { exportW: 1284, exportH: 2778 },
  ipad: { exportW: 2048, exportH: 2732 },
}

// Renders a hidden export div and captures it with html2canvas
async function captureElement(element) {
  // Wait for all web fonts (Inter, etc.) to finish loading so the
  // exported image matches what the browser renders in the preview
  await document.fonts.ready

  // Make element temporarily visible so html2canvas can measure it
  const prevVisibility = element.style.visibility
  element.style.visibility = 'visible'

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    })
    return canvas
  } finally {
    element.style.visibility = prevVisibility
  }
}

export async function exportSingleScreenshot(screenshotId, template, deviceType, onProgress) {
  const el = document.getElementById(`export-card-${screenshotId}`)
  if (!el) return

  onProgress?.('Rendering…')
  try {
    const canvas = await captureElement(el)
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'))
    saveAs(blob, `screenshot-${screenshotId}.png`)
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

    const canvas = await captureElement(el)
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'))
    folder.file(`screenshot-${String(i + 1).padStart(2, '0')}.png`, blob)
  }

  onProgress?.('Creating ZIP…')
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, 'app-store-screenshots.zip')
  onProgress?.(null)
}
