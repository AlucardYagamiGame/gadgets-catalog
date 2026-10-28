import { DEVELOPER } from '@/constants';
import { useTranslation } from '@/hooks';

import styles from './DeveloperPage.module.scss';

export const DeveloperPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{t.developer.title}</h1>
      <a
        className={styles.card}
        href={DEVELOPER.github}
        target="_blank"
        rel="noreferrer"
        aria-label={`${DEVELOPER.name}, ${t.developer.role} — GitHub`}
      >
        <div
          className={styles.avatar}
          aria-hidden="true"
        >
          <img
            className={styles.photo}
            src={DEVELOPER.photo}
            alt=""
          />
        </div>
        <h2 className={styles.role}>{t.developer.role}</h2>
        <p className={styles.name}>{DEVELOPER.name}</p>
      </a>
      <p className={styles.about}>{t.developer.about}</p>
    </div>
  );
};
