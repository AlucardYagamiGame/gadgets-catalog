import { ProductSpecs } from '@/components/molecules/ProductSpecs';
import { useTranslation } from '@/hooks';

import styles from './ProductTechSpecs.module.scss';

import type { ProductDetails } from '@/types';

interface ProductTechSpecsProps {
  product: ProductDetails;
}

export const ProductTechSpecs = ({ product }: ProductTechSpecsProps) => {
  const { t, formatValue } = useTranslation();

  return (
    <section className={styles.root}>
      <h3 className={styles.title}>{t.product.techSpecs}</h3>
      <ProductSpecs
        specs={[
          { label: t.specs.screen, value: product.screen },
          { label: t.specs.resolution, value: product.resolution },
          { label: t.specs.processor, value: product.processor },
          { label: t.specs.ram, value: formatValue(product.ram) },
          {
            label: t.specs.builtInMemory,
            value: formatValue(product.capacity),
          },
          {
            label: t.specs.camera,
            value: product.camera ? formatValue(product.camera) : '-',
          },
          { label: t.specs.zoom, value: product.zoom ?? '-' },
          { label: t.specs.cell, value: product.cell.join(', ') },
        ]}
      />
    </section>
  );
};
