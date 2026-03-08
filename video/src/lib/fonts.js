import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSourceSerif4 } from '@remotion/google-fonts/SourceSerif4';

const { fontFamily: interFamily } = loadInter('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const { fontFamily: serifFamily } = loadSourceSerif4('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
});

export const FONT_SANS = interFamily;
export const FONT_SERIF = serifFamily;
