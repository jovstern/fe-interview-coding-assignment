import Image from 'next/image';
import type { FeedItem, RelatedPhoto } from '../../lib/definitions';
import { photoAlt } from '../../lib/utils';
import styles from './related-photos.module.css';
import { ThumbLink } from './thumb-link';

export function RelatedPhotos({
  currentId,
  related,
  feed,
}: {
  currentId: string;
  related: RelatedPhoto[];
  feed: FeedItem[];
}) {
  // The API lists the other photos only, so the row would lose the one on show and
  // reorder on every click. The feed gives a stable order and the current photo's image.
  const thumbnailById = new Map(
    related.map((photo) => [photo.id, photo.thumbnailUrl])
  );
  const photos = feed.filter(
    (item) => item.id === currentId || thumbnailById.has(item.id)
  );

  return (
    <nav aria-label="Related photos" className={styles.related}>
      <ul className={styles.row}>
        {photos.map((item) => {
          const current = item.id === currentId;
          return (
            <li key={item.id}>
              <ThumbLink href={`/photos/${item.id}`} current={current}>
                <Image
                  src={thumbnailById.get(item.id) ?? item.image.url}
                  width={78}
                  height={78}
                  sizes="78px"
                  alt={photoAlt(item)}
                  className={styles.image}
                />
              </ThumbLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
