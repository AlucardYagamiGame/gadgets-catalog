# Development

## Scripts

| Command                | What it does                                   |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | dev server with the `api/` functions           |
| `npm run build`        | type check and production build                |
| `npm run preview`      | preview the production build                   |
| `npm run typecheck`    | type check only                                |
| `npm run lint`         | ESLint                                         |
| `npm run format:check` | Prettier check                                 |
| `npm run check`        | types, ESLint, Prettier and build all together |
| `npm run fix-style`    | auto-fix ESLint and Prettier issues            |

Run `npm run check` before every push.

## Conventions

- Components are `.tsx` files in their own folder: `Name.tsx`, `Name.module.scss`, `index.ts`
- Imports use the `@/` alias for `src`
- Types live in `src/types`, constants in `src/constants`
- Colors come only from the variables in `_variables.scss`, never hex values in modules
- Media queries use only the `tablet`, `desktop` and `wide` mixins
- Typography uses the mixins from `_typography.scss`
- Hover effects use CSS `transition`. Animations with `motion` live in `src/animations`
- No `!important`, and the code has no comments: names and structure carry the meaning

## Automation

- Pre-commit: Husky runs lint-staged, which applies ESLint and Prettier to changed files
- Pull requests: the Lint workflow runs type check, ESLint, Prettier check and the build
- Deploys: Vercel builds every push and creates a preview for every pull request
