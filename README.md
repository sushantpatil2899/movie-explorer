# Movie Explorer

A small Next.js web app for searching movies (via TMDB), viewing details, and saving favorites with a personal rating and note.

## Live demo

<https://movie-explorer-yxad.vercel.app/>

## Features

- Search movies by title (debounced, hits TMDB through a server-side proxy)
- Dedicated, server-rendered details page at `/movie/[id]` with poster, tagline, genres, runtime, overview, TMDB rating, director, and top cast
- Favorites with a 1–5 star rating and optional note, persisted in LocalStorage
- Favorites page listing all saved movies with their rating and note preview
- Empty, loading (skeleton), and error states everywhere a fetch happens
- Dark, responsive UI built with Tailwind

## Setup

```bash
git clone <repo-url>
cd movie-explorer
npm install
cp .env.example .env.local
# Edit .env.local and add your TMDB v3 API key:
#   https://www.themoviedb.org/settings/api
npm run dev
```

Open <http://localhost:3000>.

## Project layout

```
app/
  page.tsx                     Search page
  movie/[id]/page.tsx          Server-rendered details page
  favorites/page.tsx           Favorites list
  not-found.tsx                Custom 404
  api/
    search/route.ts            GET /api/search?q=…
    movie/[id]/route.ts        GET /api/movie/:id
  components/                  Nav, SearchBar, MovieCard, FavoriteButton,
                               RatingInput, EmptyState, ErrorState, LoadingSkeleton
  lib/
    types.ts                   Movie, Favorite, response shapes
    tmdb.ts                    Server-only TMDB fetch helpers
    favorites.ts               useFavorites hook + LocalStorage
```

## Technical decisions & tradeoffs

- **API proxy via Next.js route handlers.** The TMDB key lives only on the server (in `app/api/search/route.ts` and `app/api/movie/[id]/route.ts`); the browser never sees it. Both routes also send a short edge-cache header (`s-maxage=60, stale-while-revalidate=300`) so repeated identical queries during a demo don't burn through TMDB quota.
- **State management = a single React hook.** `useFavorites` in `app/lib/favorites.ts` owns every read and write to LocalStorage. The hook's interface is the seam: swapping LocalStorage for a database later means re-implementing one file. No Redux/Zustand was warranted for a single piece of UI state.
- **Persistence = LocalStorage.** Matches the brief's baseline and the time budget. Favorites survive refresh and sync across tabs via the browser's `storage` event plus a custom event for same-tab updates. Server-side persistence is the natural next step.
- **Details page is a server component** at `/movie/[id]`. It calls `tmdb.ts` directly — skipping its own `/api/movie/:id` route — so the page is fully SSR'd, SEO-friendly, deep-linkable, and avoids an unnecessary HTTP hop. The proxy route still exists for client-side use.
- **Tailwind v4 + dark theme.** Fastest path to a clean, responsive UI inside the time budget. No `tailwind.config.ts` needed — v4 is CSS-first.
- **Plain `<img>` instead of `next/image`.** Avoids whitelisting the TMDB image host and keeps `next.config.ts` empty. Easy to upgrade later.

## Known limitations

- No automated tests beyond manual verification.
- Favorites are device-local; no cross-device sync.
- No pagination — only TMDB's first page of results is shown.
- No trailers or similar-movies section on the details page.
- A poster URL that 404s shows a broken-image icon (only the missing-`poster_path` case has a title fallback).
- No accessibility audit pass beyond semantic HTML, alt text, and focus states.

## What I'd do next

- Server-side persistence with a small DB (Vercel KV or SQLite) plus optional auth, so favorites sync across devices.
- Pagination or infinite scroll on search results.
- Richer details: trailers, similar movies, full credits.
- Search filters (year, genre).
- Replace `<img>` with `next/image` after whitelisting the TMDB host in `next.config.ts`.
- A couple of Playwright smoke tests covering search → favorite → rate → refresh.
- Light caching of TMDB image responses at the edge.
