/**
 * ScreenshotPreview renders one App Store screenshot card:
 * background + device frame + text overlay.
 *
 * cardWidth drives all proportions. The card aspect ratio matches
 * the target export dimensions for the selected device.
 *
 * PhoneCard is also exported so App.jsx can render all hidden
 * export cards (one per screenshot) for html2canvas capture.
 */

const DEVICE_RATIOS = {
  iphone67: 1290 / 2796, // ~0.4614
  iphone65: 1284 / 2778, // ~0.4622
  ipad: 2048 / 2732, // ~0.7496
}

const DEVICE_FRAME = {
  iphone67: { radius: 0.12, borderFrac: 0.018, diW: 0.265, diH: 0.026 },
  iphone65: { radius: 0.11, borderFrac: 0.018, diW: 0.27, diH: 0.027 },
  ipad: { radius: 0.05, borderFrac: 0.012, diW: 0, diH: 0 },
}

export function PhoneCard({ screenshot, template, deviceType, cardWidth }) {
  const ratio = DEVICE_RATIOS[deviceType] || DEVICE_RATIOS.iphone67
  const frame = DEVICE_FRAME[deviceType] || DEVICE_FRAME.iphone67

  const cardH = cardWidth / ratio
  const textFrac = 0.22
  const textH = cardH * textFrac
  const phoneH = cardH * (1 - textFrac) - cardWidth * 0.04
  const phoneW = phoneH * ratio
  const border = phoneW * frame.borderFrac
  const radius = phoneW * frame.radius
  const diW = phoneW * frame.diW
  const diH = phoneW * frame.diH
  const diTop = border * 1.8
  const fontTitle = cardWidth * 0.083
  const fontSub = cardWidth * 0.054
  const isTop = template.textPosition === 'top'
  const showSubtitle = screenshot.showSubtitle !== false

  const textBlock = (
    <div
      style={{
        height: textH,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: `0 ${cardWidth * 0.07}px`,
        gap: cardWidth * 0.018,
      }}
    >
      <div
        style={{
          color: template.titleColor,
          fontSize: fontTitle,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {screenshot.title || 'Your Feature Title'}
      </div>
      {showSubtitle && (
        <div
          style={{
            color: template.subtitleColor,
            fontSize: fontSub,
            fontWeight: 400,
            lineHeight: 1.4,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {screenshot.subtitle || 'Describe your feature here'}
        </div>
      )}
    </div>
  )

  const phoneBlock = (
    <div
      style={{
        width: phoneW,
        height: phoneH,
        background: '#111',
        borderRadius: radius,
        border: `${border}px solid #2a2a2a`,
        boxShadow: `0 0 0 ${border * 0.4}px #444, 0 ${cardWidth * 0.04}px ${cardWidth * 0.12}px rgba(0,0,0,0.55)`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {screenshot.dataUrl && (
        // Use background-image instead of <img object-fit:cover> because
        // html2canvas does not support object-fit on img tags, causing the
        // export to look different from the preview.
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${screenshot.dataUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      {frame.diW > 0 && (
        <div
          style={{
            position: 'absolute',
            top: diTop,
            left: '50%',
            transform: 'translateX(-50%)',
            width: diW,
            height: diH,
            background: '#000',
            borderRadius: diH / 2,
            zIndex: 10,
          }}
        />
      )}
      {deviceType === 'ipad' && (
        <div
          style={{
            position: 'absolute',
            bottom: phoneH * 0.02,
            left: '50%',
            transform: 'translateX(-50%)',
            width: phoneW * 0.12,
            height: phoneH * 0.006,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 3,
          }}
        />
      )}
    </div>
  )

  return (
    <div
      style={{
        width: cardWidth,
        height: cardH,
        background: template.background,
        borderRadius: cardWidth * 0.04,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isTop ? 'flex-start' : 'flex-end',
        padding: `${cardWidth * 0.04}px ${cardWidth * 0.04}px`,
        gap: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {isTop ? (
        <>
          {textBlock}
          {phoneBlock}
        </>
      ) : (
        <>
          {phoneBlock}
          {textBlock}
        </>
      )}
    </div>
  )
}

export default function ScreenshotPreview({ screenshot, template, deviceType, cardWidth = 240 }) {
  if (!screenshot) return null

  return (
    <PhoneCard
      screenshot={screenshot}
      template={template}
      deviceType={deviceType}
      cardWidth={cardWidth}
    />
  )
}
