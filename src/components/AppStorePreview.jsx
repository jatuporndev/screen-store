import { useState, useRef } from 'react'
import { Star, ChevronRight, Share2, Heart, Download } from 'lucide-react'
import ScreenshotPreview from './ScreenshotPreview'
import { exportSingleScreenshot, exportAllScreenshots } from '../utils/exportUtils'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i
        const half = !filled && rating >= i - 0.5
        return (
          <div key={i} style={{ position: 'relative', width: 12, height: 12 }}>
            <Star size={12} color="#888" fill="transparent" />
            {(filled || half) && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  width: half ? '50%' : '100%',
                }}
              >
                <Star size={12} color="#ffd60a" fill="#ffd60a" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AppIcon({ icon, name, size = 80 }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="rounded-[22%] overflow-hidden shrink-0 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: icon
          ? 'transparent'
          : 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
      }}
    >
      {icon ? (
        <img src={icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ color: '#fff', fontSize: size * 0.3, fontWeight: 700, fontFamily: 'Inter' }}>
          {initials || 'A'}
        </span>
      )}
    </div>
  )
}

function RatingBadge({ rating, count }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <StarRating rating={rating} />
      <span className="text-xs" style={{ color: '#8e8e93' }}>
        {count} Ratings
      </span>
    </div>
  )
}

function InfoBadge({ label, value }) {
  return (
    <div
      className="flex flex-col items-center px-4 py-3 rounded-xl shrink-0"
      style={{ background: '#1c1c1e', border: '1px solid #2c2c2e', minWidth: 80 }}
    >
      <span className="text-xs font-semibold" style={{ color: '#ebebf5', fontSize: 15 }}>
        {value}
      </span>
      <span className="text-xs mt-0.5 uppercase tracking-wider" style={{ color: '#636366', fontSize: 10 }}>
        {label}
      </span>
    </div>
  )
}

const DESCRIPTION =
  "Experience the next level of productivity. Beautifully designed and meticulously crafted, this app transforms the way you work, play, and create. With an intuitive interface and powerful features, you'll wonder how you ever managed without it."

export default function AppStorePreview({ screenshots, template, deviceType, appInfo, setAppInfo }) {
  const [exportStatus, setExportStatus] = useState(null)
  const scrollRef = useRef(null)

  const CARD_W = 220

  const handleExportAll = () =>
    exportAllScreenshots(screenshots, template, deviceType, setExportStatus)

  if (screenshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ color: '#55556a' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="4" stroke="#252535" strokeWidth="1.5" />
          <path d="M3 9h18M9 21V9" stroke="#252535" strokeWidth="1.5" />
        </svg>
        <div className="text-center">
          <p className="font-semibold" style={{ color: '#88889a' }}>
            No screenshots to preview
          </p>
          <p className="text-sm mt-1" style={{ color: '#33334a' }}>
            Go to Editor and upload screenshots first
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-full"
      style={{ background: '#000', fontFamily: 'Inter, -apple-system, sans-serif' }}
    >
      {/* iOS-style status bar */}
      <div
        className="flex items-center justify-between px-6"
        style={{ height: 44, background: '#000', borderBottom: '1px solid #1c1c1e' }}
      >
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>9:41</span>
        <div
          className="flex items-center justify-center"
          style={{ flex: 1 }}
        >
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>App Store</span>
        </div>
        <div className="flex items-center gap-1">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
            <rect x="0" y="4" width="3" height="8" rx="1" />
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" />
            <rect x="9" y="1" width="3" height="11" rx="1" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* App Store nav */}
      <div
        className="flex items-center px-5 gap-3"
        style={{ height: 52, background: '#111', borderBottom: '1px solid #1c1c1e' }}
      >
        <button style={{ color: '#007aff', fontSize: 14 }}>
          ‹ Search
        </button>
        <div className="flex-1" />
        <Share2 size={18} color="#007aff" />
      </div>

      {/* App Header */}
      <div className="px-5 py-5" style={{ background: '#111', borderBottom: '1px solid #1c1c1e' }}>
        <div className="flex items-start gap-4">
          <AppIcon icon={appInfo.icon} name={appInfo.name} size={100} />
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold leading-tight"
              style={{ color: '#fff', fontSize: 22, letterSpacing: '-0.3px' }}
            >
              {appInfo.name || 'App Name'}
            </h1>
            <p className="mt-0.5" style={{ color: '#007aff', fontSize: 14 }}>
              {appInfo.developer || 'Developer'}
            </p>
            <p className="mt-1" style={{ color: '#636366', fontSize: 13 }}>
              {appInfo.category || 'Productivity'}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <button
                className="flex items-center justify-center rounded-2xl font-bold"
                style={{
                  background: '#007aff',
                  color: '#fff',
                  padding: '8px 28px',
                  fontSize: 15,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {appInfo.price === 'Free' ? 'GET' : appInfo.price}
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Heart size={22} color="#007aff" />
              </button>
            </div>
          </div>
        </div>

        {/* Rating row */}
        <div
          className="flex items-center gap-3 sm:gap-6 mt-5 pt-4 overflow-x-auto pb-1 -mx-1 px-1"
          style={{ borderTop: '1px solid #2c2c2e' }}
        >
          <InfoBadge label="Rating" value={appInfo.rating?.toFixed(1) || '4.5'} />
          <InfoBadge label="Category" value={appInfo.category?.slice(0, 6) || 'Prod.'} />
          <InfoBadge label="Age" value="4+" />
          <InfoBadge label="Size" value="24MB" />
        </div>
      </div>

      {/* Screenshots gallery */}
      <div className="py-5" style={{ background: '#111', borderBottom: '1px solid #1c1c1e' }}>
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="font-semibold text-sm" style={{ color: '#ebebf5' }}>
            Screenshots
          </h2>
          <div className="flex items-center gap-3">
            {exportStatus && (
              <span className="text-xs" style={{ color: '#55556a' }}>
                {exportStatus}
              </span>
            )}
            <button
              onClick={handleExportAll}
              disabled={!!exportStatus}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: 'rgba(0,122,255,0.15)',
                color: '#007aff',
                border: '1px solid rgba(0,122,255,0.3)',
                cursor: exportStatus ? 'not-allowed' : 'pointer',
              }}
            >
              <Download size={11} />
              Export All
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto"
          style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}
        >
          {screenshots.map((ss) => (
            <div key={ss.id} className="shrink-0 relative group">
              <ScreenshotPreview
                screenshot={ss}
                template={ss.customStyle || template}
                deviceType={deviceType}
                cardWidth={CARD_W}
              />
              {/* Individual download overlay */}
              <button
                onClick={() =>
                  exportSingleScreenshot(ss.id, template, deviceType, setExportStatus)
                }
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Download size={10} />
                Save
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-5" style={{ background: '#111', borderBottom: '1px solid #1c1c1e' }}>
        <h2 className="font-semibold text-sm mb-3" style={{ color: '#ebebf5' }}>
          Description
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#ebebf5', opacity: 0.8 }}>
          {DESCRIPTION}
        </p>
        <button className="flex items-center gap-1 mt-2" style={{ color: '#007aff', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          more <ChevronRight size={12} />
        </button>
      </div>

      {/* Ratings & Reviews */}
      <div className="px-5 py-5" style={{ background: '#111', borderBottom: '1px solid #1c1c1e' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm" style={{ color: '#ebebf5' }}>
            Ratings & Reviews
          </h2>
          <button className="flex items-center gap-1" style={{ color: '#007aff', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
            See All <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span style={{ color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
              {appInfo.rating?.toFixed(1) || '4.5'}
            </span>
            <span style={{ color: '#636366', fontSize: 12 }}>out of 5</span>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((n) => {
              const pct = n === 5 ? 72 : n === 4 ? 18 : n === 3 ? 6 : n === 2 ? 2 : 2
              return (
                <div key={n} className="flex items-center gap-2 mb-1">
                  <span style={{ color: '#636366', fontSize: 11, width: 8 }}>{n}</span>
                  <div style={{ flex: 1, height: 4, background: '#2c2c2e', borderRadius: 2 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: '#636366',
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="px-5 py-5" style={{ background: '#111' }}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: '#ebebf5' }}>
          Information
        </h2>
        {[
          ['Provider', appInfo.developer || 'Developer'],
          ['Category', appInfo.category || 'Productivity'],
          ['Compatibility', 'Requires iOS 16.0 or later'],
          ['Languages', 'English, Spanish, French'],
          ['Age Rating', '4+'],
          ['Price', appInfo.price || 'Free'],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between py-2.5"
            style={{ borderBottom: '1px solid #2c2c2e' }}
          >
            <span style={{ color: '#636366', fontSize: 13 }}>{label}</span>
            <span style={{ color: '#ebebf5', fontSize: 13 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
