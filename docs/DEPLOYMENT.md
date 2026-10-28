# Deployment

The app is deployed to Vercel. The same files run locally with `npm run dev`.

## Environment variables

| Variable                        | Where it is used                  | Notes                                      |
| ------------------------------- | --------------------------------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`             | browser                           | Supabase project URL                       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser                           | public by design, data is protected by RLS |
| `OPENROUTER_API_KEY`            | `api/ai.ts`, server only          | never use a `VITE_` prefix                 |
| `NOVA_POSHTA_API_KEY`           | `api/nova-poshta.ts`, server only | never use a `VITE_` prefix                 |

Variables with a `VITE_` prefix are embedded in the public bundle at build time. After changing any variable in Vercel, redeploy.

Without the Supabase variables the app uses the bundled JSON data. Without the two server keys the AI assistant and the Nova Poshta search do not work.

The database schema is intentionally not published in this repository.

## Vercel settings

1. Import the repository and choose the **Vite** preset.
2. Install command: `npm install`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add the environment variables above.

`vercel.json` rewrites every path except `/api/...` to `index.html`, so URLs such as `/phones` work after a page reload. The functions in `api/` are detected automatically.

## Supabase settings

In Authentication, URL Configuration:

- Site URL: the production domain
- Redirect URLs: the production domain, the production domain followed by `/**`, `http://localhost:5173` and `http://localhost:5173/**`

## After the first deploy

- Open `/phones` and a product page, then reload: the page must load, not return 404
- Sign up with a new email and open the confirmation link in the same browser: you should be signed in
- Ask the AI assistant to find a product
- Search for a city in the checkout form

## Troubleshooting

- `vite: command not found`: the install step did not run. Set the install command to `npm install`
- Variables seem ignored: redeploy after changing them
- 404 after reload: check that `vercel.json` is in the repository root
- Confirmation link does not sign you in: open it in the browser where you signed up, and check the Redirect URLs
