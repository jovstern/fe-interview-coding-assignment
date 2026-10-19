import Link from 'next/link';
import type { Filter } from '../../lib/definitions';
import { ALL_FILTER_ID } from '../../lib/utils';
import styles from './filter-chips.module.css';

// The URL decides the active chip; the API's `active` flags are ignored.
export function FilterChips({
  filters,
  activeId,
}: {
  filters: Filter[];
  activeId: string;
}) {
  return (
    <nav aria-label="Collections">
      <ul className={styles.chips}>
        {filters.map((filter) => (
          <li key={filter.id}>
            <Link
              href={
                filter.id === ALL_FILTER_ID
                  ? '/'
                  : `/?filter=${filter.id}`
              }
              scroll={false}
              aria-current={filter.id === activeId ? 'page' : undefined}
              className={styles.chip}
            >
              {filter.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
