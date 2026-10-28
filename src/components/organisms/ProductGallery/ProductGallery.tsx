import { useState } from 'react';

import styles from './ProductGallery.module.scss';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export const ProductGallery = ({ images, name }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.root}>
      <img
        className={styles.main}
        src={images[activeIndex]}
        alt={name}
      />
      <ul className={styles.thumbs}>
        {images.map((image, index) => (
          <li key={image}>
            <button
              type="button"
              className={
                index === activeIndex ?
                  `${styles.thumb} ${styles.active}`
                : styles.thumb
              }
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={image}
                alt=""
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
