import { afterEach, describe, expect, it, vi } from 'vitest';
import { getHome, getPhoto } from './api';

function stubFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('getHome', () => {
  it('returns the parsed feed from the cached home endpoint', async () => {
    const body = { headline: 'Discover moments', items: [] };
    const fetchMock = stubFetch(200, body);

    await expect(getHome()).resolves.toEqual(body);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/home',
      {
        next: { revalidate: 3600 },
      }
    );
  });

  it('throws a short message when the API fails', async () => {
    stubFetch(500, { message: 'boom' });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getHome()).rejects.toThrow('Could not load the feed');
  });
});

describe('getPhoto', () => {
  it('returns the photo', async () => {
    const body = { id: 'p_001', title: 'Casa del Sol' };
    const fetchMock = stubFetch(200, body);

    await expect(getPhoto('p_001')).resolves.toEqual(body);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/photo/p_001',
      { next: { revalidate: 3600 } }
    );
  });

  it('returns null for an unknown id', async () => {
    stubFetch(404, { message: 'Photo not found' });

    await expect(getPhoto('nope')).resolves.toBeNull();
  });

  it('throws a short message when the API fails', async () => {
    stubFetch(500, { message: 'boom' });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getPhoto('p_001')).rejects.toThrow(
      'Could not load this photo'
    );
  });
});
