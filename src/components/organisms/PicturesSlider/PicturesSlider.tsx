import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { A11y, Autoplay, EffectFade, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';

import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import { Icon } from '@/components/atoms/Icon';
import { BANNER_SIZES, BANNERS, CATEGORIES, ROUTES } from '@/constants';
import { useTranslation } from '@/hooks';
import { useThemeStore } from '@/store';

import styles from './PicturesSlider.module.scss';

import type { Category } from '@/types';
import type { MouseEvent } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';

const AUTOPLAY_DELAY = 6000;
const FADE_SPEED = 900;
const TABLET_BREAKPOINT = 640;
const PREFETCH_DELAY = 2500;

const getCategoryPath = (id: Category) =>
  CATEGORIES.find((category) => category.id === id)?.path ?? ROUTES.HOME;

const isTabletUp = () =>
  window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`).matches;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PicturesSlider = () => {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reachedIndex, setReachedIndex] = useState(0);
  const [prefetchAhead, setPrefetchAhead] = useState(0);
  const [autoplayEnabled] = useState(() => !prefersReducedMotion());
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setPrefetchAhead(1), PREFETCH_DELAY);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSlideChange = (instance: SwiperInstance) => {
    dotRefs.current.forEach((dot) => dot?.style.setProperty('--progress', '0'));
    setActiveIndex(instance.realIndex);
    setReachedIndex((prev) => Math.max(prev, instance.realIndex));
  };

  const handleTimeLeft = (
    instance: SwiperInstance,
    _timeLeft: number,
    percentage: number,
  ) => {
    dotRefs.current[instance.realIndex]?.style.setProperty(
      '--progress',
      String(1 - percentage),
    );
  };

  const handleSideClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as Element;

    if (!swiper || !isTabletUp() || target.closest('a, button')) {
      return;
    }

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const isLeftSide = event.clientX < left + width / 2;

    if (isLeftSide) {
      swiper.slidePrev();
    } else {
      swiper.slideNext();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <section
      className={
        autoplayEnabled ? styles.root : `${styles.root} ${styles.paused}`
      }
      aria-label={t.home.promotions}
      onClick={handleSideClick}
    >
      <Swiper
        className={styles.swiper}
        modules={[A11y, Autoplay, EffectFade, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={FADE_SPEED}
        slidesPerView={1}
        rewind
        keyboard={{ enabled: true }}
        breakpoints={{
          [TABLET_BREAKPOINT]: { allowTouchMove: false },
        }}
        autoplay={{
          enabled: autoplayEnabled,
          delay: AUTOPLAY_DELAY,
          disableOnInteraction: false,
        }}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        onAutoplayTimeLeft={handleTimeLeft}
      >
        {BANNERS.map((slide, index) => {
          const isLight = theme === 'light' && Boolean(slide.imageLight);
          const image = isLight ? slide.imageLight : slide.image;
          const srcSet = isLight ? slide.srcSetLight : slide.srcSet;
          const shouldLoad = index <= reachedIndex + prefetchAhead;
          const text = t.banners[slide.id];
          const isActive = index === activeIndex;
          const slideClasses = [
            styles.slide,
            slide.fullBleed && styles.slideFull,
            isActive && styles.slideActive,
          ]
            .filter(Boolean)
            .join(' ');
          const visualClasses = [
            styles.visual,
            slide.fit === 'contain' && styles.visualContain,
            slide.fullBleed && styles.visualFull,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <SwiperSlide
              key={slide.id}
              className={slideClasses}
            >
              <div className={visualClasses}>
                <img
                  className={styles.image}
                  src={shouldLoad ? image : undefined}
                  srcSet={shouldLoad ? srcSet : undefined}
                  sizes={
                    slide.fullBleed ?
                      BANNER_SIZES.fullBleed
                    : BANNER_SIZES.default
                  }
                  alt={shouldLoad ? text.alt : ''}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? undefined : 'async'}
                  {...(index === 0 ? { fetchpriority: 'high' } : {})}
                  draggable={false}
                  style={{
                    objectFit: slide.fit,
                    objectPosition: slide.position,
                  }}
                />
              </div>

              <div className={styles.panel}>
                <p className={styles.eyebrow}>{text.eyebrow}</p>
                <h3 className={styles.title}>{text.title}</h3>
                <p className={styles.subtitle}>{text.subtitle}</p>
                <Link
                  to={getCategoryPath(slide.category)}
                  className={styles.cta}
                  tabIndex={isActive ? 0 : -1}
                >
                  {text.cta}
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className={styles.controls}>
        <div className={styles.dots}>
          <button
            type="button"
            className={styles.arrow}
            aria-label={t.home.previousSlide}
            onClick={() => swiper?.slidePrev()}
          >
            <Icon
              src={chevronLeftIcon}
              alt=""
              className={styles.arrowIcon}
            />
          </button>

          {BANNERS.map((slide, index) => (
            <button
              key={slide.id}
              ref={(element) => {
                dotRefs.current[index] = element;
              }}
              type="button"
              className={
                index === activeIndex ?
                  `${styles.dot} ${styles.dotActive}`
                : styles.dot
              }
              aria-label={t.home.goToSlide(index + 1)}
              aria-current={index === activeIndex}
              onClick={() => swiper?.slideTo(index)}
            />
          ))}

          <button
            type="button"
            className={styles.arrow}
            aria-label={t.home.nextSlide}
            onClick={() => swiper?.slideNext()}
          >
            <Icon
              src={chevronRightIcon}
              alt=""
              className={styles.arrowIcon}
            />
          </button>
        </div>
      </div>
    </section>
  );
};
