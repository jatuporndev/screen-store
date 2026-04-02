# ScreenStore — App Store Screenshot Generator

Generate polished App Store screenshots with custom device frames, gradient backgrounds, and text overlays — all in the browser, no design tools needed.

![ScreenStore](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

## Features

- **Device frames** — iPhone 6.7", iPhone 6.5", and iPad Pro mockups
- **Preset templates** — gradient backgrounds with matching title/subtitle colors
- **Per-screenshot customization** — override the global template on any individual screenshot
- **Text overlays** — title + subtitle positioned at the top or bottom of the card
- **App Store preview** — see a realistic mock App Store page before exporting
- **Export** — download individual PNGs or a full ZIP at exact App Store dimensions
  - iPhone 6.7": 1290 × 2796 px
  - iPhone 6.5": 1284 × 2778 px
  - iPad Pro: 2048 × 2732 px

## Tech Stack

| Package | Purpose |
|---|---|
| React 18 | UI |
| Vite 5 | Dev server & build |
| Tailwind CSS 3 | Utility styling |
| html2canvas | Screenshot capture |
| JSZip | ZIP export |
| file-saver | File download |
| lucide-react | Icons |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Upload** your app screenshots via drag-and-drop or the file picker.
2. **Pick a template** from the gallery or customise colors and background yourself.
3. **Edit text** — set a title and subtitle for each screenshot.
4. **Switch device** using the buttons in the header (iPhone 6.7", 6.5", or iPad Pro).
5. **Preview** the App Store page in the "App Store Preview" tab.
6. **Export** — click "Export All" to download a ZIP, or hover a card and click "Save" for a single PNG.

## Project Structure

```
src/
├── components/
│   ├── AppStorePreview.jsx   # Mock App Store page + export buttons
│   ├── CustomizerPanel.jsx   # Style, text, and app info editor
│   ├── Header.jsx            # Tabs, device selector
│   ├── ScreenshotList.jsx    # Sidebar screenshot list
│   ├── ScreenshotPreview.jsx # PhoneCard component (shared by preview & export)
│   ├── TemplateGallery.jsx   # Preset template grid
│   └── UploadZone.jsx        # Drag-and-drop upload
├── data/
│   └── templates.js          # Preset template definitions
├── utils/
│   └── exportUtils.js        # html2canvas capture + ZIP logic
├── App.jsx                   # Root state, hidden export cards
└── main.jsx                  # Entry point
```

## License

MIT
