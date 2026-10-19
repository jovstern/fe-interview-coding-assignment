import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FollowButton } from './follow-button';

describe('FollowButton', () => {
  it('toggles following locally', async () => {
    render(
      <FollowButton isFollowing={false} authorName="Elena Rossi" />
    );
    const button = screen.getByRole('button', {
      name: 'Follow Elena Rossi',
    });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);

    expect(button).toHaveAccessibleName('Following Elena Rossi');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('starts from the server value', () => {
    render(<FollowButton isFollowing authorName="Elena Rossi" />);

    expect(screen.getByRole('button')).toHaveAccessibleName(
      'Following Elena Rossi'
    );
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});
