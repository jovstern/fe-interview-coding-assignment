import { getHome } from './lib/api';
import { ALL_FILTER_ID, filterItems, greetingFor } from './lib/utils';
import styles from './page.module.css';
import { EmptyFeed } from './ui/home/empty-feed';
import { FeedIntro } from './ui/home/feed-intro';
import { FilterChips } from './ui/home/filter-chips';
import { GreetingHeader } from './ui/home/greeting-header';
import { PhotoGrid } from './ui/home/photo-grid';

export default async function Home({ searchParams }: PageProps<'/'>) {
  const { filter: param } = await searchParams;
  const filter = (Array.isArray(param) ? param[0] : param) || undefined;
  const home = await getHome();
  const items = filterItems(home.items, filter);
  console.log('home', home);
  return (
    <div className={styles.page}>
      <GreetingHeader
        user={home.user}
        greeting={greetingFor(new Date())}
      />
      <main id="main">
        <FeedIntro
          headline={home.headline}
          subheadline={home.subheadline}
        />
        <FilterChips
          filters={home.filters}
          activeId={filter ?? ALL_FILTER_ID}
        />
        {items.length > 0 ? <PhotoGrid items={items} /> : <EmptyFeed />}
      </main>
    </div>
  );
}
