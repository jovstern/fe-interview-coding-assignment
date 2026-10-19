import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FeedItem } from '../../lib/definitions';
import { RelatedPhotos } from './related-photos';

const feed: FeedItem[] = [
  {
    id: 'p_008',
    title: 'Terracotta Rooftops',
    author: { id: 'a_001', name: 'Elena Rossi' },
    image: {
      url: 'https://picsum.photos/seed/terracotta-rooftops/800/1000',
      width: 800,
      height: 1000,
    },
    tags: ['architecture'],
  },
];

describe('RelatedPhotos', () => {
  it('links each thumbnail to its photo, named after the feed item', () => {
    render(
      <RelatedPhotos
        related={[
          {
            id: 'p_008',
            thumbnailUrl:
              'https://picsum.photos/seed/terracotta-rooftops/240/240',
          },
        ]}
        feed={feed}
      />
    );

    expect(
      screen.getByRole('link', {
        name: 'Terracotta Rooftops by Elena Rossi',
      })
    ).toHaveAttribute('href', '/photos/p_008');
  });

  it('falls back to a generic alt for a photo missing from the feed', () => {
    render(
      <RelatedPhotos
        related={[
          {
            id: 'p_999',
            thumbnailUrl: 'https://picsum.photos/seed/unknown/240/240',
          },
        ]}
        feed={feed}
      />
    );

    expect(
      screen.getByRole('img', { name: 'Related photo' })
    ).toBeInTheDocument();
  });
});
