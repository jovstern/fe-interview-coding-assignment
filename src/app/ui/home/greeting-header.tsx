import Image from 'next/image';
import type { HomeResponse } from '../../lib/definitions';
import styles from './greeting-header.module.css';

export function GreetingHeader({
  user,
  greeting,
}: {
  user: HomeResponse['user'];
  greeting: string;
}) {
  return (
    <header className={styles.header}>
      <Image
        src={user.avatarUrl}
        width={36}
        height={36}
        alt=""
        className={styles.avatar}
      />
      <div>
        <p className={styles.greeting}>{greeting}</p>
        <p className={styles.name}>{user.name}</p>
      </div>
    </header>
  );
}
