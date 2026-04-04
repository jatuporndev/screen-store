import { FEATURE_GRAPHIC_H, FEATURE_GRAPHIC_W } from '../data/featureGraphic'

/**
 * Google Play feature graphic: flat 1024×500 style banner (no device frame).
 * cardWidth sets layout size; export uses FEATURE_GRAPHIC_W/H via scale (cardWidth = W/3, pixelRatio 3).
 */
export default function FeatureGraphicCard({ featureGraphic, appInfo, cardWidth }) {
  const cardHeight = (cardWidth * FEATURE_GRAPHIC_H) / FEATURE_GRAPHIC_W
  const {
    background,
    title,
    subtitle,
    showSubtitle,
    titleColor,
    subtitleColor,
    useAppIcon,
    iconDataUrl,
  } = featureGraphic
  const fromApp = appInfo?.icon || null
  const iconSrc =
    useAppIcon && (iconDataUrl || fromApp) ? iconDataUrl || fromApp : null
  const padX = cardWidth * 0.055
  const padY = cardHeight * 0.12
  const iconSize = Math.min(cardHeight * 0.68, cardWidth * 0.22)

  return (
    <div
      style={{
        width: cardWidth,
        height: cardHeight,
        boxSizing: 'border-box',
        background,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: `${padY}px ${padX}px`,
        gap: iconSrc ? cardWidth * 0.035 : 0,
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {iconSrc && (
        <div
          style={{
            width: iconSize,
            height: iconSize,
            flexShrink: 0,
            borderRadius: iconSize * 0.22,
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          }}
        >
          <img
            src={iconSrc}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: cardHeight * 0.045,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            color: titleColor,
            fontSize: cardWidth * 0.062,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            maxHeight: cardHeight * 0.42,
            overflow: 'hidden',
          }}
        >
          {title || 'Your App Name'}
        </div>
        {showSubtitle !== false && (
          <div
            style={{
              color: subtitleColor,
              fontSize: cardWidth * 0.034,
              fontWeight: 500,
              lineHeight: 1.35,
              maxHeight: cardHeight * 0.36,
              overflow: 'hidden',
            }}
          >
            {subtitle || 'Short tagline'}
          </div>
        )}
      </div>
    </div>
  )
}
