import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SheetToggle } from './sheet-toggle';

describe('SheetToggle', () => {
  it('collapses and expands the sheet', async () => {
    const user = userEvent.setup();
    render(
      <SheetToggle className="sheet" summary={<h1>Still Harbour</h1>}>
        <p>Details</p>
      </SheetToggle>
    );
    const handle = screen.getByRole('button', {
      name: 'Show full photo',
    });
    const sheet = screen.getByRole('article');
    const details = screen.getByText('Details').parentElement;
    expect(handle).toHaveAttribute('aria-controls', 'photo-details');
    expect(details).toHaveAttribute('id', 'photo-details');
    expect(handle).toHaveAttribute('aria-expanded', 'true');
    expect(sheet).toHaveAttribute('data-collapsed', 'false');

    await user.click(handle);

    expect(handle).toHaveAttribute('aria-expanded', 'false');
    expect(handle).toHaveAccessibleName('Show photo details');
    expect(sheet).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByText('Still Harbour')).toBeVisible();

    handle.focus();
    await user.keyboard('{Enter}');

    expect(handle).toHaveAttribute('aria-expanded', 'true');
    expect(sheet).toHaveAttribute('data-collapsed', 'false');
  });
});
