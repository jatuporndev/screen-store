import { useState, useRef, useEffect } from 'react'
import { Smartphone, Tablet, Download, Eye, Pencil, Loader2, AlertTriangle, Store } from 'lucide-react'
import { exportAllScreenshots } from '../utils/exportUtils'

const DeviceButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all"
    style={{
      background: active ? '#252535' : 'transparent',
      color: active ? '#f0f0f5' : '#55556a',
      border: 'none',
    }}
  >
    <Icon size={13} />
    {label}
  </button>
)

const PLATFORM_LABEL_STYLES = {
  ios: { label: 'iOS', color: '#007aff' },
  android: { label: 'Android', color: '#3ddc84' },
}

export default function Header({
  activeTab,
  setActiveTab,
  deviceType,
  setDeviceType,
  deviceConfigs,
  iosDeviceIds,
  androidDeviceIds,
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

  const showIosDevices = activeTab === 'editor' || activeTab === 'preview'
  const showAndroidDevices = activeTab === 'editor' || activeTab === 'play-preview'

  const renderDeviceGroup = (platform, ids) => {
    const ls = PLATFORM_LABEL_STYLES[platform]
    return (
      <div
        className="flex items-center gap-2 rounded-lg p-0.5 pl-2"
        style={{ background: '#1a1a25', border: '1px solid #252535' }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-widest shrink-0 select-none"
          style={{ color: ls.color }}
        >
          {ls.label}
        </span>
        <div className="flex items-center gap-0.5 flex-wrap p-0.5">
          {ids.map((id) => {
            const cfg = deviceConfigs[id]
            if (!cfg) return null
            return (
              <DeviceButton
                key={id}
                id={id}
                label={cfg.label}
                icon={deviceIcons[id]}
                active={deviceType === id}
                onClick={setDeviceType}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <header
      className="sticky top-0 z-40 flex flex-wrap items-center px-3 sm:px-5 gap-x-3 sm:gap-x-4 gap-y-2 shrink-0 min-h-[56px] sm:min-h-[60px] py-2 sm:py-2.5"
      style={{
        background: '#111118',
        borderBottom: '1px solid #1a1a25',
      }}
    >
      {/* Logo — white tile; PNG is black ink on white */}
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <div
          className="flex items-center justify-center rounded-lg overflow-hidden shrink-0"
          style={{
            width: 28,
            height: 28,
            background: '#ffffff',
            border: '1px solid #d8d8e4',
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}app_icon.png`}
            alt=""
            width={24}
            height={24}
            className="object-contain"
            decoding="async"
          />
        </div>
        <span className="font-bold text-sm tracking-tight" style={{ color: '#f0f0f5' }}>
          ScreenStore
        </span>
      </div>

      {/* Tab switcher */}
      <div
        className="flex items-center rounded-lg p-0.5 shrink-0"
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

      {/* Device presets: iOS and Android in separate groups (store tabs show one platform only) */}
      <div className="flex items-center gap-2 sm:gap-3 ml-0 sm:ml-1 flex-nowrap overflow-x-auto min-w-0 max-w-full pb-0.5 -mb-0.5 lg:flex-wrap lg:overflow-visible">
        {showIosDevices && renderDeviceGroup('ios', iosDeviceIds)}
        {showIosDevices && showAndroidDevices && (
          <div className="hidden sm:block h-7 w-px shrink-0" style={{ background: '#2a2a38' }} aria-hidden />
        )}
        {showAndroidDevices && renderDeviceGroup('android', androidDeviceIds)}
      </div>

      <div className="flex-1" />

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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0"
        style={{
          background: screenshots.length === 0 ? '#1a1a25' : '#007aff',
          color: screenshots.length === 0 ? '#33334a' : '#fff',
          cursor: screenshots.length === 0 ? 'not-allowed' : 'pointer',
          border: 'none',
        }}
      >
        {exportStatus ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            {exportStatus}
          </>
        ) : (
          <>
            <Download size={12} />
            Export All
          </>
        )}
      </button>

    </header>
  )
}
