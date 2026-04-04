import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// GitHub Pages project site: https://<user>.github.io/<repo>/
const repoBase = '/screen-store/'

const SITE_DESCRIPTION =
  'Create App Store and Google Play screenshots in your browser — device frames, gradients, text overlays, realistic store previews, and PNG/ZIP export at exact store dimensions. Free; no design tools required.'

/** Build-time origin for canonical, Open Graph URL, sitemap (no trailing slash). */
function siteOrigin() {
  return (process.env.VITE_SITE_URL || '').trim().replace(/\/$/, '')
}

function iconPathForBase(htmlBase) {
  const trimmed = htmlBase === '/' ? '' : htmlBase.replace(/\/$/, '')
  return trimmed ? `${trimmed}/app_icon.png` : '/app_icon.png'
}

function seoPlugin(htmlBase) {
  return {
    name: 'seo',
    enforce: 'pre',
    transformIndexHtml(html) {
      const origin = siteOrigin()
      const canonical = origin ? `${origin}/` : null
      const descJson = JSON.stringify(SITE_DESCRIPTION).slice(1, -1)
      let out = html
        .replaceAll('__SEO_DESCRIPTION__', SITE_DESCRIPTION)
        .replaceAll('__SEO_DESCRIPTION_JSON__', descJson)

      const socialImage = origin ? `${origin}/icon.svg` : iconPathForBase(htmlBase)
      out = out.replaceAll('__SEO_SOCIAL_IMAGE__', socialImage)

      if (canonical) {
        out = out.replaceAll('__SEO_CANONICAL__', canonical)
        out = out.replace('__SEO_SCHEMA_URL_LINE__', `  "url": "${canonical}",\n`)
      } else {
        out = out.replace(/\s*<link rel="canonical" href="__SEO_CANONICAL__" \/>\s*\r?\n?/i, '')
        out = out.replace(/\s*<meta property="og:url" content="__SEO_CANONICAL__" \/>\s*\r?\n?/i, '')
        out = out.replace(/\s*<meta name="twitter:url" content="__SEO_CANONICAL__" \/>\s*\r?\n?/i, '')
        out = out.replace('__SEO_SCHEMA_URL_LINE__', '')
      }

      return out
    },
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      const origin = siteOrigin()
      let robots = 'User-agent: *\nAllow: /\n'
      if (origin) {
        robots += `\nSitemap: ${origin}/sitemap.xml\n`
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>1</priority></url>
</urlset>
`
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
      }
      fs.writeFileSync(path.join(outDir, 'robots.txt'), robots)
    },
  }
}

export default defineConfig(({ command }) => {
  const htmlBase = command === 'build' ? repoBase : '/'
  return {
    plugins: [react(), seoPlugin(htmlBase)],
    base: htmlBase,
  }
})
