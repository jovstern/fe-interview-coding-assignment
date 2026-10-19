import Image from 'next/image';
import type { ReactNode } from 'react';
import type { PhotoResponse } from '../../lib/definitions';
import { FollowButton } from './follow-button';
import { PhotoMeta } from './photo-meta';
import styles from './photo-sheet.module.css';

export function PhotoSheet({
  photo,
  children,
}: {
  photo: PhotoResponse;
  children?: ReactNode;
}) {
  const [badge] = photo.badges;
  const { author } = photo;

  return (
    <article id="photo-details" className={styles.sheet}>
      <div aria-hidden className={styles.handle} />
      <header>
        <p className={styles.eyebrow}>
          <span className={styles.category}>{photo.category}</span>
          {badge && <span className={styles.badge}>{badge}</span>}
        </p>
        <h1 className={styles.title}>{photo.title}</h1>
      </header>
      <div className={styles.body}>
        <div className={styles.author}>
          <Image
            src={author.avatarUrl}
            width={42}
            height={42}
            alt=""
            className={styles.avatar}
          />
          <div>
            <p className={styles.name}>{author.name}</p>
            <p className={styles.role}>
              {author.role} · {author.city}
            </p>
          </div>
          <FollowButton
            isFollowing={author.isFollowing}
            authorName={author.name}
          />
        </div>
        <p className={styles.description}>{photo.description}</p>
        <hr className={styles.divider} />
        <PhotoMeta details={photo.details} />
        <ul aria-label="Tags" className={styles.tags}>
          {photo.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
        {children}
      </div>
    </article>
  );
}
