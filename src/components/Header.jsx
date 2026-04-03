import { useState, useRef, useEffect } from 'react'
import { Monitor, Smartphone, Tablet, Download, Eye, Pencil, Loader2, AlertTriangle, Store } from 'lucide-react'
import { exportAllScreenshots } from '../utils/exportUtils'

const DeviceButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
    style={{
      background: active ? '#007aff' : 'transparent',
      color: active ? '#fff' : '#88889a',
      border: `1px solid ${active ? '#007aff' : '#252535'}`,
    }}
  >
    <Icon size={13} />
    {label}
  </button>
)

export default function Header({
  activeTab,
  setActiveTab,
  deviceType,
  setDeviceType,
  deviceConfigs,
  screenshots,
  template,
}) {
  const [exportStatus, setExportStatus] = useState(null)
  const [showStorageInfo, setShowStorageInfo] = useState(false)
  const storageRef = useRef(null)

  useEffect(() => {
    if (!showStorageInfo) return
    const handler = (e) => {
      if (storageRef.current && !storageRef.current.contains(e.target)) {
        setShowStorageInfo(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showStorageInfo])

  const handleExportAll = async () => {
    if (screenshots.length === 0) return
    const playOpts =
      activeTab === 'play-preview'
        ? { folderName: 'play-store-screenshots', zipFileName: 'play-store-screenshots.zip' }
        : undefined
    await exportAllScreenshots(screenshots, template, deviceType, setExportStatus, playOpts)
  }

  const deviceIcons = {
    iphone67: Smartphone,
    iphone65: Smartphone,
    ipad: Tablet,
    android20_9: Smartphone,
    android16_9: Smartphone,
    androidTablet: Tablet,
  }

  return (
    <header
      className="flex items-center px-5 gap-4 shrink-0 overflow-hidden"
      style={{
        height: 60,
        background: '#111118',
        borderBottom: '1px solid #1a1a25',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #007aff, #5856d6)' }}
        >
          <Monitor size={14} color="#fff" />
        </div>
        <span className="font-bold text-sm tracking-tight" style={{ color: '#f0f0f5' }}>
          ScreenStore
        </span>
      </div>

      {/* Tab switcher */}
      <div
        className="flex items-center rounded-lg p-0.5"
        style={{ background: '#1a1a25', border: '1px solid #252535' }}
      >
        {[
          { id: 'editor', label: 'Editor', Icon: Pencil },
          { id: 'preview', label: 'App Store', Icon: Eye },
          { id: 'play-preview', label: 'Play Store', Icon: Store },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: activeTab === id ? '#252535' : 'transparent',
              color: activeTab === id ? '#f0f0f5' : '#55556a',
            }}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Device selector — iOS + Android mockups */}
      <div className="flex items-center gap-1.5 ml-2 flex-wrap min-w-0 max-w-[42vw] sm:max-w-none">
        {Object.entries(deviceConfigs).map(([id, cfg]) => (
          <DeviceButton
            key={id}
            id={id}
            label={cfg.label}
            icon={deviceIcons[id]}
            active={deviceType === id}
            onClick={setDeviceType}
          />
        ))}
      </div>

      <div className="flex-1" />

      {/* Screenshot count */}
      {screenshots.length > 0 && (
        <span className="text-xs" style={{ color: '#55556a' }}>
          {screenshots.length} screenshot{screenshots.length !== 1 ? 's' : ''}
        </span>
      )}

      {/* Local-only storage notice */}
      <div ref={storageRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowStorageInfo((v) => !v)}
          title="Storage info"
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{
            width: 30,
            height: 30,
            background: showStorageInfo ? '#1e1e2a' : 'transparent',
            border: `1px solid ${showStorageInfo ? '#38384a' : '#252535'}`,
            cursor: 'pointer',
          }}
        >
          <AlertTriangle size={14} color="#7a7a9a" />
        </button>

        {showStorageInfo && (
          <div
            style={{
              position: 'fixed',
              top: 68,
              right: 16,
              width: 280,
              background: '#16161f',
              border: '1px solid #25253a',
              borderRadius: 10,
              padding: '12px 14px',
              zIndex: 9999,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={13} color="#7a7a9a" />
              <span style={{ color: '#a0a0bf', fontSize: 12, fontWeight: 600 }}>No cloud storage</span>
            </div>
            <p style={{ color: '#65657a', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
              Your work only lives in this browser tab — no cloud, no sync, no backup. ✨
              <br />
              <span style={{ color: '#8888a8' }}>Refresh = poof, it&apos;s gone.</span>
              <br />
              Export early &amp; often to keep your screenshots safe!
            </p>
          </div>
        )}
      </div>

      {/* Export button */}
      <button
        onClick={handleExportAll}
        disabled={screenshots.length === 0 || !!exportStatus}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        style={{
          background: screenshots.length === 0 ? '#1a1a25' : 'linear-gradient(135deg, #007aff, #5856d6)',
          color: screenshots.length === 0 ? '#33334a' : '#fff',
          cursor: screenshots.length === 0 ? 'not-allowed' : 'pointer',
          border: 'none',
        }}
      >
        {exportStatus ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {exportStatus}
          </>
        ) : (
          <>
            <Download size={14} />
            Export All
          </>
        )}
      </button>

    </header>
  )
}
