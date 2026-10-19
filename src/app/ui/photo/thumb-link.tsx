'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './related-photos.module.css';

// The thumbnails row scrolls sideways, so the photo on show brings itself into view.
export function ThumbLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={styles.thumb}
      aria-current={current ? 'page' : undefined}
      ref={
        current
          ? (link) =>
              link?.scrollIntoView({
                inline: 'center',
                block: 'nearest',
              })
          : undefined
      }
    >
      {children}
    </Link>
  );
}
