import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Filter } from '../../lib/definitions';
import { FilterChips } from './filter-chips';

const filters: Filter[] = [
  { id: 'for-you', label: 'For you', active: true },
  { id: 'coast', label: 'Coast', active: false },
  { id: 'architecture', label: 'Architecture', active: false },
];

describe('FilterChips', () => {
  it('links each collection and marks the one in the URL', () => {
    render(<FilterChips filters={filters} activeId="coast" />);

    const coast = screen.getByRole('link', { name: 'Coast' });
    expect(coast).toHaveAttribute('href', '/?filter=coast');
    expect(coast).toHaveAttribute('aria-current', 'page');
    const forYou = screen.getByRole('link', { name: 'For you' });
    expect(forYou).toHaveAttribute('href', '/');
    expect(forYou).not.toHaveAttribute('aria-current');
  });
});
