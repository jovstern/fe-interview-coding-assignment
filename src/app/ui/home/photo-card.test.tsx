import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FeedItem } from '../../lib/definitions';
import { PhotoCard } from './photo-card';

const item: FeedItem = {
  id: 'p_001',
  title: 'Casa del Sol',
  author: { id: 'a_001', name: 'Elena Rossi' },
  image: {
    url: 'https://picsum.photos/seed/casa-del-sol/800/1040',
    width: 800,
    height: 1040,
  },
  tags: ['coast'],
};

describe('PhotoCard', () => {
  it('links to the photo details with its image and author', () => {
    render(<PhotoCard item={item} eager={false} />);

    expect(
      screen.getByRole('link', { name: /Casa del Sol/ })
    ).toHaveAttribute('href', '/photos/p_001');
    expect(
      screen.getByRole('img', { name: 'Casa del Sol by Elena Rossi' })
    ).toBeInTheDocument();
    expect(screen.getByText('by Elena Rossi')).toBeInTheDocument();
  });
});
