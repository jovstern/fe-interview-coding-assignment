import Image from 'next/image';
import Link from 'next/link';
import type { PhotoResponse } from '../../lib/definitions';
import { photoAlt } from '../../lib/utils';
import { ArrowLeftIcon } from '../icons';
import styles from './photo-hero.module.css';

export function PhotoHero({ photo }: { photo: PhotoResponse }) {
  return (
    <div className={styles.hero}>
      <Image
        src={photo.image.url}
        fill
        sizes="(min-width: 1024px) calc(100vw - 440px), 100vw"
        preload
        alt={photoAlt(photo)}
        className={styles.image}
      />
      <Link
        href="/"
        aria-label="Back to all photos"
        className={styles.back}
      >
        <ArrowLeftIcon aria-hidden width={20} height={20} />
      </Link>
      <p className={styles.counter}>
        <span aria-hidden className={styles.dot} />
        <span aria-hidden>
          {photo.position} / {photo.total}
        </span>
        <span className="visually-hidden">
          Photo {photo.position} of {photo.total}
        </span>
      </p>
    </div>
  );
}
