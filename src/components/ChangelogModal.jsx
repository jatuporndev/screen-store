import { useEffect, useRef } from 'react'
import { X, Sparkles, Wrench, Zap } from 'lucide-react'
import { CHANGELOG, APP_VERSION } from '../data/changelog'

const TAG_CONFIG = {
  new:         { label: 'New',         color: '#30d158', bg: 'rgba(48,209,88,0.12)',  Icon: Sparkles },
  fix:         { label: 'Fix',         color: '#ff9f0a', bg: 'rgba(255,159,10,0.12)', Icon: Wrench   },
  improvement: { label: 'Improvement', color: '#0a84ff', bg: 'rgba(10,132,255,0.12)', Icon: Zap      },
}

function TagBadge({ tag }) {
  const cfg = TAG_CONFIG[tag] || TAG_CONFIG.new
  const { Icon } = cfg
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

export default function ChangelogModal({ onClose }) {
  const overlayRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Close on backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="flex flex-col rounded-2xl overflow-hidden w-[min(520px,calc(100vw-24px))] max-h-[min(80dvh,80vh)] mx-4"
        style={{
          background: '#111118',
          border: '1px solid #1a1a25',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid #1a1a25' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #007aff, #5856d6)' }}
            >
              <Sparkles size={15} color="#fff" />
            </div>
            <div>
              <h2 className="font-bold text-sm" style={{ color: '#f0f0f5' }}>
                What's New
              </h2>
              <p className="text-xs" style={{ color: '#55556a' }}>
                ScreenStore v{APP_VERSION}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 28, height: 28, background: '#1a1a25', border: 'none', cursor: 'pointer', color: '#55556a' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable changelog body */}
        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1a1a25 transparent' }}>
          {CHANGELOG.map((release, i) => (
            <div
              key={release.version}
              className="px-6 py-5"
              style={{ borderBottom: i < CHANGELOG.length - 1 ? '1px solid #1a1a25' : 'none' }}
            >
              {/* Version + date row */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-bold text-sm px-2.5 py-0.5 rounded-full"
                  style={{
                    color: i === 0 ? '#007aff' : '#55556a',
                    background: i === 0 ? 'rgba(0,122,255,0.12)' : '#1a1a25',
                  }}
                >
                  v{release.version}
                </span>
                {i === 0 && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: '#30d158', background: 'rgba(48,209,88,0.12)' }}
                  >
                    Latest
                  </span>
                )}
                <span className="text-xs ml-auto" style={{ color: '#33334a' }}>
                  {release.date}
                </span>
              </div>

              {/* Entries */}
              <ul className="flex flex-col gap-2.5">
                {release.entries.map((entry, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <TagBadge tag={entry.tag} />
                    <span className="text-sm leading-relaxed" style={{ color: '#88889a' }}>
                      {entry.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 shrink-0 flex items-center justify-between"
          style={{ borderTop: '1px solid #1a1a25', background: '#0a0a10' }}
        >
          <span className="text-xs" style={{ color: '#33334a' }}>
            {CHANGELOG.length} release{CHANGELOG.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: '#1a1a25', color: '#88889a', border: 'none', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
