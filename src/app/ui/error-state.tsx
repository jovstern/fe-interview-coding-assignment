import type { ReactNode } from 'react';
import styles from './error-state.module.css';

export function ErrorState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action: ReactNode;
}) {
  return (
    <main id="main" className={styles.page}>
      <h1 className={styles.title}>
        {title}
        <span aria-hidden className={styles.stop}>
          .
        </span>
      </h1>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>{action}</div>
    </main>
  );
}
