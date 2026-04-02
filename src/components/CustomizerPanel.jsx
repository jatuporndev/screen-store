import { useState } from 'react'
import { ArrowUp, ArrowDown, Type, Palette, Info } from 'lucide-react'
import TemplateGallery from './TemplateGallery'

function Section({ title, children }) {
  return (
    <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a1a25' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#55556a' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

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

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs" style={{ color: '#88889a' }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: '#55556a' }}>
          {value?.replace('rgba(', 'rgba(').slice(0, 18)}
        </span>
        <label
          className="cursor-pointer rounded overflow-hidden"
          style={{ width: 28, height: 20, border: '1px solid #252535', display: 'block' }}
        >
          <input
            type="color"
            value={toHex(value)}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 w-0 h-0 absolute"
          />
          <div style={{ width: '100%', height: '100%', background: value }} />
        </label>
      </div>
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
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

function toHex(color) {
  if (!color) return '#ffffff'
  if (color.startsWith('#')) return color
  return '#ffffff'
}

export default function CustomizerPanel({
  template,
  setTemplate,
  activeScreenshot,
  onUpdateScreenshot,
  appInfo,
  setAppInfo,
}) {
  const [activeSection, setActiveSection] = useState('template')

  const tabs = [
    { id: 'template', label: 'Style', Icon: Palette },
    { id: 'text', label: 'Text', Icon: Type },
    { id: 'app', label: 'App Info', Icon: Info },
  ]

  const isCustomStyle = !!(activeScreenshot?.customStyle)
  const effectiveStyle = isCustomStyle ? activeScreenshot.customStyle : template

  const applyStyleChange = (updaterOrValue) => {
    const next =
      typeof updaterOrValue === 'function' ? updaterOrValue(effectiveStyle) : updaterOrValue
    if (isCustomStyle && activeScreenshot) {
      onUpdateScreenshot(activeScreenshot.id, { customStyle: next })
    } else {
      setTemplate(next)
    }
  }

  const enableCustomStyle = () => {
    if (activeScreenshot) {
      onUpdateScreenshot(activeScreenshot.id, { customStyle: { ...template } })
    }
  }

  const disableCustomStyle = () => {
    if (activeScreenshot) {
      onUpdateScreenshot(activeScreenshot.id, { customStyle: null })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div
        className="flex shrink-0 px-2 pt-3 pb-0 gap-0.5"
        style={{ borderBottom: '1px solid #1a1a25' }}
      >
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all"
            style={{
              background: activeSection === id ? '#1a1a25' : 'transparent',
              color: activeSection === id ? '#f0f0f5' : '#55556a',
              borderBottom: activeSection === id ? '2px solid #007aff' : '2px solid transparent',
            }}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Style tab */}
        {activeSection === 'template' && (
          <>
            {/* Per-screenshot style override toggle */}
            {activeScreenshot && (
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid #1a1a25', background: isCustomStyle ? '#0d1a2e' : 'transparent' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text-xs font-semibold" style={{ color: isCustomStyle ? '#60aaff' : '#88889a' }}>
                    Custom style
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#33334a' }}>
                    {isCustomStyle ? 'Overriding global style' : 'Using global style'}
                  </p>
                </div>
                <Toggle
                  on={isCustomStyle}
                  onChange={(on) => (on ? enableCustomStyle() : disableCustomStyle())}
                />
              </div>
            )}

            <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a1a25' }}>
              <TemplateGallery activeTemplate={effectiveStyle} onSelect={applyStyleChange} />
            </div>

            <Section title="Text Position">
              <div className="flex gap-2">
                {[
                  { value: 'top', label: 'Text Top', Icon: ArrowUp },
                  { value: 'bottom', label: 'Text Bottom', Icon: ArrowDown },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    onClick={() => applyStyleChange((t) => ({ ...t, textPosition: value }))}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: effectiveStyle.textPosition === value ? '#1a1a35' : '#1a1a25',
                      color: effectiveStyle.textPosition === value ? '#007aff' : '#88889a',
                      border: `1px solid ${effectiveStyle.textPosition === value ? '#007aff44' : '#252535'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Colors">
              <div className="mb-3">
                <Label>Background</Label>
                <input
                  type="text"
                  value={effectiveStyle.background}
                  onChange={(e) => applyStyleChange((t) => ({ ...t, background: e.target.value }))}
                  placeholder="CSS gradient or color"
                  style={{
                    width: '100%',
                    background: '#1a1a25',
                    border: '1px solid #252535',
                    borderRadius: 8,
                    padding: '7px 10px',
                    color: '#f0f0f5',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <div
                  className="mt-1.5 rounded-lg"
                  style={{ height: 24, background: effectiveStyle.background, border: '1px solid #252535' }}
                />
              </div>
              <ColorRow
                label="Title color"
                value={effectiveStyle.titleColor}
                onChange={(v) => applyStyleChange((t) => ({ ...t, titleColor: v }))}
              />
              <ColorRow
                label="Subtitle color"
                value={effectiveStyle.subtitleColor}
                onChange={(v) => applyStyleChange((t) => ({ ...t, subtitleColor: v }))}
              />
            </Section>
          </>
        )}

        {/* Text tab */}
        {activeSection === 'text' && (
          <div className="px-4 py-4">
            {activeScreenshot ? (
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Title</Label>
                  <TextInput
                    value={activeScreenshot.title}
                    onChange={(v) => onUpdateScreenshot(activeScreenshot.id, { title: v })}
                    placeholder="Feature headline"
                  />
                </div>

                {/* Subtitle toggle + field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Subtitle</Label>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs" style={{ color: '#55556a' }}>
                        {activeScreenshot.showSubtitle !== false ? 'Visible' : 'Hidden'}
                      </span>
                      <Toggle
                        on={activeScreenshot.showSubtitle !== false}
                        onChange={(on) =>
                          onUpdateScreenshot(activeScreenshot.id, { showSubtitle: on })
                        }
                      />
                    </div>
                  </div>
                  {activeScreenshot.showSubtitle !== false && (
                    <TextInput
                      value={activeScreenshot.subtitle}
                      onChange={(v) => onUpdateScreenshot(activeScreenshot.id, { subtitle: v })}
                      placeholder="Short description"
                      multiline
                    />
                  )}
                </div>

                <p className="text-xs" style={{ color: '#33334a' }}>
                  Text is per-screenshot. Select another screenshot in the list to edit its text.
                </p>
              </div>
            ) : (
              <p className="text-sm text-center mt-4" style={{ color: '#55556a' }}>
                Select a screenshot first
              </p>
            )}
          </div>
        )}

        {/* App Info tab */}
        {activeSection === 'app' && (
          <div className="px-4 py-4 flex flex-col gap-4">
            <div>
              <Label>App Name</Label>
              <TextInput
                value={appInfo.name}
                onChange={(v) => setAppInfo((a) => ({ ...a, name: v }))}
                placeholder="My App"
              />
            </div>
            <div>
              <Label>Developer / Studio</Label>
              <TextInput
                value={appInfo.developer}
                onChange={(v) => setAppInfo((a) => ({ ...a, developer: v }))}
                placeholder="Developer Name"
              />
            </div>
            <div>
              <Label>Category</Label>
              <TextInput
                value={appInfo.category}
                onChange={(v) => setAppInfo((a) => ({ ...a, category: v }))}
                placeholder="Productivity"
              />
            </div>
            <div>
              <Label>Price</Label>
              <TextInput
                value={appInfo.price}
                onChange={(v) => setAppInfo((a) => ({ ...a, price: v }))}
                placeholder="Free"
              />
            </div>
            <div>
              <Label>App Icon</Label>
              <AppIconUpload appInfo={appInfo} setAppInfo={setAppInfo} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AppIconUpload({ appInfo, setAppInfo }) {
  const handleIconUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAppInfo((a) => ({ ...a, icon: ev.target.result }))
    reader.readAsDataURL(file)
  }

  return (
    <label className="cursor-pointer">
      <div
        className="flex items-center gap-3 p-3 rounded-xl transition-all"
        style={{ background: '#1a1a25', border: '1px solid #252535' }}
      >
        <div
          className="rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ width: 52, height: 52, background: '#252535' }}
        >
          {appInfo.icon ? (
            <img src={appInfo.icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#55556a" strokeWidth="1.5" />
              <path d="M12 8v8M8 12h8" stroke="#55556a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: '#88889a' }}>
            {appInfo.icon ? 'Change icon' : 'Upload App Icon'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#33334a' }}>
            1024×1024 PNG recommended
          </p>
        </div>
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={handleIconUpload} />
    </label>
  )
}
