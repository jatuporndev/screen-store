import { useState } from 'react'
import { Monitor, Smartphone, Tablet, Download, Eye, Pencil, Loader2 } from 'lucide-react'
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
  appInfo,
}) {
  const [exportStatus, setExportStatus] = useState(null)

  const handleExportAll = async () => {
    if (screenshots.length === 0) return
    await exportAllScreenshots(screenshots, template, deviceType, setExportStatus)
  }

  const deviceIcons = { iphone67: Smartphone, iphone65: Smartphone, ipad: Tablet }

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
          { id: 'preview', label: 'App Store Preview', Icon: Eye },
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

      {/* Device selector */}
      <div className="flex items-center gap-1.5 ml-2">
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
