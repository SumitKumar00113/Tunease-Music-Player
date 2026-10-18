export interface GenreCategory {
  id: string;
  name: string;
  color: string;
  coverUrl: string;
}

export const GENRE_CATEGORIES: GenreCategory[] = [
  {
    id: 'g-1',
    name: 'Synthwave & Cyber',
    color: 'from-cyan-600 to-teal-500',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'g-2',
    name: 'Lo-Fi Chill',
    color: 'from-teal-800 to-cyan-600',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'g-3',
    name: 'Pop & Electronic',
    color: 'from-cyan-500 to-sky-400',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'g-4',
    name: 'Dark R&B & Soul',
    color: 'from-teal-800 to-cyan-950',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'g-5',
    name: 'Festival Bass',
    color: 'from-cyan-700 to-cyan-500',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'g-6',
    name: 'Indie Acoustic',
    color: 'from-teal-700 to-cyan-400',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
  },
];
