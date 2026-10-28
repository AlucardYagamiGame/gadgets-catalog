import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { ROUTES } from '@/constants';
import { getProducts } from '@/services';
import { initAuth } from '@/store';
import '@/styles/global.scss';

const PREFETCH_PATHS: string[] = [
  ROUTES.HOME,
  ROUTES.PHONES,
  ROUTES.TABLETS,
  ROUTES.ACCESSORIES,
];

if (PREFETCH_PATHS.includes(window.location.pathname)) {
  getProducts().catch(() => undefined);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

initAuth();
