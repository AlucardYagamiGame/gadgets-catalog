import { Link } from 'react-router-dom';

import scrollToTopIcon from '@/assets/icons/chevron-up.svg';
import { Icon } from '@/components/atoms/Icon';
import { Logo } from '@/components/atoms/Logo';
import { DEVELOPER, ROUTES } from '@/constants';
import { useTranslation } from '@/hooks';

import styles from './Footer.module.scss';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.root}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Logo />
        </div>

        <nav
          className={styles.links}
          aria-label={t.footer.nav}
        >
          <a
            href={DEVELOPER.project}
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          <Link to={ROUTES.DEVELOPER}>{t.footer.contacts}</Link>
          <Link to={ROUTES.RIGHTS}>{t.footer.rights}</Link>
        </nav>

        <div className={styles.action}>
          <button
            type="button"
            className={styles.backToTop}
            onClick={scrollToTop}
          >
            {t.footer.backToTop}
            <span
              className={styles.arrow}
              aria-hidden="true"
            >
              <Icon
                src={scrollToTopIcon}
                alt=""
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};
