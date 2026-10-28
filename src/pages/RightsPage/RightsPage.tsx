import { DEVELOPER } from '@/constants';
import { useTranslation } from '@/hooks';

import styles from './RightsPage.module.scss';

export const RightsPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{t.rights.title}</h1>
      <p className={styles.text}>{t.rights.copyright}</p>
      <p className={styles.text}>{t.rights.trademarks}</p>
      <p className={styles.text}>{t.rights.educational}</p>
      <p className={styles.text}>
        {t.rights.origin}{' '}
        <a
          className={styles.link}
          href={DEVELOPER.teamProject}
          target="_blank"
          rel="noreferrer"
        >
          {t.rights.originLink}
        </a>
        .
      </p>
      <p className={styles.text}>
        {t.rights.contact}{' '}
        <a
          className={styles.link}
          href={DEVELOPER.project}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
};
