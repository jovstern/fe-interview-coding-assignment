import Image from 'next/image';
import Link from 'next/link';
import type { FeedItem } from '../../lib/definitions';
import { photoAlt } from '../../lib/utils';
import styles from './photo-card.module.css';

export function PhotoCard({
  item,
  eager,
}: {
  item: FeedItem;
  eager: boolean;
}) {
  const titleId = `photo-${item.id}-title`;
  const authorId = `photo-${item.id}-author`;

  return (
    <Link
      href={`/photos/${item.id}`}
      className={styles.card}
      aria-labelledby={titleId}
      aria-describedby={authorId}
    >
      <div className={styles.frame}>
        <Image
          src={item.image.url}
          width={item.image.width}
          height={item.image.height}
          sizes="(min-width: 1264px) 285px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          alt={photoAlt(item)}
          loading={eager ? 'eager' : 'lazy'}
          className={styles.image}
        />
      </div>
      <div className={styles.caption}>
        <h2 id={titleId} className={styles.title}>
          {item.title}
        </h2>
        <p id={authorId} className={styles.author}>
          by {item.author.name}
        </p>
      </div>
    </Link>
  );
}
