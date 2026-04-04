import { useState, useRef, useEffect } from 'react'
import {
  Smartphone,
  Tablet,
  Download,
  Eye,
  Pencil,
  Loader2,
  AlertTriangle,
  Store,
  ImageIcon,
  ChevronDown,
  Check,
} from 'lucide-react'
import { exportAllScreenshots, exportFeatureGraphic } from '../utils/exportUtils'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#111118]'

const DeviceButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    className={`flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap transition-[background,color] duration-150 sm:gap-1 sm:px-2 sm:py-1 sm:text-[11px] ${focusRing} ${
      active
        ? 'bg-[#2a2d42] text-[#f0f0f5] shadow-[inset_0_0_0_1px_rgba(0,122,255,0.22)]'
        : 'bg-transparent text-[#6a6a7e] hover:bg-white/[0.06] hover:text-[#b4b4c4]'
    }`}
    style={{ border: 'none', cursor: 'pointer' }}
  >
    <Icon size={12} className="shrink-0 opacity-90" />
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
  const [showNavMenu, setShowNavMenu] = useState(false)
  const [showDeviceMenu, setShowDeviceMenu] = useState(false)
  const storageRef = useRef(null)
  const navMenuRef = useRef(null)
  const deviceMenuRef = useRef(null)

  useEffect(() => {
    if (!showStorageInfo) return
    const handler = (e) => {
      if (storageRef.current && !storageRef.current.contains(e.target)) {
        setShowStorageInfo(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setShowStorageInfo(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [showStorageInfo])

  useEffect(() => {
    if (!showNavMenu && !showDeviceMenu) return
    const handler = (e) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target)) {
        setShowNavMenu(false)
      }
      if (deviceMenuRef.current && !deviceMenuRef.current.contains(e.target)) {
        setShowDeviceMenu(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowNavMenu(false)
        setShowDeviceMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [showNavMenu, showDeviceMenu])

  const handleExportAll = async () => {
    if (activeTab === 'feature-graphic') {
      await exportFeatureGraphic(setExportStatus)
      return
    }
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
  const exportDisabled =
    activeTab === 'feature-graphic' ? !!exportStatus : screenshots.length === 0 || !!exportStatus

  const renderDeviceGroup = (platform, ids) => {
    const ls = PLATFORM_LABEL_STYLES[platform]
    return (
      <div className="flex shrink-0 items-center gap-1 rounded-lg border border-[#2a2a38] bg-[#14141c] p-0.5 pl-1.5 sm:gap-1.5 sm:pl-2">
        <span
          className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest shrink-0 select-none"
          style={{ color: ls.color }}
        >
          {ls.label}
        </span>
        <div className="flex items-center gap-0.5 p-0.5 flex-nowrap">
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

  const showDeviceBar = showIosDevices || showAndroidDevices
  const currentDeviceCfg = deviceConfigs[deviceType]

  const tabItems = [
    { id: 'editor', label: 'Editor', shortLabel: 'Edit', Icon: Pencil },
    { id: 'preview', label: 'App Store', shortLabel: 'iOS', Icon: Eye },
    { id: 'play-preview', label: 'Play Store', shortLabel: 'Play', Icon: Store },
    { id: 'feature-graphic', label: 'Feature graphic', shortLabel: 'Banner', Icon: ImageIcon },
  ]

  return (
    <header className="sticky top-0 z-40 flex shrink-0 flex-col gap-0 border-b border-[#1a1a25] bg-[#111118]/92 px-3 pt-1.5 pb-0 backdrop-blur-md sm:px-4 sm:pt-2 sm:pb-0">
      {/* Row 1: margin below this bar only when Export size strip follows (not whole-header margin) */}
      <div
        className={`flex min-w-0 flex-nowrap items-center gap-2 sm:gap-2.5 lg:grid lg:min-h-0 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-3 ${showDeviceBar ? 'mb-1.5 sm:mb-2' : 'pb-1 sm:pb-1.5'}`}
      >
        {/* Logo — white tile; PNG is black ink on white */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div
            className="flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#e8e8f0] bg-white transition-shadow duration-200 hover:shadow-sm"
            style={{
              width: 36,
              height: 36,
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}app_icon.png`}
              alt="ScreenStore"
              className="block max-w-none"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                transform: 'translateX(5px) scale(1.38)',
                transformOrigin: 'center center',
                filter: 'brightness(0.82)',
              }}
            />
          </div>
          <span className="hidden text-xs font-semibold tracking-tight text-[#e8e8f0] sm:inline">
            ScreenStore
          </span>
        </div>

        {/* Below lg: one menu (touch-friendly). lg+: inline pills, left-aligned (tool-style). */}
        <div
          ref={navMenuRef}
          className="relative min-w-0 flex-1 lg:flex lg:min-w-0 lg:justify-start"
        >
          <div className="hidden w-full min-w-0 justify-start overflow-x-auto overflow-y-hidden lg:flex [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav
              className="inline-flex max-w-max items-center gap-px rounded-lg border border-[#252532] bg-[#13131a] p-0.5"
              aria-label="Main"
            >
              {tabItems.map(({ id, label, shortLabel, Icon }) => {
                const on = activeTab === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    title={label}
                    aria-label={label}
                    aria-current={on ? 'page' : undefined}
                    className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-[background,color] duration-150 sm:gap-1 sm:px-2.5 sm:py-1.5 sm:text-[11px] 2xl:px-3 2xl:text-xs ${focusRing} ${
                      on
                        ? 'bg-[#2a2d42] text-[#f0f0f5] shadow-[inset_0_0_0_1px_rgba(0,122,255,0.22)]'
                        : 'text-[#6a6a7e] hover:bg-white/[0.06] hover:text-[#b8b8c8]'
                    }`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    <Icon size={12} className="shrink-0 opacity-90" />
                    <span className="2xl:hidden">{shortLabel}</span>
                    <span className="hidden 2xl:inline">{label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="lg:hidden">
            {(() => {
              const current = tabItems.find((t) => t.id === activeTab) ?? tabItems[0]
              const CurIcon = current.Icon
              return (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNavMenu((v) => !v)
                      setShowDeviceMenu(false)
                    }}
                    aria-expanded={showNavMenu}
                    aria-haspopup="menu"
                    title="Choose screen"
                    className={`flex h-10 min-w-0 max-w-full flex-1 items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12px] font-semibold transition-[background,border-color] duration-150 ${focusRing} ${
                      showNavMenu
                        ? 'border-[#4a4a62] bg-[#1e1e2a] text-[#e8e8f2]'
                        : 'border-[#2a2a38] bg-[#14141c] text-[#d4d4e4] hover:border-[#3a3a4e]'
                    }`}
                    style={{ borderStyle: 'solid', cursor: 'pointer' }}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <CurIcon size={14} className="shrink-0 opacity-90" />
                      <span className="truncate">{current.label}</span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[#7a7a9a] transition-transform duration-150 ${showNavMenu ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>

                  {showNavMenu && (
                    <div
                      role="menu"
                      aria-label="Main navigation"
                      className="popover-in absolute left-0 right-0 z-[55] mt-2 max-h-[min(70vh,420px)] overflow-y-auto rounded-xl border border-[#2e2e42] bg-[#16161f] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
                    >
                      {tabItems.map(({ id, label, Icon }) => {
                        const on = activeTab === id
                        return (
                          <button
                            key={id}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setActiveTab(id)
                              setShowNavMenu(false)
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] font-medium transition-colors duration-150 ${focusRing} ${
                              on
                                ? 'bg-[#252535] text-[#f0f0f5]'
                                : 'text-[#9a9ab0] hover:bg-white/[0.06] hover:text-[#d8d8e8]'
                            }`}
                            style={{ border: 'none', cursor: 'pointer' }}
                          >
                            <Icon size={18} className="shrink-0 opacity-90" />
                            <span className="min-w-0 flex-1">{label}</span>
                            {on ? <Check size={16} className="shrink-0 opacity-90" aria-hidden /> : null}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-1.5">
          {/* Local-only storage notice */}
          <div ref={storageRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNavMenu(false)
                setShowDeviceMenu(false)
                setShowStorageInfo((v) => !v)
              }}
              title="How your data is stored"
              aria-expanded={showStorageInfo}
              aria-haspopup="dialog"
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-[background,border-color] duration-150 ${focusRing} ${
                showStorageInfo
                  ? 'border-[#4a4a62] bg-[#1e1e2a] text-[#a8a8bf]'
                  : 'border-[#2a2a38] bg-transparent text-[#7a7a9a] hover:border-[#3a3a4e] hover:bg-[#1a1a22]'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <AlertTriangle size={14} strokeWidth={2} />
            </button>

            {showStorageInfo && (
              <div
                role="dialog"
                aria-label="Storage information"
                className="popover-in absolute right-0 z-[60] mt-2 w-[min(288px,calc(100vw-24px))] rounded-xl border border-[#2e2e42] bg-[#16161f] p-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.55)] sm:w-[288px]"
              >
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#252532]">
                    <AlertTriangle size={15} color="#a8a8bf" strokeWidth={2} />
                  </span>
                  <span className="text-[13px] font-semibold text-[#d4d4e4]">Local only</span>
                </div>
                <p className="m-0 text-[12px] leading-relaxed text-[#8c8ca0]">
                  Nothing is uploaded. Your work stays in this browser tab — no account, no sync.
                </p>
                <p className="mt-2.5 m-0 text-[12px] leading-relaxed text-[#6e6e82]">
                  Closing the tab or refreshing can lose unsaved work.{' '}
                  <span className="text-[#9a9ab0]">Export often</span> to keep copies.
                </p>
              </div>
            )}
          </div>

          {/* Export */}
          <button
            type="button"
            onClick={handleExportAll}
            disabled={exportDisabled}
            className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold whitespace-nowrap transition-[background,box-shadow,opacity] duration-150 sm:gap-1.5 sm:px-2.5 sm:py-2 sm:text-[11px] ${focusRing} ${
              exportDisabled && !exportStatus
                ? 'cursor-not-allowed bg-[#1c1c26] text-[#4a4a5c]'
                : 'bg-[#007aff] text-white shadow-[0_1px_8px_rgba(0,122,255,0.28)] enabled:hover:bg-[#1a7aff] enabled:hover:shadow-[0_2px_12px_rgba(0,122,255,0.38)]'
            }`}
            style={{ border: 'none' }}
          >
            {exportStatus ? (
              <>
                <Loader2 size={12} className="shrink-0 animate-spin" />
                <span className="max-w-[140px] truncate sm:max-w-[200px]">{exportStatus}</span>
              </>
            ) : (
              <>
                <Download size={12} className="shrink-0" />
                <span className="hidden min-[400px]:inline">
                  {activeTab === 'feature-graphic' ? 'Download PNG' : 'Export All'}
                </span>
                <span className="min-[400px]:hidden">{activeTab === 'feature-graphic' ? 'PNG' : 'Export'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: full-bleed, flush under row 1 — hairline + tint only (no margin gap) */}
      {showDeviceBar && (
        <div className="-mx-3 border-t border-white/[0.06] bg-[#0f0f16] sm:-mx-4">
          <div className="flex min-h-[36px] items-center px-3 py-1 sm:min-h-[38px] sm:px-4 sm:py-1.5">
            <div ref={deviceMenuRef} className="relative w-full xl:hidden">
              <button
                type="button"
                onClick={() => {
                  setShowDeviceMenu((v) => !v)
                  setShowNavMenu(false)
                }}
                aria-expanded={showDeviceMenu}
                aria-haspopup="menu"
                title="Export dimensions"
                className={`flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md px-1 py-1 text-left text-[12px] font-semibold transition-[background,color] duration-150 ${focusRing} ${
                  showDeviceMenu
                    ? 'bg-white/[0.06] text-[#e8e8f2]'
                    : 'bg-transparent text-[#d4d4e4] hover:bg-white/[0.04]'
                }`}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0 leading-tight">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#5c5c72]">
                    Export size
                  </span>
                  <span className="truncate text-[13px] font-semibold text-[#f0f0f5]">
                    {currentDeviceCfg?.label ?? 'Device'}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-[#7a7a9a] transition-transform duration-150 ${showDeviceMenu ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>

              {showDeviceMenu && (
                <div
                  role="menu"
                  aria-label="Export size"
                  className="popover-in absolute left-0 right-0 z-[55] mt-2 max-h-[min(65vh,380px)] overflow-y-auto rounded-xl border border-[#2e2e42] bg-[#16161f] p-2 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
                >
                {showIosDevices && (
                  <div className="mb-2">
                    <p
                      className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: PLATFORM_LABEL_STYLES.ios.color }}
                    >
                      {PLATFORM_LABEL_STYLES.ios.label}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {iosDeviceIds.map((id) => {
                        const cfg = deviceConfigs[id]
                        if (!cfg) return null
                        const on = deviceType === id
                        const Icon = deviceIcons[id]
                        return (
                          <button
                            key={id}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setDeviceType(id)
                              setShowDeviceMenu(false)
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors duration-150 ${focusRing} ${
                              on
                                ? 'bg-[#252535] text-[#f0f0f5]'
                                : 'text-[#9a9ab0] hover:bg-white/[0.06] hover:text-[#d8d8e8]'
                            }`}
                            style={{ border: 'none', cursor: 'pointer' }}
                          >
                            <Icon size={16} className="shrink-0 opacity-90" />
                            <span className="min-w-0 flex-1 truncate">{cfg.label}</span>
                            {on ? <Check size={16} className="shrink-0 text-[#6eb3ff]" aria-hidden /> : null}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                {showIosDevices && showAndroidDevices && (
                  <div className="my-1.5 h-px bg-[#2a2a38]" aria-hidden />
                )}
                {showAndroidDevices && (
                  <div>
                    <p
                      className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: PLATFORM_LABEL_STYLES.android.color }}
                    >
                      {PLATFORM_LABEL_STYLES.android.label}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {androidDeviceIds.map((id) => {
                        const cfg = deviceConfigs[id]
                        if (!cfg) return null
                        const on = deviceType === id
                        const Icon = deviceIcons[id]
                        return (
                          <button
                            key={id}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setDeviceType(id)
                              setShowDeviceMenu(false)
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors duration-150 ${focusRing} ${
                              on
                                ? 'bg-[#252535] text-[#f0f0f5]'
                                : 'text-[#9a9ab0] hover:bg-white/[0.06] hover:text-[#d8d8e8]'
                            }`}
                            style={{ border: 'none', cursor: 'pointer' }}
                          >
                            <Icon size={16} className="shrink-0 opacity-90" />
                            <span className="min-w-0 flex-1 truncate">{cfg.label}</span>
                            {on ? <Check size={16} className="shrink-0 text-[#6eb3ff]" aria-hidden /> : null}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                </div>
              )}
            </div>

            <div
              className="hidden min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto sm:gap-2.5 xl:flex [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <span
                className="hidden shrink-0 text-[9px] font-semibold uppercase tracking-wider text-[#5c5c72] md:inline"
                title="Dimensions used when you export"
              >
                Export size
              </span>
              {showIosDevices && renderDeviceGroup('ios', iosDeviceIds)}
              {showIosDevices && showAndroidDevices && (
                <div className="h-6 w-px shrink-0 self-center bg-[#2e2e3c]" aria-hidden />
              )}
              {showAndroidDevices && renderDeviceGroup('android', androidDeviceIds)}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
