import { Reveal } from '@/animations';
import { DEVELOPER, DEVELOPER_STACK } from '@/constants';
import { useTranslation } from '@/hooks';

import styles from './DeveloperPage.module.scss';

export const DeveloperPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Reveal>
        <section className={styles.hero}>
          <div className={styles.avatar}>
            <img
              className={styles.photo}
              src={DEVELOPER.photo}
              alt={DEVELOPER.name}
            />
          </div>
          <div className={styles.info}>
            <p className={styles.role}>{t.developer.role}</p>
            <h2 className={styles.name}>{DEVELOPER.name}</h2>
            <p className={styles.about}>{t.developer.about}</p>
            <div className={styles.actions}>
              <a
                className={styles.link}
                href={DEVELOPER.github}
                target="_blank"
                rel="noreferrer"
              >
                {t.developer.github}
              </a>
              <a
                className={`${styles.link} ${styles.linkedin}`}
                href={DEVELOPER.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {t.developer.linkedin}
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      <section className={styles.section}>
        <Reveal>
          <h2 className={styles.heading}>{t.developer.highlightsTitle}</h2>
        </Reveal>
        <ul className={styles.highlights}>
          {t.developer.highlights.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={(index + 1) * 0.08}>
                <article className={styles.highlight}>
                  <h3 className={styles.highlightTitle}>{item.title}</h3>
                  <p className={styles.highlightText}>{item.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <Reveal>
          <h2 className={styles.heading}>{t.developer.stackTitle}</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className={styles.stack}>
            {DEVELOPER_STACK.map((item) => (
              <li
                key={item}
                className={styles.chip}
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </div>
  );
};
