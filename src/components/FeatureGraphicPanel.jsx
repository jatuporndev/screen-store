import TemplateGallery from './TemplateGallery'
import { PRESET_TEMPLATES } from '../data/templates'
import { FEATURE_GRAPHIC_H, FEATURE_GRAPHIC_W } from '../data/featureGraphic'

function Label({ children }) {
  return (
    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#88889a' }}>
      {children}
    </label>
  )
}

function TextInput({ value, onChange, placeholder, multiline }) {
  const shared = {
    width: '100%',
    background: '#1a1a25',
    border: '1px solid #252535',
    borderRadius: 8,
    padding: '8px 10px',
    color: '#f0f0f5',
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
  }
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        style={shared}
      />
    )
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={shared}
    />
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 38,
        height: 21,
        borderRadius: 11,
        background: on ? '#007aff' : '#252535',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.18s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 20 : 3,
          width: 15,
          height: 15,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.18s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}

function FeatureGraphicIconRow({ featureGraphic, setFeatureGraphic, appInfo }) {
  const effective = featureGraphic.iconDataUrl || appInfo?.icon

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) =>
      setFeatureGraphic((fg) => ({ ...fg, iconDataUrl: ev.target.result }))
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="cursor-pointer">
        <div
          className="flex items-center gap-3 p-3 rounded-xl transition-all"
          style={{ background: '#1a1a25', border: '1px solid #252535' }}
        >
          <div
            className="rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
            style={{ width: 52, height: 52, background: '#252535' }}
          >
            {effective ? (
              <img src={effective} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#55556a" strokeWidth="1.5" />
                <path d="M12 8v8M8 12h8" stroke="#55556a" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold" style={{ color: '#88889a' }}>
              {featureGraphic.iconDataUrl ? 'Custom banner icon' : 'Using app icon'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#33334a' }}>
              {featureGraphic.iconDataUrl ? 'Tap to replace' : 'Tap to use a different image'}
            </p>
          </div>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </label>
      {featureGraphic.iconDataUrl && (
        <button
          type="button"
          onClick={() => setFeatureGraphic((fg) => ({ ...fg, iconDataUrl: null }))}
          className="text-xs font-semibold py-2 px-3 rounded-lg transition-colors self-start"
          style={{
            background: 'transparent',
            border: '1px solid #252535',
            color: '#88889a',
            cursor: 'pointer',
          }}
        >
          Use app icon instead
        </button>
      )}
    </div>
  )
}

export default function FeatureGraphicPanel({ featureGraphic, setFeatureGraphic, appInfo }) {
  const activePreset =
    PRESET_TEMPLATES.find((p) => p.id === featureGraphic.presetId) || PRESET_TEMPLATES[0]

  const applyPreset = (t) => {
    setFeatureGraphic((fg) => ({
      ...fg,
      presetId: t.id,
      background: t.background,
      titleColor: t.titleColor,
      subtitleColor: t.subtitleColor,
    }))
  }

  return (
    <div className="pb-6">
      <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a1a25' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#55556a' }}>
          Google Play
        </p>
        <p className="text-sm font-semibold" style={{ color: '#ececf2' }}>
          Feature graphic
        </p>
        <p className="text-[11px] mt-2 leading-relaxed" style={{ color: '#55556a' }}>
          Wide banner ({FEATURE_GRAPHIC_W} × {FEATURE_GRAPHIC_H} px), not a phone mockup. Upload it in Play Console →
          Store listing → Graphics.
        </p>
      </div>

      <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a1a25' }}>
        <TemplateGallery activeTemplate={activePreset} onSelect={applyPreset} />
      </div>

      <div className="px-4 py-4 flex flex-col gap-4" style={{ borderBottom: '1px solid #1a1a25' }}>
        <button
          type="button"
          onClick={() => setFeatureGraphic((fg) => ({ ...fg, title: appInfo.name || fg.title }))}
          className="text-xs font-semibold py-2 px-3 rounded-lg transition-colors w-fit"
          style={{
            background: '#1a1a25',
            border: '1px solid #252535',
            color: '#88889a',
            cursor: 'pointer',
          }}
        >
          Copy headline from App name
        </button>
        <div>
          <Label>Headline</Label>
          <TextInput
            value={featureGraphic.title}
            onChange={(v) => setFeatureGraphic((fg) => ({ ...fg, title: v }))}
            placeholder="App name or short headline"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Tagline</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#55556a' }}>
                {featureGraphic.showSubtitle !== false ? 'Visible' : 'Hidden'}
              </span>
              <Toggle
                on={featureGraphic.showSubtitle !== false}
                onChange={(on) => setFeatureGraphic((fg) => ({ ...fg, showSubtitle: on }))}
              />
            </div>
          </div>
          {featureGraphic.showSubtitle !== false && (
            <TextInput
              value={featureGraphic.subtitle}
              onChange={(v) => setFeatureGraphic((fg) => ({ ...fg, subtitle: v }))}
              placeholder="One line about your app"
              multiline
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium" style={{ color: '#88889a' }}>
            App icon on banner
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs" style={{ color: '#55556a' }}>
              {featureGraphic.useAppIcon !== false ? 'On' : 'Off'}
            </span>
            <Toggle
              on={featureGraphic.useAppIcon !== false}
              onChange={(on) => setFeatureGraphic((fg) => ({ ...fg, useAppIcon: on }))}
            />
          </div>
        </div>

        {featureGraphic.useAppIcon !== false && (
          <div>
            <Label>Banner icon</Label>
            <p className="text-[10px] mb-2 leading-relaxed" style={{ color: '#55556a' }}>
              Only for this graphic. Store listing previews still use Editor → Style &amp; app.
            </p>
            <FeatureGraphicIconRow
              featureGraphic={featureGraphic}
              setFeatureGraphic={setFeatureGraphic}
              appInfo={appInfo}
            />
          </div>
        )}

        {featureGraphic.useAppIcon !== false &&
          !appInfo?.icon &&
          !featureGraphic.iconDataUrl && (
            <p className="text-[11px]" style={{ color: '#c9a227' }}>
              Upload a banner icon here, or add an app icon under Style &amp; app.
            </p>
          )}
      </div>
    </div>
  )
}
