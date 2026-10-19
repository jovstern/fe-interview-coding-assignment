import Link from 'next/link';
import styles from './empty-feed.module.css';

export function EmptyFeed() {
  return (
    <div className={styles.empty}>
      <h2 className={styles.title}>Nothing here yet</h2>
      <p className={styles.message}>
        No photos match this collection. Try another one.
      </p>
      <Link href="/" className={styles.link}>
        Show all photos
      </Link>
    </div>
  );
}
