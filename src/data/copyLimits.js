/**
 * Soft limits for on-image title/subtitle (not store metadata).
 * Text is not blocked; going over may clip in PhoneCard (overflow: hidden).
 */
export const SCREENSHOT_TITLE_SOFT_MAX = 40
export const SCREENSHOT_SUBTITLE_SOFT_MAX = 110

export const SCREENSHOT_COPY_INTRO =
  'Aim for short lines so text stays readable on phone and tablet mockups. You can type more; long copy may be clipped in the preview.'
