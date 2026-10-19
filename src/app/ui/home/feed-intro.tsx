import styles from './feed-intro.module.css';

export function FeedIntro({
  headline,
  subheadline,
}: {
  headline: string;
  subheadline: string;
}) {
  return (
    <div className={styles.intro}>
      <h1 className={styles.headline}>
        {headline}
        <span aria-hidden className={styles.stop}>
          .
        </span>
      </h1>
      <p className={styles.subheadline}>{subheadline}</p>
    </div>
  );
}
