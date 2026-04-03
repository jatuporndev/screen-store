import { useState, useRef } from 'react'
import { Star, ChevronRight, ArrowLeft, MoreVertical, Share2, Download, Shield, ExternalLink } from 'lucide-react'
import ScreenshotPreview from './ScreenshotPreview'
import { exportSingleScreenshot, exportAllScreenshots } from '../utils/exportUtils'

// Material You / Play Store 2025 dark palette
const C = {
  bg: '#1c1c1e',           // M3 surface
  surface1: '#242426',     // M3 surface+1 (cards, elevated rows)
  surface2: '#2c2c2e',     // chips, secondary surfaces
  outline: '#3a3a3c',      // dividers
  primary: '#8ab4f8',      // M3 primary on dark = blue
  green: '#00a884',        // Play install button (2025 slightly lighter teal)
  greenDim: 'rgba(0,168,132,0.14)',
  textPrimary: '#e3e3e7',
  textSecondary: '#9aa0a6',
  textTertiary: '#5f6368',
  link: '#8ab4f8',
  star: '#f9ab00',         // Amber star color used in Play Store
  bar: '#2d2d2f',          // rating bar track
}

function PlayIcon() {
  // Play Store triangle icon — white version
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3.87a1.5 1.5 0 0 1 2.23-1.31l13 8.13a1.5 1.5 0 0 1 0 2.62l-13 8.13A1.5 1.5 0 0 1 5 20.13V3.87Z"
        fill="#e3e3e7"
      />
    </svg>
  )
}

function ThreeDots() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={C.textPrimary}>
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.textPrimary} strokeWidth="2" strokeLinecap="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function StarFull({ size = 13, color = C.star }) {
  return <Star size={size} color={color} fill={color} />
}

function StarEmpty({ size = 13 }) {
  return <Star size={size} color={C.bar} fill={C.bar} />
}

function StarRatingRow({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i
        const half = !filled && rating >= i - 0.5
        return (
          <div key={i} style={{ position: 'relative', width: size, height: size }}>
            <StarEmpty size={size} />
            {(filled || half) && (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: half ? '50%' : '100%' }}>
                <StarFull size={size} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function PlayAppIcon({ icon, name, size = 80 }) {
  const initials = (name || 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: icon ? 'transparent' : 'linear-gradient(135deg, #00a884 0%, #007560 100%)',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon ? (
        <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ color: '#fff', fontSize: size * 0.3, fontWeight: 700, fontFamily: 'inherit' }}>
          {initials}
        </span>
      )}
    </div>
  )
}

/** Small metadata chip e.g. "4.3 ★" with sub-label "1.2K reviews" */
function MetaChip({ top, sub, topColor }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        minWidth: 72,
        padding: '10px 14px',
        borderRadius: 12,
        background: C.surface1,
        border: `1px solid ${C.outline}`,
      }}
    >
      <span style={{ color: topColor ?? C.textPrimary, fontSize: 14, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
        {top}
      </span>
      <span style={{ color: C.textSecondary, fontSize: 10, marginTop: 2, whiteSpace: 'nowrap' }}>
        {sub}
      </span>
    </div>
  )
}

/** Data safety row item */
function SafetyRow({ icon, label }) {
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${C.outline}` }}>
      <span style={{ color: C.textSecondary, fontSize: 18, lineHeight: 1 }}>{icon}</span>
      <span style={{ color: C.textPrimary, fontSize: 14 }}>{label}</span>
    </div>
  )
}

const DESCRIPTION =
  "Experience the next level of productivity. Beautifully designed and meticulously crafted, this app transforms the way you work, play, and create. With an intuitive interface and powerful features, you'll wonder how you ever managed without it.\n\nKey features:\n• Seamless workflow that gets out of your way\n• Cloud sync across all your devices\n• Offline-first — your data, always available"

const playExportOpts = {
  folderName: 'play-store-screenshots',
  zipFileName: 'play-store-screenshots.zip',
}

export default function PlayStorePreview({ screenshots, template, deviceType, appInfo }) {
  const [exportStatus, setExportStatus] = useState(null)
  const [descExpanded, setDescExpanded] = useState(false)
  const scrollRef = useRef(null)

  const CARD_W = 216

  const handleExportAll = () =>
    exportAllScreenshots(screenshots, template, deviceType, setExportStatus, playExportOpts)

  const rating = appInfo.rating ?? 4.5
  const ratingStr = rating.toFixed(1)

  if (screenshots.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full gap-4"
        style={{ background: C.bg, color: C.textSecondary }}
      >
        {/* Play triangle */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: C.surface1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlayIcon />
        </div>
        <div className="text-center">
          <p className="font-semibold" style={{ color: C.textPrimary }}>No screenshots yet</p>
          <p className="text-sm mt-1" style={{ color: C.textTertiary }}>
            Upload screenshots in the Editor, then pick an Android device above
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-full"
      style={{ background: C.bg, fontFamily: "'Google Sans', Roboto, Inter, system-ui, sans-serif", color: C.textPrimary }}
    >
      {/* ── Status bar ── */}
      <div
        className="flex items-center justify-between px-4"
        style={{ height: 28, color: C.textPrimary, fontSize: 12, fontWeight: 600, letterSpacing: 0.1 }}
      >
        <span>10:00</span>
        <div className="flex items-center gap-1.5">
          {/* wifi */}
          <svg width="15" height="11" viewBox="0 0 15 11" fill={C.textPrimary} opacity={0.9}>
            <path d="M7.5 2.5C9.98 2.5 12.2 3.5 13.8 5.18L15 3.85C13.06 1.77 10.44.5 7.5.5S1.94 1.77 0 3.85l1.2 1.33C2.8 3.5 5.02 2.5 7.5 2.5Z" />
            <path d="M7.5 5.5c1.6 0 3.03.64 4.08 1.68L12.8 5.8C11.46 4.42 9.58 3.5 7.5 3.5s-3.96.92-5.3 2.3l1.22 1.38A5.48 5.48 0 0 1 7.5 5.5Z" />
            <circle cx="7.5" cy="10" r="1.5" />
          </svg>
          {/* signal bars */}
          <svg width="13" height="11" viewBox="0 0 13 11" fill={C.textPrimary}>
            <rect x="0" y="7" width="2.5" height="4" rx="0.5" />
            <rect x="3.5" y="5" width="2.5" height="6" rx="0.5" />
            <rect x="7" y="2.5" width="2.5" height="8.5" rx="0.5" />
            <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" opacity={0.3} />
          </svg>
          {/* battery */}
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke={C.textPrimary} strokeOpacity={0.7} />
            <rect x="2" y="2" width="14" height="8" rx="1.5" fill={C.textPrimary} />
            <path d="M20 4v4a2 2 0 0 0 0-4Z" fill={C.textPrimary} fillOpacity={0.5} />
          </svg>
        </div>
      </div>

      {/* ── App bar ── */}
      <div
        className="flex items-center gap-1 px-1"
        style={{ height: 56, borderBottom: `1px solid ${C.outline}` }}
      >
        <button
          type="button"
          aria-hidden
          style={{ background: 'none', border: 'none', color: C.textPrimary, padding: '8px 10px', cursor: 'default', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>

        {/* Google Play wordmark */}
        <div className="flex items-center gap-2 flex-1">
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <path d="M4 24L24 4l3.5 3.5-16.8 16.6L27.5 40.5 24 44 4 24Z" fill="#4285F4" />
            <path d="M24 44l3.5-3.5 8.8-8.8-5.2-5.1L24 44Z" fill="#FBBC04" />
            <path d="M44 24l-3.5-3.5-8.8-8.8L26.6 17 44 24Z" fill="#34A853" />
            <path d="M4 24l3.7 3.5 9 8.8 5-4.8L4 24Z" fill="#EA4335" />
          </svg>
          <span style={{ color: C.textPrimary, fontSize: 18, fontWeight: 500, letterSpacing: 0 }}>
            Google Play
          </span>
        </div>

        <button type="button" aria-hidden style={{ background: 'none', border: 'none', padding: '8px 10px', cursor: 'default', display: 'flex' }}>
          <BellIcon />
        </button>
        <button type="button" aria-hidden style={{ background: 'none', border: 'none', padding: '8px 10px', cursor: 'default', display: 'flex' }}>
          <ThreeDots />
        </button>
      </div>

      {/* ── App hero ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <div className="flex items-start gap-4">
          <PlayAppIcon icon={appInfo.icon} name={appInfo.name} size={92} />
          <div className="flex-1 min-w-0 pt-1">
            <h1 style={{ color: C.textPrimary, fontSize: 20, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.2px', margin: 0 }}>
              {appInfo.name || 'App Name'}
            </h1>
            <p style={{ color: C.link, fontSize: 14, marginTop: 4, fontWeight: 400 }}>
              {appInfo.developer || 'Developer'}
            </p>
            <p style={{ color: C.textSecondary, fontSize: 13, marginTop: 2 }}>
              {appInfo.category || 'Productivity'} · <span style={{ color: C.textTertiary }}>Contains ads</span>
            </p>
          </div>
        </div>

        {/* Install + wishlist row */}
        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            aria-hidden
            style={{
              flex: 1,
              height: 44,
              borderRadius: 100,
              background: C.green,
              color: '#fff',
              border: 'none',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'default',
              letterSpacing: 0.1,
            }}
          >
            Install
          </button>
          <button
            type="button"
            aria-hidden
            style={{
              width: 44,
              height: 44,
              borderRadius: 100,
              background: C.surface1,
              border: `1px solid ${C.outline}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
              flexShrink: 0,
            }}
          >
            <Share2 size={18} color={C.textPrimary} />
          </button>
        </div>

        {/* Metadata chips */}
        <div
          className="flex gap-2 overflow-x-auto mt-4 pb-4"
          style={{ scrollbarWidth: 'none', borderBottom: `1px solid ${C.outline}` }}
        >
          <MetaChip top={`${ratingStr} ★`} sub={`${appInfo.ratingCount || '2.1K'} reviews`} topColor={C.star} />
          <MetaChip top="10M+" sub="Downloads" />
          <MetaChip top="Everyone" sub="Rated for" />
          <MetaChip top={appInfo.price === 'Free' ? 'Free' : appInfo.price || 'Free'} sub="Price" />
        </div>
      </div>

      {/* ── Screenshots ── */}
      <div style={{ paddingTop: 16, paddingBottom: 4, borderBottom: `1px solid ${C.outline}` }}>
        <div className="flex items-center justify-between" style={{ paddingLeft: 16, paddingRight: 16, marginBottom: 10 }}>
          <span style={{ color: C.textSecondary, fontSize: 13, fontWeight: 500, letterSpacing: 0.1 }}>
            Phone screenshots
          </span>
          <div className="flex items-center gap-2">
            {exportStatus && (
              <span style={{ color: C.textSecondary, fontSize: 12 }}>{exportStatus}</span>
            )}
            <button
              type="button"
              onClick={handleExportAll}
              disabled={!!exportStatus}
              className="flex items-center gap-1.5 rounded-full text-xs font-semibold"
              style={{
                background: C.greenDim,
                color: C.green,
                border: `1px solid rgba(0,168,132,0.3)`,
                cursor: exportStatus ? 'not-allowed' : 'pointer',
                padding: '5px 12px',
                letterSpacing: 0.2,
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
          style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 12, scrollbarWidth: 'none' }}
        >
          {screenshots.map((ss) => (
            <div key={ss.id} className="shrink-0 relative group" style={{ borderRadius: 12, overflow: 'hidden' }}>
              <ScreenshotPreview
                screenshot={ss}
                template={ss.customStyle || template}
                deviceType={deviceType}
                cardWidth={CARD_W}
              />
              <button
                type="button"
                onClick={() => exportSingleScreenshot(ss.id, template, deviceType, setExportStatus)}
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(0,0,0,0.78)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '5px 10px',
                }}
              >
                <Download size={10} />
                Save
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── About this app ── */}
      <div style={{ padding: '16px 16px 0', borderBottom: `1px solid ${C.outline}` }}>
        <h2 style={{ color: C.textPrimary, fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>
          About this app
        </h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {['Productivity', 'Offline', 'No-ads alternative'].map((tag) => (
            <span
              key={tag}
              style={{
                background: C.surface2,
                color: C.link,
                border: `1px solid ${C.outline}`,
                borderRadius: 100,
                fontSize: 12,
                padding: '4px 12px',
                fontWeight: 500,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <p
          style={{
            color: C.textPrimary,
            fontSize: 14,
            lineHeight: 1.65,
            margin: 0,
            whiteSpace: 'pre-line',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: descExpanded ? 'none' : 5,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {DESCRIPTION}
        </p>
        <button
          type="button"
          onClick={() => setDescExpanded((v) => !v)}
          style={{
            color: C.link,
            fontSize: 13,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 0 12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {descExpanded ? 'Show less' : 'See more'}
          <ChevronRight size={14} style={{ transform: descExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* ── Ratings & Reviews ── */}
      <div style={{ padding: '16px 16px', borderBottom: `1px solid ${C.outline}` }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ color: C.textPrimary, fontSize: 16, fontWeight: 600, margin: 0 }}>
            Ratings and reviews
          </h2>
          <button
            type="button"
            aria-hidden
            style={{ color: C.link, fontSize: 13, background: 'none', border: 'none', cursor: 'default', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 2 }}
          >
            See all <ChevronRight size={13} />
          </button>
        </div>

        <p style={{ color: C.textTertiary, fontSize: 12, marginBottom: 12 }}>
          Ratings and reviews are verified and are from people who use the same type of device that you use.
        </p>

        <div className="flex items-start gap-5">
          {/* Big number + stars */}
          <div className="flex flex-col items-center shrink-0" style={{ minWidth: 72 }}>
            <span style={{ color: C.textPrimary, fontSize: 52, fontWeight: 300, lineHeight: 1, letterSpacing: '-2px' }}>
              {ratingStr}
            </span>
            <StarRatingRow rating={rating} size={14} />
            <span style={{ color: C.textSecondary, fontSize: 11, marginTop: 4 }}>
              {appInfo.ratingCount || '2.1K'}
            </span>
          </div>

          {/* Bars */}
          <div className="flex-1" style={{ paddingTop: 4 }}>
            {[5, 4, 3, 2, 1].map((n) => {
              const pct = n === 5 ? 70 : n === 4 ? 20 : n === 3 ? 6 : n === 2 ? 2 : 2
              return (
                <div key={n} className="flex items-center gap-2" style={{ marginBottom: 5 }}>
                  <span style={{ color: C.textSecondary, fontSize: 11, width: 8, textAlign: 'right' }}>{n}</span>
                  <div style={{ flex: 1, height: 5, background: C.bar, borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: C.green, borderRadius: 3 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sample review card */}
        <div style={{ background: C.surface1, border: `1px solid ${C.outline}`, borderRadius: 12, padding: '12px 14px', marginTop: 14 }}>
          <div className="flex items-center gap-2 mb-1">
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#4a4aff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>A</span>
            </div>
            <div>
              <p style={{ color: C.textPrimary, fontSize: 13, fontWeight: 600, margin: 0 }}>Alex M.</p>
              <p style={{ color: C.textTertiary, fontSize: 11, margin: 0 }}>March 28, 2026</p>
            </div>
            <div className="ml-auto">
              <StarRatingRow rating={5} size={11} />
            </div>
          </div>
          <p style={{ color: C.textPrimary, fontSize: 13, lineHeight: 1.55, margin: 0 }}>
            Exactly what I needed. Clean UI, works offline, and the export feature is a huge time-saver.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span style={{ color: C.textTertiary, fontSize: 11 }}>40 people found this helpful</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span style={{ color: C.textSecondary, fontSize: 11 }}>Helpful?</span>
            <button type="button" aria-hidden style={{ background: C.surface2, border: `1px solid ${C.outline}`, color: C.textPrimary, fontSize: 12, padding: '3px 12px', borderRadius: 100, cursor: 'default' }}>Yes</button>
            <button type="button" aria-hidden style={{ background: C.surface2, border: `1px solid ${C.outline}`, color: C.textPrimary, fontSize: 12, padding: '3px 12px', borderRadius: 100, cursor: 'default' }}>No</button>
          </div>
        </div>
      </div>

      {/* ── Data safety ── */}
      <div style={{ padding: '16px 16px', borderBottom: `1px solid ${C.outline}` }}>
        <h2 style={{ color: C.textPrimary, fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>
          Data safety
        </h2>
        <p style={{ color: C.textSecondary, fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
          Safety starts with understanding how developers collect and share your data.
        </p>

        <div
          style={{
            background: C.surface1,
            border: `1px solid ${C.outline}`,
            borderRadius: 12,
            padding: '4px 14px',
          }}
        >
          <SafetyRow icon="🔒" label="No data shared with third parties" />
          <SafetyRow icon="🗑" label="You can request data deletion" />
          <div className="flex items-center gap-3 py-2.5">
            <span style={{ color: C.textSecondary, fontSize: 18 }}>🔐</span>
            <span style={{ color: C.textPrimary, fontSize: 14 }}>Data is encrypted in transit</span>
          </div>
        </div>

        <button type="button" aria-hidden style={{ color: C.link, fontSize: 13, background: 'none', border: 'none', cursor: 'default', padding: '8px 0 0', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 2 }}>
          See details <ExternalLink size={12} />
        </button>
      </div>

      {/* ── App info ── */}
      <div style={{ padding: '16px 16px 32px' }}>
        <h2 style={{ color: C.textPrimary, fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>
          App info
        </h2>

        {[
          ['Version', '1.0.0'],
          ['Updated on', 'Apr 4, 2026'],
          ['Downloads', '10,000+'],
          ['Released on', 'Jan 1, 2024'],
          ['Offered by', appInfo.developer || 'Developer'],
          ['Requires Android', '8.0 and up'],
        ].map(([label, value], i, arr) => (
          <div
            key={label}
            className="flex items-center justify-between py-2.5"
            style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.outline}` : 'none' }}
          >
            <span style={{ color: C.textSecondary, fontSize: 14 }}>{label}</span>
            <span style={{ color: C.textPrimary, fontSize: 14, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
          </div>
        ))}

        <button
          type="button"
          aria-hidden
          style={{
            width: '100%',
            marginTop: 14,
            padding: '11px',
            borderRadius: 100,
            background: 'transparent',
            border: `1px solid ${C.outline}`,
            color: C.textPrimary,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Shield size={14} />
          Flag as inappropriate
        </button>
      </div>
    </div>
  )
}
