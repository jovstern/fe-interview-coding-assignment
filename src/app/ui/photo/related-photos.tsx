import Image from 'next/image';
import Link from 'next/link';
import type { FeedItem, RelatedPhoto } from '../../lib/definitions';
import { photoAlt } from '../../lib/utils';
import styles from './related-photos.module.css';

export function RelatedPhotos({
  related,
  feed,
}: {
  related: RelatedPhoto[];
  feed: FeedItem[];
}) {
  // Related photos only carry an id and a thumbnail; the feed names them.
  const feedById = new Map(feed.map((item) => [item.id, item]));

  return (
    <nav aria-label="Related photos">
      <ul className={styles.row}>
        {related.map((photo) => {
          const item = feedById.get(photo.id);
          return (
            <li key={photo.id}>
              <Link
                href={`/photos/${photo.id}`}
                className={styles.thumb}
              >
                <Image
                  src={photo.thumbnailUrl}
                  width={78}
                  height={78}
                  sizes="78px"
                  alt={item ? photoAlt(item) : 'Related photo'}
                  className={styles.image}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
