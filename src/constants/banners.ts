import type { Category } from '@/types';

export interface BannerSlide {
  id: string;
  category: Category;
  image: string;
  srcSet: string;
  imageLight?: string;
  srcSetLight?: string;
  fit?: 'cover' | 'contain';
  position?: string;
  fullBleed?: boolean;
}

const SMALL_WIDTHS = [480, 800, 1200];

const buildSrcSet = (base: string, fullWidth: number) =>
  [
    ...SMALL_WIDTHS.map((width) => `${base}-${width}.webp ${width}w`),
    `${base}.webp ${fullWidth}w`,
  ].join(', ');

export const BANNER_SIZES = {
  default: '(min-width: 1200px) 930px, (min-width: 640px) 100vw, 134vw',
  fullBleed: '(min-width: 1440px) 1136px, (min-width: 640px) 114vw, 180vw',
};

export const BANNERS: BannerSlide[] = [
  {
    id: 'banner_phone',
    category: 'phones',
    image: 'img/slider/banner_phone.webp',
    srcSet: buildSrcSet('img/slider/banner_phone', 1600),
    imageLight: 'img/slider/banner_phone-light.webp',
    srcSetLight: buildSrcSet('img/slider/banner_phone-light', 1372),
    position: 'center',
  },
  {
    id: 'banner_tablet',
    category: 'tablets',
    image: 'img/slider/banner_tablet.webp',
    srcSet: buildSrcSet('img/slider/banner_tablet', 1600),
    imageLight: 'img/slider/banner_tablet-light.webp',
    srcSetLight: buildSrcSet('img/slider/banner_tablet-light', 1600),
    position: '100% center',
    fullBleed: true,
  },
  {
    id: 'banner_watch',
    category: 'accessories',
    image: 'img/slider/banner_watch.webp',
    srcSet: buildSrcSet('img/slider/banner_watch', 1600),
    imageLight: 'img/slider/banner_watch-light.webp',
    srcSetLight: buildSrcSet('img/slider/banner_watch-light', 1600),
    position: '100% center',
    fullBleed: true,
  },
];
