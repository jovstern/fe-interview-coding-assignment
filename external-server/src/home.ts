export const homeResponse = {
  user: {
    id: 'u_001',
    name: 'Maya Chen',
    avatarUrl: 'https://picsum.photos/seed/maya-chen/96/96',
  },
  headline: 'Moments worth keeping',
  subheadline:
    'A daily edit of warm places, quiet light and faraway details.',
  filters: [
    { id: 'for-you', label: 'For you', active: true },
    { id: 'coast', label: 'Coast', active: false },
    { id: 'architecture', label: 'Architecture', active: false },
  ],
  items: [
    {
      id: 'p_001',
      title: 'Casa del Sol',
      author: { id: 'a_001', name: 'Elena Rossi' },
      image: {
        url: 'https://picsum.photos/seed/casa-del-sol/800/1040',
        width: 800,
        height: 1040,
      },
      tags: ['coast', 'architecture'],
    },
    {
      id: 'p_002',
      title: 'Amalfi Steps',
      author: { id: 'a_002', name: 'Lucia Moretti' },
      image: {
        url: 'https://picsum.photos/seed/amalfi-steps/800/640',
        width: 800,
        height: 640,
      },
      tags: ['architecture'],
    },
    {
      id: 'p_003',
      title: 'Soft Morning',
      author: { id: 'a_003', name: 'Noah Williams' },
      image: {
        url: 'https://picsum.photos/seed/soft-morning/800/600',
        width: 800,
        height: 600,
      },
      tags: [],
    },
    {
      id: 'p_004',
      title: 'Desert Study',
      author: { id: 'a_004', name: 'Amir Haddad' },
      image: {
        url: 'https://picsum.photos/seed/desert-study/800/840',
        width: 800,
        height: 840,
      },
      tags: ['architecture'],
    },
    {
      id: 'p_005',
      title: 'Still Harbour',
      author: { id: 'a_005', name: 'Sofia Lind' },
      image: {
        url: 'https://picsum.photos/seed/still-harbour/800/960',
        width: 800,
        height: 960,
      },
      tags: ['coast'],
    },
    {
      id: 'p_006',
      title: 'Market Bloom',
      author: { id: 'a_006', name: 'Camille Durand' },
      image: {
        url: 'https://picsum.photos/seed/market-bloom/800/1000',
        width: 800,
        height: 1000,
      },
      tags: [],
    },
    {
      id: 'p_007',
      title: 'Blue Hour, Kotor',
      author: { id: 'a_007', name: 'Luka Petrović' },
      image: {
        url: 'https://picsum.photos/seed/blue-hour-kotor/800/700',
        width: 800,
        height: 700,
      },
      tags: ['coast'],
    },
    {
      id: 'p_008',
      title: 'Terracotta Rooftops',
      author: { id: 'a_001', name: 'Elena Rossi' },
      image: {
        url: 'https://picsum.photos/seed/terracotta-rooftops/800/880',
        width: 800,
        height: 880,
      },
      tags: ['architecture'],
    },
  ],
  pagination: { total: 8, nextCursor: null },
};
