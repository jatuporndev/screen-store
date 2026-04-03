import { useState } from 'react'
import { ArrowUp, ArrowDown, Type, Palette, Info, RotateCcw } from 'lucide-react'
import TemplateGallery from './TemplateGallery'
import { PRESET_TEMPLATES } from '../data/templates'

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
    <div
      className="flex items-center justify-between gap-2 py-2 px-2 rounded-lg mb-1 last:mb-0"
      style={{ background: '#0d0d12', border: '1px solid #1f1f28' }}
    >
      <span className="text-xs font-medium shrink-0" style={{ color: '#88889a' }}>
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[10px] font-mono truncate" style={{ color: '#55556a', maxWidth: 120 }}>
          {value?.slice(0, 22)}
          {(value?.length || 0) > 22 ? '…' : ''}
        </span>
        <label
          className="cursor-pointer rounded-md overflow-hidden shrink-0"
          style={{ width: 30, height: 22, border: '1px solid #252535', display: 'block' }}
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
  if (color.startsWith('#')) {
    const h = color.slice(1)
    if (h.length === 3) {
      return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`
    }
    return color.slice(0, 7)
  }
  return '#ffffff'
}

function backgroundToSolidPickerValue(background) {
  if (!background) return '#1a1a2e'
  const t = background.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(t)) return t
  if (/^#[0-9a-fA-F]{3}$/.test(t)) return toHex(t)
  return '#1a1a2e'
}

function parseLinearGradientHexes(background) {
  if (!background || !/linear-gradient/i.test(background)) return null
  const angleM = background.match(/(-?[0-9.]+)\s*deg/i)
  const angle = angleM ? parseFloat(angleM[1]) : 160
  const hexes = background.match(/#[0-9a-fA-F]{3,8}/gi) || []
  if (hexes.length < 2) return null
  return {
    angle,
    c1: toHex(hexes[0]),
    c2: toHex(hexes[hexes.length - 1]),
  }
}

function buildTwoStopGradient(angle, c1, c2) {
  return `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`
}

/** solid | gradient | custom */
function inferBackgroundMode(background) {
  if (!background) return 'solid'
  const s = background.trim()
  if (/^linear-gradient/i.test(s)) {
    return parseLinearGradientHexes(s) ? 'gradient' : 'custom'
  }
  if (/^#[0-9a-fA-F]{3,8}$/i.test(s)) return 'solid'
  if (/^rgba?\(/i.test(s)) return 'solid'
  return 'custom'
}

const GRADIENT_ANGLES = [90, 135, 160, 180]

function getBaselinePreset(effective, globalTemplate) {
  const fromEffective = effective?.id && PRESET_TEMPLATES.find((p) => p.id === effective.id)
  if (fromEffective) return { ...fromEffective }
  const fromGlobal = globalTemplate?.id && PRESET_TEMPLATES.find((p) => p.id === globalTemplate.id)
  if (fromGlobal) return { ...fromGlobal }
  return { ...PRESET_TEMPLATES[0] }
}

function styleComparableSlice(s) {
  return {
    background: s.background,
    titleColor: s.titleColor,
    subtitleColor: s.subtitleColor,
    textPosition: s.textPosition,
    fullBleedMockup: !!s.fullBleedMockup,
  }
}

function PickerSwatch({ value, onChange, label }) {
  const inputHex =
    typeof value === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(value.trim())
      ? toHex(value)
      : backgroundToSolidPickerValue(value)
  const displayHex =
    typeof value === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(value.trim()) ? toHex(value) : inputHex
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <span className="text-xs shrink-0 w-12 font-medium" style={{ color: '#55556a' }}>
        {label}
      </span>
      <label
        className="cursor-pointer rounded-lg overflow-hidden shrink-0"
        style={{ width: 36, height: 28, border: '1px solid #252535', display: 'block' }}
      >
        <input
          type="color"
          value={inputHex}
          onChange={(e) => onChange(e.target.value)}
          className="opacity-0 w-0 h-0 absolute"
          aria-label={label}
        />
        <div style={{ width: '100%', height: '100%', background: value || inputHex }} />
      </label>
      <span className="text-[10px] font-mono truncate min-w-0" style={{ color: '#33334a' }}>
        {displayHex}
      </span>
    </div>
  )
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

  /** Gallery: global template when not overriding; per-shot only when Custom style is on (avoids changing other screenshots). */
  const applyPresetFromGallery = (preset) => {
    const next = { ...preset }
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

  const baselinePreset = getBaselinePreset(effectiveStyle, template)

  const resetStyleToTemplate = () => {
    if (isCustomStyle && activeScreenshot) {
      onUpdateScreenshot(activeScreenshot.id, { customStyle: { ...baselinePreset } })
    } else {
      setTemplate({ ...baselinePreset })
    }
  }

  const canResetStyle =
    JSON.stringify(styleComparableSlice(effectiveStyle)) !==
    JSON.stringify(styleComparableSlice(baselinePreset))

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
              <TemplateGallery activeTemplate={effectiveStyle} onSelect={applyPresetFromGallery} />
            </div>

            <Section title="Text Position">
              {effectiveStyle.fullBleedMockup ? (
                <p className="text-xs leading-relaxed" style={{ color: '#55556a' }}>
                  Hidden for <strong style={{ color: '#88889a' }}>Full Mockup</strong> — the phone fills the card with no headline block.
                </p>
              ) : (
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
              )}
            </Section>

            <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a1a25' }}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#55556a' }}>
                  Colors
                </p>
                <button
                  type="button"
                  onClick={resetStyleToTemplate}
                  disabled={!canResetStyle}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: canResetStyle ? '#1a1a25' : 'transparent',
                    border: `1px solid ${canResetStyle ? '#2a2a38' : '#1a1a25'}`,
                    color: canResetStyle ? '#a8a8b8' : '#33334a',
                    cursor: canResetStyle ? 'pointer' : 'not-allowed',
                  }}
                  title="Restore the selected template preset (Midnight, Ocean, …)"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>

              {(() => {
                const bg = effectiveStyle.background
                const bgMode = inferBackgroundMode(bg)
                const parsed = parseLinearGradientHexes(bg)
                const gradAngle = parsed?.angle ?? 160
                const gradC1 = parsed?.c1 ?? backgroundToSolidPickerValue(bg)
                const gradC2 = parsed?.c2 ?? '#4338ca'

                const cardShell = {
                  borderRadius: 12,
                  border: '1px solid #252535',
                  background: '#13131a',
                  padding: 12,
                }

                return (
                  <>
                    {/* Background */}
                    <div className="mb-3" style={cardShell}>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#88889a' }}>
                        Background
                      </p>
                      {/* Solid | Gradient (custom CSS = neither highlighted) */}
                      <div
                        className="flex p-0.5 rounded-lg mb-3"
                        style={{ background: '#0d0d12', border: '1px solid #1f1f28' }}
                      >
                        {[
                          { id: 'solid', label: 'Solid' },
                          { id: 'gradient', label: 'Gradient' },
                        ].map(({ id, label }) => {
                          const active = bgMode === id
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                if (id === 'solid') {
                                  applyStyleChange((t) => {
                                    const p = parseLinearGradientHexes(t.background)
                                    return {
                                      ...t,
                                      background: p
                                        ? p.c1
                                        : backgroundToSolidPickerValue(t.background),
                                    }
                                  })
                                } else {
                                  applyStyleChange((t) => {
                                    const p = parseLinearGradientHexes(t.background)
                                    const c1 = p?.c1 ?? backgroundToSolidPickerValue(t.background)
                                    const c2 = p?.c2 ?? '#4338ca'
                                    const a = p?.angle ?? 160
                                    return { ...t, background: buildTwoStopGradient(a, c1, c2) }
                                  })
                                }
                              }}
                              className="flex-1 py-1.5 rounded-md text-xs font-semibold transition-all"
                              style={{
                                background: active ? '#252535' : 'transparent',
                                color: active ? '#f0f0f5' : '#55556a',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                      {bgMode === 'custom' && (
                        <p className="text-xs mb-2 leading-relaxed" style={{ color: '#6e6e80' }}>
                          Custom CSS — edit below, or tap Solid / Gradient to use pickers.
                        </p>
                      )}

                      {bgMode === 'solid' && (
                        <PickerSwatch
                          label="Color"
                          value={bg}
                          onChange={(hex) => applyStyleChange((t) => ({ ...t, background: hex }))}
                        />
                      )}

                      {bgMode === 'gradient' && (
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <PickerSwatch
                              label="Start"
                              value={gradC1}
                              onChange={(hex) =>
                                applyStyleChange((t) => ({
                                  ...t,
                                  background: buildTwoStopGradient(gradAngle, hex, gradC2),
                                }))
                              }
                            />
                            <PickerSwatch
                              label="End"
                              value={gradC2}
                              onChange={(hex) =>
                                applyStyleChange((t) => ({
                                  ...t,
                                  background: buildTwoStopGradient(gradAngle, gradC1, hex),
                                }))
                              }
                            />
                          </div>
                          <div>
                            <span className="text-xs block mb-1.5" style={{ color: '#55556a' }}>
                              Angle
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {GRADIENT_ANGLES.map((deg) => (
                                <button
                                  key={deg}
                                  type="button"
                                  onClick={() =>
                                    applyStyleChange((t) => ({
                                      ...t,
                                      background: buildTwoStopGradient(deg, gradC1, gradC2),
                                    }))
                                  }
                                  className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
                                  style={{
                                    background: gradAngle === deg ? '#007aff' : '#1a1a25',
                                    color: gradAngle === deg ? '#fff' : '#88889a',
                                    border: `1px solid ${gradAngle === deg ? '#007aff' : '#252535'}`,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {deg}°
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <Label>CSS value</Label>
                      <textarea
                        value={bg}
                        onChange={(e) => applyStyleChange((t) => ({ ...t, background: e.target.value }))}
                        placeholder="#hex or linear-gradient(...)"
                        rows={2}
                        spellCheck={false}
                        style={{
                          width: '100%',
                          background: '#0d0d12',
                          border: '1px solid #252535',
                          borderRadius: 8,
                          padding: '8px 10px',
                          color: '#c8c8d4',
                          fontSize: 11,
                          fontFamily: 'ui-monospace, monospace',
                          outline: 'none',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          minHeight: 52,
                        }}
                      />

                      <div
                        className="mt-3 rounded-xl overflow-hidden"
                        style={{
                          height: 48,
                          background: bg,
                          border: '1px solid #2a2a38',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
                        }}
                      />
                    </div>

                    {/* Text colors */}
                    <div style={cardShell}>
                      <p className="text-xs font-semibold mb-3" style={{ color: '#88889a' }}>
                        Text
                      </p>
                      <ColorRow
                        label="Title"
                        value={effectiveStyle.titleColor}
                        onChange={(v) => applyStyleChange((t) => ({ ...t, titleColor: v }))}
                      />
                      <ColorRow
                        label="Subtitle"
                        value={effectiveStyle.subtitleColor}
                        onChange={(v) => applyStyleChange((t) => ({ ...t, subtitleColor: v }))}
                      />
                    </div>
                  </>
                )
              })()}
            </div>
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
