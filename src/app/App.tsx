import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AnimationProvider } from '@/animations';
import { MainLayout } from '@/components/templates/MainLayout';
import { ROUTES } from '@/constants';

const CartPage = lazy(() =>
  import('@/pages/CartPage').then((module) => ({ default: module.CartPage })),
);
const CatalogPage = lazy(() =>
  import('@/pages/CatalogPage').then((module) => ({
    default: module.CatalogPage,
  })),
);
const FavoritesPage = lazy(() =>
  import('@/pages/FavoritesPage').then((module) => ({
    default: module.FavoritesPage,
  })),
);
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
);
const ProductDetailsPage = lazy(() =>
  import('@/pages/ProductDetailsPage').then((module) => ({
    default: module.ProductDetailsPage,
  })),
);
const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((module) => ({
    default: module.SearchPage,
  })),
);
const RightsPage = lazy(() =>
  import('@/pages/RightsPage').then((module) => ({
    default: module.RightsPage,
  })),
);
const DeveloperPage = lazy(() =>
  import('@/pages/DeveloperPage').then((module) => ({
    default: module.DeveloperPage,
  })),
);
const UiKitPage = lazy(() =>
  import('@/pages/UiKitPage').then((module) => ({ default: module.UiKitPage })),
);

export const App = () => (
  <AnimationProvider>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            index
            element={<HomePage />}
          />
          <Route
            path={ROUTES.PHONES}
            element={<CatalogPage category="phones" />}
          />
          <Route
            path={ROUTES.TABLETS}
            element={<CatalogPage category="tablets" />}
          />
          <Route
            path={ROUTES.ACCESSORIES}
            element={<CatalogPage category="accessories" />}
          />
          <Route
            path={ROUTES.PRODUCT}
            element={<ProductDetailsPage />}
          />
          <Route
            path={ROUTES.SEARCH}
            element={<SearchPage />}
          />
          <Route
            path={ROUTES.CART}
            element={<CartPage />}
          />
          <Route
            path={ROUTES.FAVORITES}
            element={<FavoritesPage />}
          />
          <Route
            path={ROUTES.DEVELOPER}
            element={<DeveloperPage />}
          />
          <Route
            path={ROUTES.RIGHTS}
            element={<RightsPage />}
          />
          {import.meta.env.DEV && (
            <Route
              path={ROUTES.UI_KIT}
              element={<UiKitPage />}
            />
          )}
          <Route
            path={ROUTES.NOT_FOUND}
            element={<NotFoundPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </AnimationProvider>
);
