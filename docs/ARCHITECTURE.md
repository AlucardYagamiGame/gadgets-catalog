# Architecture

## Component structure

Components follow atomic design. Each level may import only from the levels below it.

- `atoms`: the smallest pieces such as `Button`, `Icon`, `Checkbox` and `Loader`
- `molecules`: small groups of atoms such as `ProductCard`, `Dropdown` and `Pagination`
- `organisms`: larger blocks such as `Header`, `CatalogFilters`, `CheckoutModal` and `AiChat`
- `templates`: page layouts, currently `MainLayout`
- `pages`: one component per route

Atoms and molecules receive data only through props. Organisms and pages read stores and call services. Every component lives in its own folder with `Name.tsx`, `Name.module.scss` and `index.ts`.

## Routing

The app uses `BrowserRouter`. All pages except the layout are loaded lazily. `MainLayout` renders the header, the footer, the AI assistant and an `Outlet` wrapped in an error boundary and a loading fallback.

Because the URLs have no `#`, the host must serve `index.html` for every path. `vercel.json` does this. A small Vite plugin in `vite.config.ts` also adds `modulepreload` links for the home, catalog and product pages, based on `location.pathname`, so those chunks start loading before the app boots.

## Data layer

`src/services` is the only place that talks to the network.

- `fetchClient` wraps `fetch` with a timeout and a typed `ApiError`
- `products` reads from Supabase first and falls back to the bundled JSON files when Supabase is not configured or fails
- `ai` and `novaPoshta` call the serverless functions described below
- `auth` and `supabaseClient` wrap Supabase Auth

The Supabase client is created lazily with a dynamic import, so visitors who never sign in do not download it.

## State

Zustand stores in `src/store`: cart, favourites, auth, profile, language, theme and the AI chat. Cart and favourites are saved in the browser and sync to the account after sign in. Per-user data in Supabase is protected by row level security, so a user can read and write only their own rows.

## Authentication

Sign up and sign in use email and password through Supabase Auth with the PKCE flow.

1. `signUp` sends a confirmation email whose link returns to the site with a `?code=` parameter.
2. On start, `initAuth` begins the session setup when a stored session or a `code` parameter is present.
3. The Supabase client exchanges the code for a session and removes it from the URL.

The code verifier is stored in the browser that started the sign up, so the email link must be opened in the same browser.

## Serverless functions

Both live in `api/` and run on Vercel. In `npm run dev` the Vite dev server runs the same files.

**`api/ai.ts`** is the proxy for the AI assistant. The OpenRouter key, model list, system prompt and tool definitions exist only here. It limits the number and length of messages, checks the origin, rate-limits by IP and returns only the fields the app needs. The assistant can call three tools: change the language, search for a product and compare products. Their results are executed by the app, not by the function.

**`api/nova-poshta.ts`** is the proxy for city and branch search. It accepts only `getCities` and `getWarehouses`, validates and trims every field, checks the origin and rate-limits requests. It adds `NOVA_POSHTA_API_KEY` on the server and never returns it.

The rate limiters live in the memory of one function instance, so they stop bursts but are not a global quota.

## Internationalization and themes

Texts are in `src/i18n/en.ts` and `src/i18n/ua.ts`, and the Ukrainian file is typed against the English one, so a missing key fails type checking. The `useTranslation` hook returns the current dictionary. The language and the theme are stored in `localStorage` and applied to `<html>` before the app renders to avoid a flash.

## Styling

SCSS Modules with shared tokens in `src/styles`: variables, media mixins (`tablet`, `desktop`, `wide`), typography mixins and light and dark themes through CSS custom properties.
