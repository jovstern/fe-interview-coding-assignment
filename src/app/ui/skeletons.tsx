import styles from './skeletons.module.css';

// The feed's own photo shapes, ordered so both columns start as the real feed does.
const CARD_RATIOS = [
  '800 / 1040',
  '800 / 640',
  '800 / 600',
  '800 / 960',
  '800 / 1000',
  '800 / 700',
];

function LoadingLabel() {
  return (
    <p role="status" className="visually-hidden">
      Loading…
    </p>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" className={styles.home}>
      <LoadingLabel />
      <div aria-hidden className={styles.header}>
        <span className={`${styles.bone} ${styles.avatar}`} />
        <div>
          <span
            className={`${styles.bone} ${styles.line} ${styles.greeting}`}
          />
          <span
            className={`${styles.bone} ${styles.line} ${styles.name}`}
          />
        </div>
      </div>
      <div aria-hidden className={styles.intro}>
        <span
          className={`${styles.bone} ${styles.line} ${styles.headline}`}
        />
        <span
          className={`${styles.bone} ${styles.line} ${styles.subheadline}`}
        />
        <span
          className={`${styles.bone} ${styles.line} ${styles.subheadline}`}
        />
      </div>
      <ul aria-hidden className={styles.grid}>
        {CARD_RATIOS.map((aspectRatio) => (
          <li key={aspectRatio} className={styles.cell}>
            <div className={styles.card}>
              <span className={styles.bone} style={{ aspectRatio }} />
              <div className={styles.caption}>
                <span
                  className={`${styles.bone} ${styles.line} ${styles.title}`}
                />
                <span
                  className={`${styles.bone} ${styles.line} ${styles.author}`}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PhotoSkeleton() {
  return (
    <div aria-busy="true" className={styles.photo}>
      <LoadingLabel />
      <span aria-hidden className={`${styles.bone} ${styles.hero}`} />
      <div aria-hidden className={styles.sheet}>
        <span className={styles.handle} />
        <span
          className={`${styles.bone} ${styles.line} ${styles.eyebrow}`}
        />
        <span
          className={`${styles.bone} ${styles.line} ${styles.photoTitle}`}
        />
        <div className={styles.body}>
          <div className={styles.header}>
            <span className={`${styles.bone} ${styles.authorAvatar}`} />
            <div>
              <span
                className={`${styles.bone} ${styles.line} ${styles.authorName}`}
              />
              <span
                className={`${styles.bone} ${styles.line} ${styles.role}`}
              />
            </div>
          </div>
          <div>
            <span
              className={`${styles.bone} ${styles.line} ${styles.description}`}
            />
            <span
              className={`${styles.bone} ${styles.line} ${styles.description}`}
            />
            <span
              className={`${styles.bone} ${styles.line} ${styles.description}`}
            />
          </div>
          <hr className={styles.divider} />
          <div className={styles.meta}>
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={`${styles.bone} ${styles.icon}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
