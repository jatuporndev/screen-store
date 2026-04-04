import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function EditorMobileSheet({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-stretch justify-end lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-mobile-sheet-title"
    >
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        onClick={onClose}
        role="presentation"
        aria-hidden
      />
      <div
        className="relative z-10 flex max-h-[min(92dvh,920px)] w-full flex-col overflow-hidden rounded-t-2xl shadow-2xl"
        style={{
          background: '#111118',
          border: '1px solid #252535',
          borderBottom: 'none',
          paddingBottom: 'max(0px, env(safe-area-inset-bottom, 0px))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3"
          style={{ borderColor: '#1a1a25' }}
        >
          <h2
            id="editor-mobile-sheet-title"
            className="min-w-0 truncate text-base font-semibold tracking-tight"
            style={{ color: '#f0f0f5' }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
            style={{
              background: '#1a1a25',
              border: '1px solid #252535',
              color: '#a8a8b8',
              cursor: 'pointer',
            }}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
