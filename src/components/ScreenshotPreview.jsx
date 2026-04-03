/**
 * PhoneCard renders one App Store screenshot card.
 *
 * Frame construction (outside → in):
 *   bevel (1px metallic gradient ring)
 *   → body (dark matte casing, bodyPad thick)
 *   → screen (clipped, image + overlays)
 *
 * Notch types:
 *   iphone67 → Dynamic Island (pill + camera lens)
 *   iphone65 → Traditional notch (iPhone XS Max)
 *   ipad     → Home indicator bar
 */

const DEVICE_RATIOS = {
  iphone67: 1290 / 2796,
  iphone65: 1284 / 2778,
  ipad: 2048 / 2732,
}

const NOTCH_TYPE = {
  iphone67: 'di',
  iphone65: 'notch',
  ipad: 'none',
}

// Soft shadow — flat orthographic App Store style (reference: minimal float)
const AMBIENT_SHADOW = [
  '0 1px 2px rgba(0,0,0,0.10)',
  '0 6px 16px rgba(0,0,0,0.08)',
  '0 16px 36px rgba(0,0,0,0.06)',
].join(', ')

// Side hardware — fractions of phoneH; subtle metallic read like marketing mockups
const SIDE_BUTTONS = [
  { side: 'left',  topFrac: 0.155, hFrac: 0.031 }, // Action
  { side: 'left',  topFrac: 0.215, hFrac: 0.058 }, // Vol +
  { side: 'left',  topFrac: 0.293, hFrac: 0.058 }, // Vol −
  { side: 'right', topFrac: 0.215, hFrac: 0.078 }, // Power
]

export function PhoneCard({ screenshot, template, deviceType, cardWidth }) {
  const ratio     = DEVICE_RATIOS[deviceType] || DEVICE_RATIOS.iphone67
  const notchType = NOTCH_TYPE[deviceType]    || 'di'
  const fullBleed = template.fullBleedMockup === true

  // Card dimensions
  const cardH = cardWidth / ratio

  const pad = fullBleed ? cardWidth * 0.028 : cardWidth * 0.04
  const innerW = cardWidth - 2 * pad
  const innerH = cardH - 2 * pad

  let phoneW
  let phoneH
  let textH

  if (fullBleed) {
    textH = 0
    const hIfFullW = innerW / ratio
    if (hIfFullW <= innerH) {
      phoneW = innerW
      phoneH = hIfFullW
    } else {
      phoneH = innerH
      phoneW = phoneH * ratio
    }
  } else {
    const textFrac = 0.22
    textH = cardH * textFrac
    phoneH = cardH * (1 - textFrac) - cardWidth * 0.04
    phoneW = phoneH * ratio
  }

  // --- Frame layers ---
  const bevel      = 1                   // 1px metallic bevel ring
  const bodyPad    = phoneW * 0.017     // thin black bezel (App Store card style)
  const outerR     = phoneW * 0.12       // outer corner radius (matches real iPhone proportions)
  const bodyR      = outerR - bevel
  const screenR    = bodyR  - bodyPad

  // Screen area inside the bezel
  const screenW = phoneW - 2 * (bevel + bodyPad)
  const screenH = phoneH - 2 * (bevel + bodyPad)

  // --- Dynamic Island (iPhone 14 Pro+ style) ---
  // Real proportions: ~126pt wide × 37pt tall on a 393pt screen ≈ 32% × 9.4%
  const diW      = screenW * 0.35
  const diH      = screenW * 0.094
  const diTopGap = screenH * 0.014

  // --- Traditional notch (iPhone XS Max) ---
  const notchW = screenW * 0.44
  const notchH = screenW * 0.073
  const notchR = notchH * 0.45           // rounded bottom corners

  // --- Side buttons: slight standoff + soft metallic highlight ---
  const btnW = Math.max(2, phoneW * 0.017)
  const btnR = Math.max(1, btnW * 0.42)

  // --- Typography ---
  const fontTitle = cardWidth * 0.083
  const fontSub   = cardWidth * 0.054
  const isTop         = template.textPosition === 'top'
  const showSubtitle  = screenshot.showSubtitle !== false

  const textBlock = !fullBleed ? (
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
  ) : null

  const phoneBlock = (
    <div style={{ position: 'relative', flexShrink: 0, width: phoneW, height: phoneH }}>

      {/* Side buttons skipped for full-bleed — asymmetric L/R volume reads as off-center */}
      {!fullBleed &&
        (deviceType === 'iphone67' || deviceType === 'iphone65') &&
        SIDE_BUTTONS.map((btn, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: btnW,
              height: phoneH * btn.hFrac,
              top: phoneH * btn.topFrac,
              ...(btn.side === 'left' ? { left: -btnW } : { right: -btnW }),
              background:
                btn.side === 'left'
                  ? 'linear-gradient(to right, #2c2c2c, #5c5c5c 48%, #343434)'
                  : 'linear-gradient(to left, #2c2c2c, #5c5c5c 48%, #343434)',
              borderRadius:
                btn.side === 'left'
                  ? `${btnR}px 0 0 ${btnR}px`
                  : `0 ${btnR}px ${btnR}px 0`,
            }}
          />
        ))}

      {/* ── Bevel ring (1px metallic gradient) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: bevel,
          borderRadius: outerR + bevel,
          background:
            'linear-gradient(145deg, #525252 0%, #383838 42%, #161616 100%)',
          boxShadow: AMBIENT_SHADOW,
          boxSizing: 'border-box',
        }}
      >
        {/* ── Dark matte body ── */}
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: bodyPad,
            borderRadius: bodyR,
            background: '#0d0d0d',
            boxSizing: 'border-box',
          }}
        >
          {/* ── Screen (clipped) ── */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: screenR,
              overflow: 'hidden',
              position: 'relative',
              background: '#000',
            }}
          >

            {/* Screenshot image — <img> + object-fit renders reliably in html2canvas; background-image + cover often leaves a black band at the top of the screen */}
            {screenshot.dataUrl && (
              <img
                alt=""
                src={screenshot.dataUrl}
                data-export-cover="true"
                draggable={false}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  borderRadius: screenR,
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* ── Dynamic Island ── */}
            {notchType === 'di' && (
              <div
                style={{
                  position: 'absolute',
                  top: diTopGap,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: diW,
                  height: diH,
                  borderRadius: 999,
                  background: '#000',
                  zIndex: 10,
                }}
              />
            )}

            {/* ── Traditional notch (iPhone XS Max) ── */}
            {notchType === 'notch' && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: notchW,
                  height: notchH,
                  background: '#000',
                  borderBottomLeftRadius: notchR,
                  borderBottomRightRadius: notchR,
                  zIndex: 10,
                }}
              />
            )}

            {/* ── iPhone home indicator (thin bar, iOS) ── */}
            {(deviceType === 'iphone67' || deviceType === 'iphone65') && (
              <div
                style={{
                  position: 'absolute',
                  bottom: screenH * 0.011,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: screenW * 0.34,
                  height: Math.max(3, screenH * 0.0038),
                  background: 'rgba(255,255,255,0.38)',
                  borderRadius: 999,
                  zIndex: 10,
                }}
              />
            )}

            {/* ── iPad home indicator ── */}
            {deviceType === 'ipad' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: screenH * 0.018,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: screenW * 0.12,
                  height: Math.max(2, screenH * 0.005),
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: 3,
                  zIndex: 10,
                }}
              />
            )}

            {/* ── Inset depth shadow (recesses screen into bezel) ── */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: screenR,
                boxShadow: 'inset 0 0 4px 1px rgba(0,0,0,0.42)',
                pointerEvents: 'none',
                zIndex: 6,
              }}
            />

            {/* ── Glass glint — sharp diagonal cut ── */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(155deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 34%, transparent 34%)',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />

            {/* ── Glass glint — soft ambient wash ── */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.022) 0%, transparent 52%)',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />

          </div>{/* /screen */}
        </div>{/* /body */}
      </div>{/* /bevel */}

    </div>
  )

  return (
    <div
      style={{
        width: cardWidth,
        height: cardH,
        background: template.background,
        // Larger corner radius for a more modern App Store card feel
        borderRadius: cardWidth * 0.09,
        display: 'flex',
        flexDirection: 'column',
        // Full-bleed: stretch so inner row is full width; phone is centered inside wrapper
        alignItems: fullBleed ? 'stretch' : 'center',
        justifyContent: fullBleed ? 'center' : isTop ? 'flex-start' : 'flex-end',
        padding: `${pad}px`,
        gap: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {fullBleed ? (
        <div
          style={{
            width: '100%',
            alignSelf: 'stretch',
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {phoneBlock}
        </div>
      ) : isTop ? (
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
