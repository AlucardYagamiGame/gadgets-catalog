import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import { Icon } from '@/components/atoms/Icon';
import { IconButton } from '@/components/atoms/IconButton';
import { ProductCard } from '@/components/molecules/ProductCard';
import { useTranslation, useProductActions } from '@/hooks';

import styles from './ProductsSlider.module.scss';

import 'swiper/css';

import type { Product } from '@/types';
import type { Swiper as SwiperInstance } from 'swiper/types';

interface ProductsSliderProps {
  title: string;
  products: Product[];
}

export const ProductsSlider = ({ title, products }: ProductsSliderProps) => {
  const { t, formatValue, formatPrice } = useTranslation();
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const { isInCart, isFavourite, toggleCart, toggleFavourite } =
    useProductActions();

  const syncEdges = (instance: SwiperInstance) => {
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  };

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.controls}>
          <IconButton
            variant="slider"
            aria-label={t.product.previousProducts}
            disabled={isBeginning}
            onClick={() => swiper?.slidePrev()}
          >
            <Icon
              src={chevronLeftIcon}
              alt=""
              className={styles.arrow}
            />
          </IconButton>
          <IconButton
            variant="slider"
            aria-label={t.product.nextProducts}
            disabled={isEnd}
            onClick={() => swiper?.slideNext()}
          >
            <Icon
              src={chevronRightIcon}
              alt=""
              className={styles.arrow}
            />
          </IconButton>
        </div>
      </div>

      <Swiper
        className={styles.swiperContainer}
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1200: { slidesPerView: 4 },
        }}
        onSwiper={(instance) => {
          setSwiper(instance);
          syncEdges(instance);
        }}
        onSlideChange={syncEdges}
        onResize={syncEdges}
      >
        {products.map((product) => (
          <SwiperSlide
            className={styles.slider}
            key={product.id}
          >
            <ProductCard
              product={product}
              labels={{ ...t.card, ...t.specs }}
              formatValue={formatValue}
              formatPrice={formatPrice}
              isInCart={isInCart(product.itemId)}
              isFavourite={isFavourite(product.itemId)}
              onToggleCart={() => toggleCart(product)}
              onToggleFavourite={() => toggleFavourite(product)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
