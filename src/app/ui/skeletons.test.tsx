import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomeSkeleton } from './skeletons';

describe('HomeSkeleton', () => {
  it('marks the feed busy and announces loading to screen readers', () => {
    const { container } = render(<HomeSkeleton />);

    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
  });
});
