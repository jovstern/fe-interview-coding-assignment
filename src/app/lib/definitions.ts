export type ApiImage = { url: string; width: number; height: number };

export type HomeResponse = {
  user: { id: string; name: string; avatarUrl: string };
  headline: string;
  subheadline: string;
  filters: { id: string; label: string; active: boolean }[];
  items: {
    id: string;
    title: string;
    author: { id: string; name: string };
    image: ApiImage;
    tags: string[];
  }[];
  pagination: { total: number; nextCursor: string | null };
};

export type FeedItem = HomeResponse['items'][number];

export type Filter = HomeResponse['filters'][number];

export type PhotoResponse = {
  id: string;
  position: number;
  total: number;
  title: string;
  category: string;
  badges: string[];
  image: ApiImage;
  description: string;
  author: {
    id: string;
    name: string;
    role: string;
    city: string;
    avatarUrl: string;
    isFollowing: boolean;
  };
  details: {
    location: { city: string; country: string };
    lensMm: number;
    aperture: number;
    capturedAt: string;
  };
  tags: string[];
  related: { id: string; thumbnailUrl: string }[];
};

export type RelatedPhoto = PhotoResponse['related'][number];
