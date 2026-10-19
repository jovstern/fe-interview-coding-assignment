import type { PhotoResponse } from '../../lib/definitions';
import {
  formatAperture,
  formatCapturedAt,
  formatLens,
} from '../../lib/utils';
import {
  ApertureIcon,
  CalendarDaysIcon,
  CameraIcon,
  MapPinIcon,
  type Icon,
} from '../icons';
import styles from './photo-meta.module.css';

type MetaItem = {
  Icon: Icon;
  term: string;
  value: string;
  // Shown in the label's place; the term then stays for screen readers.
  detail?: string;
};

export function PhotoMeta({
  details,
}: {
  details: PhotoResponse['details'];
}) {
  const items: MetaItem[] = [
    {
      Icon: MapPinIcon,
      term: 'Location',
      value: details.location.city,
      detail: details.location.country,
    },
    {
      Icon: CameraIcon,
      term: 'Lens',
      value: formatLens(details.lensMm),
    },
    {
      Icon: ApertureIcon,
      term: 'Aperture',
      value: formatAperture(details.aperture),
    },
    {
      Icon: CalendarDaysIcon,
      term: 'Captured',
      value: formatCapturedAt(details.capturedAt),
    },
  ];

  return (
    <dl className={styles.meta}>
      {items.map(({ Icon, term, value, detail }) => (
        <div key={term} className={styles.item}>
          <span className={styles.icon}>
            <Icon aria-hidden />
          </span>
          <dt className={detail ? 'visually-hidden' : styles.label}>
            {term}
          </dt>
          <dd className={styles.value}>{value}</dd>
          {detail && <dd className={styles.label}>{detail}</dd>}
        </div>
      ))}
    </dl>
  );
}
