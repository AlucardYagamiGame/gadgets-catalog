import avatar from '@/assets/developer/avatar.webp';

export interface Developer {
  name: string;
  github: string;
  photo: string;
}

export const DEVELOPER: Developer = {
  name: 'Olga',
  github: 'https://github.com/AlucardYagamiGame',
  photo: avatar,
};
