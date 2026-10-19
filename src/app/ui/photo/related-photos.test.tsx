import { render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { FeedItem } from '../../lib/definitions';
import { RelatedPhotos } from './related-photos';

const item = (id: string, title: string, author: string): FeedItem => ({
  id,
  title,
  author: { id: `a_${id}`, name: author },
  image: {
    url: `https://picsum.photos/seed/${id}/800/1000`,
    width: 800,
    height: 1000,
  },
  tags: [],
});

const feed = [
  item('p_001', 'Casa del Sol', 'Elena Rossi'),
  item('p_002', 'Amalfi Steps', 'Lucia Moretti'),
  item('p_008', 'Terracotta Rooftops', 'Elena Rossi'),
];

// The API lists every photo but the current one.
const related = [
  {
    id: 'p_001',
    thumbnailUrl: 'https://picsum.photos/seed/p_001/240/240',
  },
  {
    id: 'p_002',
    thumbnailUrl: 'https://picsum.photos/seed/p_002/240/240',
  },
];

describe('RelatedPhotos', () => {
  beforeAll(() => {
    // jsdom has no layout, so it has no scrollIntoView.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('keeps the current photo in the row, in feed order, named after the feed', () => {
    render(
      <RelatedPhotos currentId="p_008" related={related} feed={feed} />
    );

    const links = within(
      screen.getByRole('navigation', { name: 'Related photos' })
    ).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/photos/p_001',
      '/photos/p_002',
      '/photos/p_008',
    ]);
    expect(links[2]).toHaveAccessibleName(
      'Terracotta Rooftops by Elena Rossi'
    );
  });

  it('marks only the current photo', () => {
    render(
      <RelatedPhotos currentId="p_002" related={related} feed={feed} />
    );

    expect(
      screen.getByRole('link', {
        name: 'Amalfi Steps by Lucia Moretti',
      })
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: 'Casa del Sol by Elena Rossi' })
    ).not.toHaveAttribute('aria-current');
  });

  it('brings the current photo into view', () => {
    render(
      <RelatedPhotos currentId="p_002" related={related} feed={feed} />
    );

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      inline: 'center',
      block: 'nearest',
    });
  });
});
