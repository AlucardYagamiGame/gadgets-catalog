import { useTranslation } from '@/hooks';

import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{t.notFound.title}</h1>
    </div>
  );
};
