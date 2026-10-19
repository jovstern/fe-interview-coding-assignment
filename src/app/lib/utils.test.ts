import { describe, expect, it } from 'vitest';
import {
  formatAperture,
  formatCapturedAt,
  formatLens,
  greetingFor,
  photoAlt,
} from './utils';

function at(hours: number, minutes = 0) {
  return new Date(2026, 5, 1, hours, minutes);
}

describe('greetingFor', () => {
  it.each([
    [at(4, 59), 'Good evening'],
    [at(5), 'Good morning'],
    [at(11, 59), 'Good morning'],
    [at(12), 'Good afternoon'],
    [at(17, 59), 'Good afternoon'],
    [at(18), 'Good evening'],
  ])('greets %s with %s', (date, greeting) => {
    expect(greetingFor(date)).toBe(greeting);
  });
});

describe('formatters', () => {
  it('formats the lens focal length', () => {
    expect(formatLens(35)).toBe('35 mm');
  });

  it('formats the aperture', () => {
    expect(formatAperture(2.8)).toBe('ƒ / 2.8');
    expect(formatAperture(8)).toBe('ƒ / 8');
  });

  it('formats the capture date as a short month and two-digit year in UTC', () => {
    expect(formatCapturedAt('2026-06-14T08:30:00Z')).toBe("Jun '26");
    expect(formatCapturedAt('2026-07-01T00:30:00Z')).toBe("Jul '26");
  });
});

describe('photoAlt', () => {
  it('names the photo and its author', () => {
    expect(
      photoAlt({
        title: 'Casa del Sol',
        author: { name: 'Elena Rossi' },
      })
    ).toBe('Casa del Sol by Elena Rossi');
  });
});
