import { Trash2 } from 'lucide-react'

export default function ScreenshotList({ screenshots, activeId, onSelect, onDelete, onReorder }) {
  if (screenshots.length === 0) return null

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#33334a' }}>
          Screenshots ({screenshots.length})
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {screenshots.map((ss, index) => (
          <ScreenshotItem
            key={ss.id}
            ss={ss}
            index={index}
            isActive={ss.id === activeId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

function ScreenshotItem({ ss, index, isActive, onSelect, onDelete }) {
  return (
    <div
      onClick={() => onSelect(ss.id)}
      className="group flex items-center gap-2.5 rounded-xl p-2 cursor-pointer transition-all"
      style={{
        background: isActive ? '#1a1a35' : 'transparent',
        border: `1px solid ${isActive ? '#007aff44' : 'transparent'}`,
      }}
    >
      {/* Thumbnail */}
      <div
        className="shrink-0 rounded-lg overflow-hidden"
        style={{ width: 40, height: 72, background: '#1a1a25', position: 'relative' }}
      >
        <img
          src={ss.dataUrl}
          alt={`Screenshot ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold truncate"
          style={{ color: isActive ? '#f0f0f5' : '#88889a' }}
        >
          Screenshot {index + 1}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: '#33334a' }}>
          {ss.title || 'No title'}
        </p>
      </div>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(ss.id)
        }}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
        style={{ width: 24, height: 24, background: 'rgba(255,69,58,0.15)' }}
      >
        <Trash2 size={11} color="#ff453a" />
      </button>
    </div>
  )
}
