import { useState, useCallback } from 'react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import ScreenshotList from './components/ScreenshotList'
import CustomizerPanel from './components/CustomizerPanel'
import ScreenshotPreview, { PhoneCard } from './components/ScreenshotPreview'
import AppStorePreview from './components/AppStorePreview'
import { PRESET_TEMPLATES } from './data/templates'

const DEFAULT_TEMPLATE = PRESET_TEMPLATES[0]

const DEVICE_CONFIGS = {
  iphone67: { label: 'iPhone 6.7"', exportW: 1290, exportH: 2796 },
  iphone65: { label: 'iPhone 6.5"', exportW: 1284, exportH: 2778 },
  ipad: { label: 'iPad Pro', exportW: 2048, exportH: 2732 },
}

export default function App() {
  const [screenshots, setScreenshots] = useState([])
  const [activeScreenshotId, setActiveScreenshotId] = useState(null)
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE)
  const [deviceType, setDeviceType] = useState('iphone67')
  const [activeTab, setActiveTab] = useState('editor')
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
        appInfo={appInfo}
      />

      {/* Hidden export cards for all screenshots — used by html2canvas */}
      {screenshots.map((ss) => {
        // cardWidth must equal exportW / 3 so that html2canvas at scale:3
        // produces exactly the App Store required pixel dimensions
        const exportCardWidth = DEVICE_CONFIGS[deviceType].exportW / 3
        return (
          <div
            key={ss.id}
            id={`export-card-${ss.id}`}
            style={{ position: 'absolute', top: 0, left: -9999, zIndex: -1, pointerEvents: 'none', visibility: 'hidden' }}
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
          {/* Left: Upload + Screenshot list */}
          <div
            className="flex flex-col border-r shrink-0"
            style={{ width: 260, borderColor: '#1a1a25', background: '#111118' }}
          >
            <UploadZone onUpload={handleUpload} />
            <ScreenshotList
              screenshots={screenshots}
              activeId={activeScreenshotId}
              onSelect={setActiveScreenshotId}
              onDelete={handleDeleteScreenshot}
              onReorder={setScreenshots}
            />
          </div>

          {/* Center: mini strip + main preview */}
          <div
            className="flex-1 flex flex-col overflow-hidden min-w-0"
            style={{ background: '#0d0d14' }}
          >
            {/* Mini overview strip */}
            {screenshots.length > 0 && (
              <div
                className="shrink-0 flex items-center gap-2 overflow-x-auto"
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

            {/* Main preview */}
            <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-8 gap-4">
              {activeScreenshot ? (
                <>
                  <div className="text-xs font-medium tracking-widest uppercase" style={{ color: '#55556a' }}>
                    Preview — {DEVICE_CONFIGS[deviceType].label}
                  </div>
                  <ScreenshotPreview
                    screenshot={activeScreenshot}
                    template={effectiveTemplate}
                    deviceType={deviceType}
                    cardWidth={260}
                  />
                  <div className="text-xs" style={{ color: '#55556a' }}>
                    {DEVICE_CONFIGS[deviceType].exportW} × {DEVICE_CONFIGS[deviceType].exportH} px
                  </div>
                </>
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
      ) : (
        <div className="flex-1 overflow-auto min-h-0">
          <AppStorePreview
            screenshots={screenshots}
            template={template}
            deviceType={deviceType}
            appInfo={appInfo}
            setAppInfo={setAppInfo}
          />
        </div>
      )}
    </div>
  )
}
