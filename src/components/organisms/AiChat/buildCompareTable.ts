import { getProductPath } from '@/constants';

import type {
  ChatCompareColumn,
  ChatCompareRow,
} from '@/components/molecules/ChatCompare';
import type { AiCompareProduct } from '@/services/aiCompare';

const SPEC_KEYS = [
  'screen',
  'resolution',
  'processor',
  'ram',
  'capacity',
  'camera',
] as const;

type SpecKey = (typeof SPEC_KEYS)[number];

export const buildCompareTable = (
  products: AiCompareProduct[],
  labels: Record<SpecKey, string>,
  formatValue: (value: string) => string,
  formatPrice: (value: number) => string,
) => {
  const columns: ChatCompareColumn[] = products.map((product) => ({
    id: product.itemId,
    name: product.name,
    image: product.image,
    path: getProductPath(product.itemId),
    price: formatPrice(product.price),
  }));

  const rows: ChatCompareRow[] = SPEC_KEYS.filter((key) =>
    products.some((product) => product[key]),
  ).map((key) => {
    const values = products.map((product) =>
      product[key] ? formatValue(product[key]) : '—',
    );

    return {
      label: labels[key],
      values,
      isDifferent: new Set(values).size > 1,
    };
  });

  return { columns, rows };
};
