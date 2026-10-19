import type { FeedItem } from '../../lib/definitions';
import { PhotoCard } from './photo-card';
import styles from './photo-grid.module.css';

const EAGER_COUNT = 2;

export function PhotoGrid({ items }: { items: FeedItem[] }) {
  return (
    <ul className={styles.grid}>
      {items.map((item, index) => (
        <li key={item.id} className={styles.cell}>
          <PhotoCard item={item} eager={index < EAGER_COUNT} />
        </li>
      ))}
    </ul>
  );
}
