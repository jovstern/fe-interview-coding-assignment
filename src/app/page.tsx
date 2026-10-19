import { connection } from 'next/server';
import { getHome } from './lib/api';
import { greetingFor } from './lib/utils';
import styles from './page.module.css';
import { FeedIntro } from './ui/home/feed-intro';
import { GreetingHeader } from './ui/home/greeting-header';
import { PhotoGrid } from './ui/home/photo-grid';

export default async function Home() {
  // The greeting depends on the request time, so render per request.
  await connection();
  const home = await getHome();

  return (
    <div className={styles.page}>
      <GreetingHeader
        user={home.user}
        greeting={greetingFor(new Date())}
      />
      <main>
        <FeedIntro
          headline={home.headline}
          subheadline={home.subheadline}
        />
        <PhotoGrid items={home.items} />
      </main>
    </div>
  );
}
