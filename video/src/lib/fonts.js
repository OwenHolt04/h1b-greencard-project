import { loadFont as loadSpaceMono } from '@remotion/google-fonts/SpaceMono';
import { loadFont as loadLocalFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// --- Body / UI / labels: Space Mono ---
const { fontFamily: spaceMonoFamily } = loadSpaceMono('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

// --- Display / hero / captions: Roca Two Bold ---
const ROCA_FAMILY = 'Roca Two';

loadLocalFont({
  family: ROCA_FAMILY,
  url: staticFile('fonts/roca-two-bold.ttf'),
  weight: '700',
  style: 'normal',
});

export const FONT_SANS = spaceMonoFamily;
export const FONT_DISPLAY = `'${ROCA_FAMILY}', Georgia, serif`;
// Keep FONT_SERIF as alias for FONT_DISPLAY for backward compat
export const FONT_SERIF = FONT_DISPLAY;
