'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ErrorState } from './ui/error-state';

export default function HomeError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="The feed didn’t load"
      message="Something went wrong on our side. Try again in a moment."
      action={
        <>
          <button type="button" onClick={retry}>
            Try again
          </button>
          <Link href="/">Back to all photos</Link>
        </>
      }
    />
  );
}
