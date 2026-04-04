import { PRESET_TEMPLATES } from './templates'

export const FEATURE_GRAPHIC_W = 1024
export const FEATURE_GRAPHIC_H = 500

/**
 * Default Play feature graphic state (colors from first preset).
 * Headline defaults to App info name; banner icon defaults on only when an app icon exists.
 */
export function createDefaultFeatureGraphic(appInfo = {}) {
  const t = PRESET_TEMPLATES[0]
  const name =
    typeof appInfo.name === 'string' && appInfo.name.trim() ? appInfo.name.trim() : 'Your App Name'
  return {
    presetId: t.id,
    background: t.background,
    titleColor: t.titleColor,
    subtitleColor: t.subtitleColor,
    title: name,
    subtitle: 'Short tagline for your Google Play listing',
    showSubtitle: true,
    useAppIcon: Boolean(appInfo.icon),
    /** Data URL for a banner-only icon; null = use App info icon */
    iconDataUrl: null,
  }
}
