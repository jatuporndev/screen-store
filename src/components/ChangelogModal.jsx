import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { CHANGELOG, APP_VERSION } from '../data/changelog'

const TAG_CONFIG = {
  new: { label: 'New', color: '#34d399' },
  fix: { label: 'Fix', color: '#e5a54b' },
  improvement: { label: 'Improvement', color: '#6b9ef7' },
}

function ChangelogEntry({ entry }) {
  const cfg = TAG_CONFIG[entry.tag] || TAG_CONFIG.new
  return (
    <li className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-[7.25rem_1fr] sm:items-start sm:gap-y-0">
      <span
        className="text-[11px] font-semibold uppercase tracking-wide sm:pt-[0.2rem]"
        style={{ color: cfg.color }}
      >
        {cfg.label}
      </span>
      <p className="m-0 min-w-0 text-[13px] leading-[1.6]" style={{ color: '#9898ac' }}>
        {entry.text}
      </p>
    </li>
  )
}

export default function ChangelogModal({ onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="flex max-h-[min(85dvh,85vh)] w-full max-w-[min(600px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl"
        style={{
          background: '#12121a',
          border: '1px solid #252532',
          boxShadow: '0 24px 48px rgba(0,0,0,0.45)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="changelog-title"
      >
        <header
          className="flex shrink-0 items-center justify-between gap-4 px-5 py-4 sm:px-6"
          style={{ borderBottom: '1px solid #1e1e2a' }}
        >
          <div className="min-w-0">
            <h2 id="changelog-title" className="text-[15px] font-semibold tracking-tight" style={{ color: '#ececf2' }}>
              What&apos;s New
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: '#5c5c70' }}>
              v{APP_VERSION}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]"
            style={{ color: '#6a6a7e', border: 'none', background: 'transparent', cursor: 'pointer' }}
            aria-label="Close"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </header>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a38 transparent' }}
        >
          {CHANGELOG.map((release, i) => (
            <section key={release.version} className={i > 0 ? 'mt-10' : ''}>
              {i > 0 && <div className="mb-10 h-px" style={{ background: '#1e1e2a' }} aria-hidden />}
              <div className="mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: i === 0 ? '#e4e4ec' : '#7a7a8e' }}
                >
                  v{release.version}
                </span>
                {i === 0 && (
                  <span className="text-[11px] font-medium" style={{ color: '#5a8a6a' }}>
                    latest
                  </span>
                )}
                <span className="text-[11px] tabular-nums" style={{ color: '#4a4a5c' }}>
                  {release.date}
                </span>
              </div>

              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {release.entries.map((entry, j) => (
                  <ChangelogEntry key={j} entry={entry} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer
          className="flex shrink-0 items-center justify-between gap-4 px-5 py-3 sm:px-6"
          style={{ borderTop: '1px solid #1e1e2a' }}
        >
          <span className="text-[11px]" style={{ color: '#4a4a5c' }}>
            {CHANGELOG.length} release{CHANGELOG.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-medium transition-colors hover:text-[#b8b8c8]"
            style={{
              color: '#8c8c9e',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}
