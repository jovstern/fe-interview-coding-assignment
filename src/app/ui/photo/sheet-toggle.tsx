'use client';

import { useState, type ReactNode } from 'react';
import styles from './sheet-toggle.module.css';

// Owns only whether the sheet is collapsed; the sheet's content is server-rendered and
// passed in. Collapsed, the summary (eyebrow and title) stays visible and the rest is
// below the fold, so CSS hides it (phones only, so widening the window shows it again).
export function SheetToggle({
  className,
  summary,
  children,
}: {
  className: string;
  summary: ReactNode;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <article
      data-collapsed={collapsed}
      className={`${className} ${styles.sheet}`}
    >
      <button
        type="button"
        aria-expanded={!collapsed}
        aria-controls="photo-details"
        aria-label={
          collapsed ? 'Show photo details' : 'Show full photo'
        }
        className={styles.handle}
        onClick={() => setCollapsed((value) => !value)}
      >
        <span aria-hidden className={styles.bar} />
      </button>
      {summary}
      <div id="photo-details" className={styles.details}>
        {children}
      </div>
    </article>
  );
}
