'use client';

import { useState } from 'react';
import styles from './follow-button.module.css';

// Following is kept locally: the API has no write endpoint. Only the toggle is state;
// the shown value is derived from the server's, which is never copied.
export function FollowButton({
  isFollowing,
  authorName,
}: {
  isFollowing: boolean;
  authorName: string;
}) {
  const [toggled, setToggled] = useState(false);
  const following = isFollowing !== toggled;

  return (
    <button
      type="button"
      aria-pressed={following}
      className={styles.button}
      onClick={() => setToggled((value) => !value)}
    >
      {following ? 'Following' : 'Follow'}{' '}
      <span className="visually-hidden">{authorName}</span>
    </button>
  );
}
