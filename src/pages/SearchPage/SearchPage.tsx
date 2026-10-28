import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BackLink } from '@/components/atoms/BackLink';
import { AsyncContent } from '@/components/molecules/AsyncContent';
import { Breadcrumbs } from '@/components/molecules/Breadcrumbs';
import { Pagination } from '@/components/molecules/Pagination';
import { ProductsList } from '@/components/organisms/ProductsList';
import { DEFAULT_PER_PAGE, DEFAULT_SORT } from '@/constants';
import { useAsync, useTranslation } from '@/hooks';
import { searchProducts } from '@/services';
import { applyCatalogView, parsePage } from '@/utils';

import styles from './SearchPage.module.scss';

const PER_PAGE = Number(DEFAULT_PER_PAGE);

export const SearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';
  const page = parsePage(searchParams);

  const load = useCallback(
    () =>
      searchProducts(query, {
        page,
        perPage: PER_PAGE,
        sort: DEFAULT_SORT,
      }),
    [page, query],
  );
  const { data, error, isLoading, retry } = useAsync(load);
  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0;

  return (
    <div className={styles.root}>
      <Breadcrumbs
        items={[{ label: t.search.title }]}
        label={t.header.breadcrumbs}
        homeLabel={t.common.home}
      />

      <header className={styles.header}>
        <BackLink onClick={() => navigate(-1)}>{t.common.back}</BackLink>
        <h1 className={styles.title}>{t.search.title}</h1>
      </header>

      <AsyncContent
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        labels={t.status}
      >
        {data && (
          <>
            <p className={styles.count}>{t.search.results(data.total)}</p>
            {data.items.length === 0 ?
              <p className={styles.empty}>{t.search.empty(query.trim())}</p>
            : <>
                <ProductsList products={data.items} />
                {totalPages > 1 && (
                  <Pagination
                    current={page}
                    total={totalPages}
                    onChange={(nextPage) =>
                      setSearchParams((prev) =>
                        applyCatalogView(prev, { page: nextPage }),
                      )
                    }
                    labels={{
                      pagination: t.catalog.pagination,
                      previous: t.catalog.previousPage,
                      next: t.catalog.nextPage,
                    }}
                  />
                )}
              </>
            }
          </>
        )}
      </AsyncContent>
    </div>
  );
};
