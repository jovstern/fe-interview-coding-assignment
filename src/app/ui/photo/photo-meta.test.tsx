import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PhotoResponse } from '../../lib/definitions';
import { PhotoMeta } from './photo-meta';

// Vitest has no SVGR transform, so the SVG icons are stubbed.
vi.mock('../icons', () => {
  const Icon = () => <svg />;
  return {
    ApertureIcon: Icon,
    CalendarDaysIcon: Icon,
    CameraIcon: Icon,
    MapPinIcon: Icon,
  };
});

const details: PhotoResponse['details'] = {
  location: { city: 'Positano', country: 'Italy' },
  lensMm: 35,
  aperture: 2.8,
  capturedAt: '2026-06-14T09:30:00Z',
};

describe('PhotoMeta', () => {
  it('shows the location, lens, aperture and capture date', () => {
    render(<PhotoMeta details={details} />);

    expect(screen.getByText('Positano')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('35 mm')).toBeInTheDocument();
    expect(screen.getByText('ƒ / 2.8')).toBeInTheDocument();
    expect(screen.getByText("Jun '26")).toBeInTheDocument();
  });
});
