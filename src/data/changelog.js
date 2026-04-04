export const APP_VERSION = '2.4.3'

/**
 * Each entry: { version, date, tag, changes[] }
 * tag: 'new' | 'fix' | 'improvement'
 */
export const CHANGELOG = [
  {
    version: '2.4.3',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'new', text: 'Feature graphic: upload a banner-only icon (overrides App info for this PNG) with “Use app icon instead” to reset' },
    ],
  },
  {
    version: '2.4.2',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'improvement', text: 'Default app icon in Style & app uses the bundled public/app_icon.png so previews and the feature graphic show a real icon before you upload your own' },
    ],
  },
  {
    version: '2.4.1',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'improvement', text: 'Feature graphic: headline defaults to App name; “App icon on banner” defaults off until you upload an app icon, then turns on automatically the first time' },
    ],
  },
  {
    version: '2.4.0',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'new', text: 'Feature graphic tab: Google Play 1024×500 banner editor with templates, headline & tagline, optional app icon from Style & app, and Download PNG export' },
    ],
  },
  {
    version: '2.3.0',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'new', text: 'Text tab: soft copy limits for screenshot title (40) and subtitle (110) with live counts; over-limit shows a truncation hint — typing is never blocked' },
      { tag: 'improvement', text: 'Short intro under Text explains why concise lines work better on device mockups' },
    ],
  },
  {
    version: '2.2.0',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'new', text: 'Mobile editor: Screens and Style open as bottom sheets so upload, list, and customizer stay reachable; desktop layout unchanged' },
      { tag: 'improvement', text: 'Editor shell uses dynamic viewport height (dvh) with a single scroll surface so the preview scrolls reliably on phones' },
      { tag: 'improvement', text: 'Header stays sticky on small screens; device preset groups scroll horizontally when they do not fit' },
      { tag: 'improvement', text: "App Store preview metadata row scrolls on narrow widths; What's New dialog width adapts to the viewport" },
      { tag: 'fix', text: 'Empty editor on mobile: Add screenshots button opens the Screens sheet' },
    ],
  },
  {
    version: '2.1.0',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'improvement', text: 'Header: iOS and Android device sizes in separate groups; App Store tab shows iOS only, Play Store tab Android only, with a sensible default when switching tabs' },
      { tag: 'improvement', text: 'Device buttons match the neutral Editor tab style; platform labels (iOS / Android) stay blue and green for quick scanning' },
      { tag: 'improvement', text: 'Export All is more compact, solid blue (no gradient); screenshot count removed from the header' },
      { tag: 'improvement', text: 'Colors → Background: extra spacing above the CSS value field' },
    ],
  },
  {
    version: '2.0.0',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'new', text: 'Major release — Google Play Store listing preview: Material 3 dark UI with accurate app bar, full-width Install pill, metadata chips, collapsible About with topic tags, ratings breakdown, sample review card, Data safety section, and App info' },
      { tag: 'new', text: 'Android mockups in the editor: 20:9 and 16:9 phones plus landscape tablet, with punch-hole, gesture nav, and export sizes matched to common Play requirements' },
      { tag: 'improvement', text: 'Header Export All writes play-store-screenshots.zip when the Play Store tab is active; npm package version aligned with the app (2.0.0)' },
    ],
  },
  {
    version: '1.3.0',
    date: 'Apr 4, 2026',
    entries: [
      { tag: 'new', text: 'Play Store preview tab — dark Material-style listing mock with Install row, screenshots carousel, and ratings' },
      { tag: 'new', text: 'Android device mockups: 20:9 phone (1080×2400), 16:9 phone (1080×1920), and landscape tablet (1920×1200) with punch-hole, gesture pill, and Play-appropriate export sizes' },
      { tag: 'improvement', text: "Header export ZIP uses play-store-screenshots when you're on the Play Store tab" },
    ],
  },
  {
    version: '1.2.2',
    date: 'Apr 3, 2026',
    entries: [
      { tag: 'fix', text: 'Export now matches preview — switched from html2canvas to html-to-image (SVG foreignObject) so object-fit:cover renders natively and screenshot images appear correctly' },
      { tag: 'fix', text: 'Export card rendered via a visible clone mounted behind the UI, resolving the blank/black screen caused by capturing off-screen hidden elements' },
    ],
  },
  {
    version: '1.2.1',
    date: 'Apr 3, 2026',
    entries: [
      { tag: 'new', text: 'Local-only storage warning — friendly ⚠ icon in the header; click to see a reminder that work lives in the browser tab only (no cloud, no sync)' },
      { tag: 'improvement', text: 'Version & Changelog button moved into the bottom of the left sidebar — no longer floats over the canvas' },
      { tag: 'fix', text: 'Screenshot list now properly scrolls inside a constrained wrapper so it can never overflow the sidebar' },
    ],
  },
  {
    version: '1.2.0',
    date: 'Apr 3, 2026',
    entries: [
      { tag: 'new', text: "What's New dialog — in-app changelog from the version chip" },
      { tag: 'new', text: 'Full Mockup preset — full-bleed device on a studio-style background (no marketing text block)' },
      { tag: 'improvement', text: 'iPhone frame tuned for App Store–style cards: softer shadow, thinner bezel, metallic side buttons, home indicator' },
      { tag: 'fix', text: 'Left sidebar screenshot list scrolls inside the panel; version/changelog sits past the rail in the editor so it is not covered' },
      { tag: 'improvement', text: 'Customizer panel and template gallery updates' },
    ],
  },
  {
    version: '1.1.0',
    date: 'Apr 3, 2026',
    entries: [
      { tag: 'fix', text: 'Export now matches preview — screenshot image crops identically in both (html2canvas object-fit fix)' },
      { tag: 'fix', text: 'iPad Pro and iPhone 6.5" exports now render at correct App Store pixel dimensions (2048×2732 and 1284×2778)' },
      { tag: 'fix', text: 'Web fonts (Inter) now fully loaded before capture, so exported text matches the preview' },
      { tag: 'improvement', text: 'Hidden export cards switched from position:fixed to position:absolute for more reliable html2canvas capture' },
    ],
  },
  {
    version: '1.0.0',
    date: 'Apr 2, 2026',
    entries: [
      { tag: 'new', text: 'Initial release — App Store screenshot generator' },
      { tag: 'new', text: 'Device frames: iPhone 6.7", iPhone 6.5", iPad Pro' },
      { tag: 'new', text: 'Preset gradient templates with matching text colors' },
      { tag: 'new', text: 'Per-screenshot style overrides' },
      { tag: 'new', text: 'Text overlay with top/bottom positioning' },
      { tag: 'new', text: 'App Store Preview tab with realistic mock page' },
      { tag: 'new', text: 'Export single PNG or full ZIP at exact App Store dimensions' },
    ],
  },
]
