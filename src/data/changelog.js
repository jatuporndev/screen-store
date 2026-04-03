export const APP_VERSION = '2.0.0'

/**
 * Each entry: { version, date, tag, changes[] }
 * tag: 'new' | 'fix' | 'improvement'
 */
export const CHANGELOG = [
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
