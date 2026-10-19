import Link from 'next/link';
import styles from './not-found.module.css';

export default function PhotoNotFound() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Photo not found</h1>
      <p className={styles.message}>
        This photo may have been removed, or the link is mistyped.
      </p>
      <Link href="/" className={styles.link}>
        Back to all photos
      </Link>
    </main>
  );
}
