import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import HomeError from './error';

describe('HomeError', () => {
  it('retries the segment on "Try again" and links home', async () => {
    const error = new Error('API unavailable');
    const logError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const retry = vi.fn();
    render(<HomeError error={error} retry={retry} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Try again' })
    );

    expect(retry).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(error);
    expect(
      screen.getByRole('link', { name: 'Back to all photos' })
    ).toHaveAttribute('href', '/');
    logError.mockRestore();
  });
});
