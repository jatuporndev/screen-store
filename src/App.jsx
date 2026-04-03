import { useState, useCallback } from 'react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import ScreenshotList from './components/ScreenshotList'
import CustomizerPanel from './components/CustomizerPanel'
import ScreenshotPreview, { PhoneCard } from './components/ScreenshotPreview'
import AppStorePreview from './components/AppStorePreview'
import PlayStorePreview from './components/PlayStorePreview'
import ChangelogModal from './components/ChangelogModal'
import { PRESET_TEMPLATES } from './data/templates'
import { APP_VERSION } from './data/changelog'
import { Sparkles, ZoomIn, ZoomOut } from 'lucide-react'

const DEFAULT_TEMPLATE = PRESET_TEMPLATES[0]

const PREVIEW_BASE_CARD_W = 260
const PREVIEW_ZOOM_MIN = 0.4
const PREVIEW_ZOOM_MAX = 2.5
const PREVIEW_ZOOM_STEP = 0.1

const DEVICE_CONFIGS = {
  iphone67: { label: 'iPhone 6.7"', exportW: 1290, exportH: 2796 },
  iphone65: { label: 'iPhone 6.5"', exportW: 1284, exportH: 2778 },
  ipad: { label: 'iPad Pro', exportW: 2048, exportH: 2732 },
  android20_9: { label: 'Android 20:9', exportW: 1080, exportH: 2400 },
  android16_9: { label: 'Android 16:9', exportW: 1080, exportH: 1920 },
  androidTablet: { label: 'Android tablet', exportW: 1920, exportH: 1200 },
}

export default function App() {
  const [screenshots, setScreenshots] = useState([])
  const [activeScreenshotId, setActiveScreenshotId] = useState(null)
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE)
  const [deviceType, setDeviceType] = useState('iphone67')
  const [activeTab, setActiveTab] = useState('editor')
  const [showChangelog, setShowChangelog] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(1)
  const [appInfo, setAppInfo] = useState({
    name: 'Your App Name',
    developer: 'Developer Name',
    icon: null,
    category: 'Productivity',
    rating: 4.5,
    ratingCount: '2.1K',
    price: 'Free',
  })

  const handleUpload = useCallback((files) => {
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(file)
        }),
    )
    Promise.all(readers).then((dataUrls) => {
      setScreenshots((prev) => {
        const newItems = dataUrls.map((dataUrl, i) => ({
          id: `ss-${Date.now()}-${i}`,
          dataUrl,
          title: 'Your Feature Title',
          subtitle: 'Describe your feature here',
          showSubtitle: true,
          customStyle: null,
          order: prev.length + i,
        }))
        const updated = [...prev, ...newItems]
        if (!activeScreenshotId && updated.length > 0) {
          setActiveScreenshotId(updated[0].id)
        }
        return updated
      })
    })
  }, [activeScreenshotId])

  const handleUpdateScreenshot = useCallback((id, updates) => {
    setScreenshots((prev) => prev.map((ss) => (ss.id === id ? { ...ss, ...updates } : ss)))
  }, [])

  const handleDeleteScreenshot = useCallback(
    (id) => {
      setScreenshots((prev) => {
        const filtered = prev.filter((ss) => ss.id !== id)
        if (activeScreenshotId === id) {
          setActiveScreenshotId(filtered[0]?.id || null)
        }
        return filtered
      })
    },
    [activeScreenshotId],
  )

  const activeScreenshot = screenshots.find((ss) => ss.id === activeScreenshotId) || null
  const effectiveTemplate = activeScreenshot?.customStyle || template

  return (
    <div className="h-full flex flex-col" style={{ background: '#0a0a0f' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceType={deviceType}
        setDeviceType={setDeviceType}
        deviceConfigs={DEVICE_CONFIGS}
        screenshots={screenshots}
        template={template}
      />

      {/* Hidden export cards for all screenshots — used by html2canvas */}
      {screenshots.map((ss) => {
        // cardWidth must equal exportW / 3 so that html2canvas at scale:3
        // produces exactly the App Store required pixel dimensions
        const exp = DEVICE_CONFIGS[deviceType]
        const exportCardWidth = exp.exportW / 3
        const exportCardHeight = exp.exportH / 3
        return (
          <div
            key={ss.id}
            id={`export-card-${ss.id}`}
            style={{
              position: 'absolute',
              top: 0,
              left: -9999,
              zIndex: -1,
              width: `${exportCardWidth}px`,
              height: `${exportCardHeight}px`,
              overflow: 'hidden',
              pointerEvents: 'none',
              visibility: 'hidden',
            }}
          >
            <PhoneCard
              screenshot={ss}
              template={ss.customStyle || template}
              deviceType={deviceType}
              cardWidth={exportCardWidth}
            />
          </div>
        )
      })}

      {activeTab === 'editor' ? (
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left: Upload + Screenshot list + footer */}
          <div
            className="flex flex-col border-r shrink-0 min-h-0"
            style={{ width: 260, borderColor: '#1a1a25', background: '#111118' }}
          >
            <UploadZone onUpload={handleUpload} />
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ScreenshotList
                screenshots={screenshots}
                activeId={activeScreenshotId}
                onSelect={setActiveScreenshotId}
                onDelete={handleDeleteScreenshot}
                onReorder={setScreenshots}
              />
            </div>
            {/* Version + changelog pinned at bottom of sidebar */}
            <div
              className="shrink-0 flex items-center gap-2 px-3 py-2.5"
              style={{ borderTop: '1px solid #1a1a25' }}
            >
              <span style={{ color: '#33334a', fontSize: 11, fontWeight: 500 }}>
                v{APP_VERSION}
              </span>
              <button
                onClick={() => setShowChangelog(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                style={{
                  background: 'transparent',
                  border: '1px solid #1a1a25',
                  color: '#55556a',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                <Sparkles size={10} color="#007aff" />
                Changelog
              </button>
            </div>
          </div>

          {/* Center: mini strip + main preview */}
          <div
            className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0"
            style={{ background: '#0d0d14' }}
          >
            {/* Mini overview strip — above preview in stacking order so nothing paints over it */}
            {screenshots.length > 0 && (
              <div
                className="shrink-0 flex items-center gap-2 overflow-x-auto relative z-20"
                style={{
                  borderBottom: '1px solid #1a1a25',
                  background: '#0a0a10',
                  padding: '6px 10px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#1a1a25 transparent',
                }}
              >
                {screenshots.map((ss, i) => {
                  const ssTemplate = ss.customStyle || template
                  const isActive = ss.id === activeScreenshotId
                  return (
                    <button
                      key={ss.id}
                      onClick={() => setActiveScreenshotId(ss.id)}
                      title={ss.title || `Screenshot ${i + 1}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 2,
                        cursor: 'pointer',
                        borderRadius: 6,
                        flexShrink: 0,
                        outline: `2px solid ${isActive ? '#007aff' : 'transparent'}`,
                        outlineOffset: 1,
                        transition: 'outline-color 0.15s',
                        position: 'relative',
                      }}
                    >
                      <div style={{ borderRadius: 5, overflow: 'hidden', pointerEvents: 'none', opacity: isActive ? 1 : 0.6, transition: 'opacity 0.15s' }}>
                        <PhoneCard
                          screenshot={ss}
                          template={ssTemplate}
                          deviceType={deviceType}
                          cardWidth={36}
                        />
                      </div>
                      {ss.customStyle && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: '#007aff',
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Main preview — inner scroll from top (avoids centered overflow); zoom bar fixed to pane */}
            <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden z-0">
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 min-h-0 flex flex-col items-center gap-4"
                style={{ justifyContent: 'safe center' }}
              >
                {activeScreenshot ? (
                  <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="text-xs font-medium tracking-widest uppercase" style={{ color: '#55556a' }}>
                      Preview — {DEVICE_CONFIGS[deviceType].label}
                    </div>
                    <ScreenshotPreview
                      screenshot={activeScreenshot}
                      template={effectiveTemplate}
                      deviceType={deviceType}
                      cardWidth={Math.max(80, Math.round(PREVIEW_BASE_CARD_W * previewZoom))}
                    />
                    <div className="text-xs" style={{ color: '#55556a' }}>
                      {DEVICE_CONFIGS[deviceType].exportW} × {DEVICE_CONFIGS[deviceType].exportH} px
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 select-none">
                    <div
                      className="flex items-center justify-center rounded-2xl"
                      style={{ width: 80, height: 80, background: '#1a1a25' }}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="2" width="14" height="20" rx="3" stroke="#33334a" strokeWidth="1.5" />
                        <rect x="8" y="5" width="8" height="12" rx="1" fill="#33334a" />
                        <circle cx="12" cy="19" r="1" fill="#33334a" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold" style={{ color: '#88889a' }}>No screenshots yet</p>
                      <p className="text-sm mt-1" style={{ color: '#55556a' }}>Upload app screenshots to get started</p>
                    </div>
                  </div>
                )}
              </div>

              {activeScreenshot && (
                <div
                  className="flex items-center gap-1 rounded-lg p-0.5"
                  style={{
                    position: 'absolute',
                    right: 16,
                    bottom: 16,
                    zIndex: 10,
                    background: '#1a1a25',
                    border: '1px solid #252535',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
                  }}
                >
                  <button
                    type="button"
                    title="Zoom out"
                    aria-label="Zoom out preview"
                    disabled={previewZoom <= PREVIEW_ZOOM_MIN + 1e-6}
                    onClick={() =>
                      setPreviewZoom((z) =>
                        Math.max(PREVIEW_ZOOM_MIN, Math.round((z - PREVIEW_ZOOM_STEP) * 10) / 10),
                      )
                    }
                    className="flex items-center justify-center rounded-md transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                    style={{
                      width: 30,
                      height: 28,
                      background: 'transparent',
                      border: 'none',
                      color: '#a8a8b8',
                      cursor: previewZoom <= PREVIEW_ZOOM_MIN + 1e-6 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ZoomOut size={16} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    title="Reset zoom to 100%"
                    onClick={() => setPreviewZoom(1)}
                    className="text-[11px] font-mono font-semibold tabular-nums px-1 min-w-[3rem] text-center"
                    style={{
                      color: '#88889a',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {Math.round(previewZoom * 100)}%
                  </button>
                  <button
                    type="button"
                    title="Zoom in"
                    aria-label="Zoom in preview"
                    disabled={previewZoom >= PREVIEW_ZOOM_MAX - 1e-6}
                    onClick={() =>
                      setPreviewZoom((z) =>
                        Math.min(PREVIEW_ZOOM_MAX, Math.round((z + PREVIEW_ZOOM_STEP) * 10) / 10),
                      )
                    }
                    className="flex items-center justify-center rounded-md transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                    style={{
                      width: 30,
                      height: 28,
                      background: 'transparent',
                      border: 'none',
                      color: '#a8a8b8',
                      cursor: previewZoom >= PREVIEW_ZOOM_MAX - 1e-6 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ZoomIn size={16} strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Customizer Panel */}
          <div
            className="border-l overflow-y-auto shrink-0"
            style={{ width: 300, borderColor: '#1a1a25', background: '#111118' }}
          >
            <CustomizerPanel
              template={template}
              setTemplate={setTemplate}
              activeScreenshot={activeScreenshot}
              onUpdateScreenshot={handleUpdateScreenshot}
              appInfo={appInfo}
              setAppInfo={setAppInfo}
            />
          </div>
        </div>
      ) : activeTab === 'preview' ? (
        <div className="flex-1 overflow-auto min-h-0">
          <AppStorePreview
            screenshots={screenshots}
            template={template}
            deviceType={deviceType}
            appInfo={appInfo}
            setAppInfo={setAppInfo}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto min-h-0">
          <PlayStorePreview
            screenshots={screenshots}
            template={template}
            deviceType={deviceType}
            appInfo={appInfo}
          />
        </div>
      )}

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </div>
  )
}
