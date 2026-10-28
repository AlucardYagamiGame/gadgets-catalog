import { useTranslation } from '@/hooks';

import styles from './ProductAbout.module.scss';

import type { ProductDescription } from '@/types';

interface ProductAboutProps {
  description: ProductDescription[];
}

export const ProductAbout = ({ description }: ProductAboutProps) => {
  const { t } = useTranslation();

  return (
    <section className={styles.root}>
      <h3 className={styles.title}>{t.product.about}</h3>
      {description.map(({ title, text }) => (
        <article key={title}>
          <h4 className={styles.subtitle}>{title}</h4>
          {text.map((paragraph) => (
            <p
              key={paragraph}
              className={styles.text}
            >
              {paragraph}
            </p>
          ))}
        </article>
      ))}
    </section>
  );
};
