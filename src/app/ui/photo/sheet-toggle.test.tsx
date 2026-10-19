import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SheetToggle } from './sheet-toggle';

describe('SheetToggle', () => {
  it('collapses the sheet and makes the hidden details inert', async () => {
    const user = userEvent.setup();
    render(
      <SheetToggle className="sheet" summary={<h1>Still Harbour</h1>}>
        <p>Details</p>
      </SheetToggle>
    );
    const handle = screen.getByRole('button', {
      name: 'Show full photo',
    });
    const details = screen.getByText('Details').parentElement;
    expect(handle).toHaveAttribute('aria-expanded', 'true');
    expect(details).not.toHaveAttribute('inert');

    await user.click(handle);

    expect(handle).toHaveAttribute('aria-expanded', 'false');
    expect(handle).toHaveAccessibleName('Show photo details');
    expect(details).toHaveAttribute('inert');
    expect(screen.getByText('Still Harbour')).toBeVisible();

    handle.focus();
    await user.keyboard('{Enter}');

    expect(handle).toHaveAttribute('aria-expanded', 'true');
    expect(details).not.toHaveAttribute('inert');
  });
});
