import photo from '@/assets/developer/developer.webp';

export interface Developer {
  name: string;
  github: string;
  linkedin: string;
  project: string;
  teamProject: string;
  photo: string;
}

export const DEVELOPER: Developer = {
  name: 'Olga',
  github: 'https://github.com/AlucardYagamiGame',
  linkedin: 'https://www.linkedin.com/in/olga-shcherbatiuk',
  project: 'https://github.com/AlucardYagamiGame/gadgets-catalog',
  teamProject: 'https://github.com/fe-jul26-cherry/product_catalog',
  photo,
};

export const DEVELOPER_STACK: readonly string[] = [
  'React 18',
  'TypeScript',
  'Vite',
  'React Router',
  'Zustand',
  'SCSS Modules',
  'Swiper',
  'motion',
  'Supabase',
  'Vercel',
  'ESLint',
  'Prettier',
  'GitHub Actions',
];
