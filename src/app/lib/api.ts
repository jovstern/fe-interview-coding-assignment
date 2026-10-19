import type { HomeResponse, PhotoResponse } from './definitions';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

// The API serves static mock data, so an hour of caching is safe.
const CACHE = { next: { revalidate: 3600 } };

export async function getHome(): Promise<HomeResponse> {
  const url = `${API_URL}/api/home`;
  const res = await fetch(url, CACHE);
  if (!res.ok) {
    console.error(`GET ${url} failed with ${res.status}`);
    throw new Error('Could not load the feed');
  }
  return res.json();
}

export async function getPhoto(
  id: string
): Promise<PhotoResponse | null> {
  const url = `${API_URL}/api/photo/${encodeURIComponent(id)}`;
  const res = await fetch(url, CACHE);
  if (res.status === 404) return null;
  if (!res.ok) {
    console.error(`GET ${url} failed with ${res.status}`);
    throw new Error('Could not load this photo');
  }
  return res.json();
}
