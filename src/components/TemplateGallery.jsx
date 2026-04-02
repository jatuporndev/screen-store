import { PRESET_TEMPLATES } from '../data/templates'

function MiniCard({ template }) {
  const isTop = template.textPosition === 'top'

  const textBlock = (
    <div style={{ padding: '4px 5px', flex: '0 0 auto' }}>
      <div
        style={{
          height: 5,
          borderRadius: 3,
          background: template.titleColor,
          opacity: 0.9,
          marginBottom: 3,
        }}
      />
      <div
        style={{
          height: 3,
          borderRadius: 2,
          background: template.subtitleColor,
          opacity: 0.7,
          width: '75%',
        }}
      />
    </div>
  )

  const phoneBlock = (
    <div
      style={{
        flex: '1 1 0',
        margin: '0 6px',
        background: '#1a1a1a',
        borderRadius: 5,
        border: '1.5px solid #2a2a2a',
        overflow: 'hidden',
        minHeight: 0,
      }}
    />
  )

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '9 / 16',
        background: template.background,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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

export default function TemplateGallery({ activeTemplate, onSelect }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#55556a' }}>
        Templates
      </p>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
      >
        {PRESET_TEMPLATES.map((t) => {
          const isActive = t.id === activeTemplate.id
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-all w-full min-w-0"
              style={{
                background: isActive ? '#1a1a35' : 'transparent',
                border: `1.5px solid ${isActive ? '#007aff' : 'transparent'}`,
                cursor: 'pointer',
              }}
            >
              <MiniCard template={t} />
              <span
                className="text-xs font-medium text-center"
                style={{ color: isActive ? '#007aff' : '#55556a', fontSize: 10 }}
              >
                {t.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
