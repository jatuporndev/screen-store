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
 *   androidTablet → landscape (1920×1200); layout clamps so frame fits inside the card
 */

const DEVICE_RATIOS = {
  iphone67: 1290 / 2796,
  iphone65: 1284 / 2778,
  ipad: 2048 / 2732,
  android20_9: 1080 / 2400,
  android16_9: 1080 / 1920,
  androidTablet: 1920 / 1200,
}

const NOTCH_TYPE = {
  iphone67: 'di',
  iphone65: 'notch',
  ipad: 'none',
  android20_9: 'punch',
  android16_9: 'punch',
  androidTablet: 'none',
}

const ANDROID_PHONE_IDS = new Set(['android20_9', 'android16_9'])

/** Power key on the right — reads as Android slab phone */
const ANDROID_SIDE_BUTTONS = [{ side: 'right', topFrac: 0.22, hFrac: 0.09 }]

// Soft shadow — device reads slightly lifted; frame stays visually flat
const AMBIENT_SHADOW = [
  '0 1px 2px rgba(0,0,0,0.10)',
  '0 6px 16px rgba(0,0,0,0.08)',
  '0 16px 36px rgba(0,0,0,0.06)',
].join(', ')
/** Landscape tablet: tight card + bottom caption — large blur was painting over the text (layout box ignored shadow overflow). */
const TABLET_AMBIENT_SHADOW = '0 2px 6px rgba(0,0,0,0.14), 0 6px 14px rgba(0,0,0,0.08)'

// Outer rail: flat grey — tiny tonal shift only (no strong metallic banding)
const FRAME_RAIL_BG = 'linear-gradient(180deg, #b0b4bd 0%, #a9adb6 100%)'
const ANDROID_FRAME_RAIL_BG = 'linear-gradient(180deg, #9ea3ad 0%, #9398a2 100%)'

// Side hardware — low-profile “flat” keys (thin along edge, shallow standoff)
const SIDE_BUTTONS = [
  { side: 'left',  topFrac: 0.146, hFrac: 0.028 }, // Action
  { side: 'left',  topFrac: 0.206, hFrac: 0.056 }, // Vol +
  { side: 'left',  topFrac: 0.278, hFrac: 0.056 }, // Vol −
  { side: 'right', topFrac: 0.236, hFrac: 0.078 }, // Power (between vol pair)
]

/** Side keys: flat mid-grey (no white stripe / inset “3D”) */
const SIDE_BTN_GREY = '#7e828a'

function sideButtonSurfaceStyle(side, capR) {
  const isLeft = side === 'left'
  return {
    background: SIDE_BTN_GREY,
    borderRadius: isLeft ? `${capR}px 1px 1px ${capR}px` : `1px ${capR}px ${capR}px 1px`,
    boxShadow: 'none',
  }
}

export function PhoneCard({ screenshot, template, deviceType, cardWidth }) {
  const ratio     = DEVICE_RATIOS[deviceType] || DEVICE_RATIOS.iphone67
  const notchType = NOTCH_TYPE[deviceType]    || 'di'
  const isAndroidPhone = ANDROID_PHONE_IDS.has(deviceType)
  const isAndroidTablet = deviceType === 'androidTablet'
  const isAndroid = isAndroidPhone || isAndroidTablet
  const fullBleed = template.fullBleedMockup === true

  // Card dimensions
  const cardH = cardWidth / ratio

  const pad = fullBleed ? cardWidth * 0.028 : cardWidth * 0.04
  const innerW = cardWidth - 2 * pad
  const innerH = cardH - 2 * pad

  let phoneW
  let phoneH
  let textH
  /** Space between device and caption — real shadow extends past the phone’s layout box; flex gap reserves it. */
  let blockGap = 0

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
    // Landscape (ratio > 1): height-first sizing can make phoneW wider than innerW — scale to fit
    const scale = Math.min(1, innerW / phoneW, innerH / phoneH)
    phoneW *= scale
    phoneH *= scale
  } else {
    // Landscape tablets have a short card (ratio > 1) — dedicate more height to the text block
    // and scale the gap relative to innerH so thumbnails aren't wrecked by a fixed 12 px gap.
    const textFrac = isAndroidTablet ? 0.30 : 0.22
    blockGap = isAndroidTablet ? Math.max(2, Math.round(innerH * 0.08)) : 0
    // textH + blockGap + phoneH = innerH  ← exact partition, no overflow possible
    textH = innerH * textFrac
    phoneH = Math.max(0, innerH - textH - blockGap)
    phoneW = phoneH * ratio
    if (phoneW > innerW && phoneH > 0) {
      const s = innerW / phoneW
      phoneW = innerW
      phoneH *= s
    }
  }

  // --- Frame layers ---
  const bevel      = 1                   // 1px metallic bevel ring
  const bodyPad    = isAndroidTablet ? phoneW * 0.022 : phoneW * 0.017
  const outerR     = isAndroidTablet ? phoneW * 0.055 : isAndroid ? phoneW * 0.09 : phoneW * 0.12
  const bodyR      = outerR - bevel
  const screenR    = bodyR  - bodyPad
  const frameRailBg = isAndroid ? ANDROID_FRAME_RAIL_BG : FRAME_RAIL_BG
  const bodyFill = isAndroid ? '#121214' : '#0d0d0d'

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

  // --- Android punch-hole (center top) ---
  const punchD = screenW * 0.048
  const punchTop = screenH * 0.022

  // --- Side buttons: shallow standoff + squarer caps (reads flatter on the rail) ---
  const btnW = Math.max(2, phoneW * 0.0085)

  // --- Typography ---
  // For landscape tablets the text area (textH) is much shorter than a portrait card,
  // so scale fonts to textH rather than cardWidth to prevent overflow into the frame.
  const fontTitle = (!fullBleed && isAndroidTablet)
    ? Math.max(8, Math.round(textH * 0.38))
    : cardWidth * 0.083
  const fontSub = (!fullBleed && isAndroidTablet)
    ? Math.max(6, Math.round(textH * 0.24))
    : cardWidth * 0.054
  const textInternalGap = (!fullBleed && isAndroidTablet)
    ? Math.max(1, Math.round(textH * 0.04))
    : cardWidth * 0.018
  const isTop         = template.textPosition === 'top'
  const showSubtitle  = screenshot.showSubtitle !== false

  const textBlock = !fullBleed ? (
    <div
      style={{
        height: textH,
        flexShrink: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: `0 ${cardWidth * 0.07}px`,
        gap: textInternalGap,
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
      {!fullBleed && isAndroidPhone &&
        ANDROID_SIDE_BUTTONS.map((btn, i) => {
          const h = phoneH * btn.hFrac
          const capR = Math.max(1, Math.min(btnW * 0.28, h * 0.1))
          return (
            <div
              key={`a-${i}`}
              style={{
                position: 'absolute',
                width: btnW,
                height: h,
                top: phoneH * btn.topFrac,
                ...(btn.side === 'left' ? { left: -btnW } : { right: -btnW }),
                ...sideButtonSurfaceStyle(btn.side, capR),
              }}
            />
          )
        })}
      {!fullBleed &&
        (deviceType === 'iphone67' || deviceType === 'iphone65') &&
        SIDE_BUTTONS.map((btn, i) => {
          const h = phoneH * btn.hFrac
          const capR = Math.max(1, Math.min(btnW * 0.28, h * 0.1))
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: btnW,
                height: h,
                top: phoneH * btn.topFrac,
                ...(btn.side === 'left' ? { left: -btnW } : { right: -btnW }),
                ...sideButtonSurfaceStyle(btn.side, capR),
              }}
            />
          )
        })}

      {/* ── Bevel ring (1px metallic gradient) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: bevel,
          borderRadius: outerR + bevel,
          background: frameRailBg,
          boxShadow: isAndroidTablet ? TABLET_AMBIENT_SHADOW : AMBIENT_SHADOW,
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
            background: bodyFill,
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

            {/* ── Android punch-hole ── */}
            {notchType === 'punch' && (
              <div
                style={{
                  position: 'absolute',
                  top: punchTop,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: punchD,
                  height: punchD,
                  borderRadius: '50%',
                  background: '#080808',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                  zIndex: 10,
                }}
              />
            )}

            {/* ── Android tablet — subtle front cam in bezel ── */}
            {isAndroidTablet && (
              <div
                style={{
                  position: 'absolute',
                  top: screenH * 0.018,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: screenW * 0.018,
                  height: screenW * 0.018,
                  borderRadius: '50%',
                  background: '#1a1a1e',
                  border: '1px solid rgba(255,255,255,0.08)',
                  zIndex: 10,
                }}
              />
            )}

            {/* ── iPhone home indicator — flat bar (reads on dark UIs; like reference pill) ── */}
            {(deviceType === 'iphone67' || deviceType === 'iphone65') && (
              <div
                style={{
                  position: 'absolute',
                  bottom: screenH * 0.012,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: screenW * 0.368,
                  height: Math.max(4, screenW * 0.0072),
                  background: 'rgba(255,255,255,0.4)',
                  borderRadius: 999,
                  boxShadow: '0 0 0 0.5px rgba(0,0,0,0.22)',
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

            {/* ── Android gesture pill ── */}
            {isAndroidPhone && (
              <div
                style={{
                  position: 'absolute',
                  bottom: screenH * 0.012,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: screenW * 0.26,
                  height: Math.max(3, screenW * 0.0075),
                  background: 'rgba(255,255,255,0.32)',
                  borderRadius: 999,
                  zIndex: 10,
                }}
              />
            )}

            {/* ── Android tablet — optional nav hint ── */}
            {isAndroidTablet && (
              <div
                style={{
                  position: 'absolute',
                  bottom: screenH * 0.02,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: screenW * 0.06,
                  height: Math.max(2, screenH * 0.004),
                  background: 'rgba(255,255,255,0.22)',
                  borderRadius: 2,
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
        flexShrink: 0,
        background: template.background,
        // Larger corner radius for a more modern App Store card feel
        borderRadius: cardWidth * 0.09,
        display: 'flex',
        flexDirection: 'column',
        // Full-bleed: stretch so inner row is full width; phone is centered inside wrapper
        alignItems: fullBleed ? 'stretch' : 'center',
        justifyContent: fullBleed ? 'center' : isTop ? 'flex-start' : 'flex-end',
        padding: `${pad}px`,
        gap: fullBleed ? 0 : blockGap,
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
