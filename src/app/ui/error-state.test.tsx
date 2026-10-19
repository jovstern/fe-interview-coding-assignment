import { render, screen } from '@testing-library/react';
import Link from 'next/link';
import { describe, expect, it } from 'vitest';
import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('shows the title as the page heading with its message and action', () => {
    render(
      <ErrorState
        title="Photo not found"
        message="This photo may have been removed."
        action={<Link href="/">Back to all photos</Link>}
      />
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Photo not found',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('This photo may have been removed.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to all photos' })
    ).toHaveAttribute('href', '/');
  });
});
