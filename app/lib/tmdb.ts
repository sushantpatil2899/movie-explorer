import "server-only";
import type { Movie } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

function key(): string {
  const k = process.env.TMDB_API_KEY;
  if (!k) throw new Error("TMDB_API_KEY is not set");
  return k;
}

function posterUrl(path: string | null, size: "w342" | "w500" = "w342"): string | null {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

function yearFromDate(date: string | undefined | null): string | null {
  if (!date) return null;
  const m = /^(\d{4})/.exec(date);
  return m ? m[1] : null;
}

type TmdbSearchItem = {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  poster_path: string | null;
};

type TmdbCastMember = { name: string; order: number };
type TmdbCrewMember = { name: string; job: string };
type TmdbMovie = TmdbSearchItem & {
  runtime: number | null;
  tagline: string | null;
  genres: { id: number; name: string }[];
  vote_average: number;
  vote_count: number;
  credits?: { cast: TmdbCastMember[]; crew: TmdbCrewMember[] };
};

export async function searchMovies(query: string): Promise<Movie[]> {
  const url = new URL(`${TMDB_BASE}/search/movie`);
  url.searchParams.set("api_key", key());
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);

  const data: { results: TmdbSearchItem[] } = await res.json();
  return data.results.map((r) => ({
    id: r.id,
    title: r.title,
    year: yearFromDate(r.release_date),
    overview: r.overview ?? "",
    posterUrl: posterUrl(r.poster_path),
  }));
}

export async function getMovie(id: number): Promise<Movie | null> {
  const url = new URL(`${TMDB_BASE}/movie/${id}`);
  url.searchParams.set("api_key", key());
  url.searchParams.set("append_to_response", "credits");

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TMDB movie fetch failed: ${res.status}`);

  const r: TmdbMovie = await res.json();
  const director = r.credits?.crew.find((c) => c.job === "Director")?.name;
  const cast = r.credits?.cast
    ? [...r.credits.cast].sort((a, b) => a.order - b.order).slice(0, 5).map((c) => c.name)
    : undefined;

  return {
    id: r.id,
    title: r.title,
    year: yearFromDate(r.release_date),
    overview: r.overview ?? "",
    posterUrl: posterUrl(r.poster_path, "w500"),
    runtime: r.runtime ?? undefined,
    tagline: r.tagline || undefined,
    genres: r.genres?.length ? r.genres.map((g) => g.name) : undefined,
    releaseDate: r.release_date || undefined,
    tmdbRating: typeof r.vote_average === "number" ? r.vote_average : undefined,
    tmdbVoteCount: typeof r.vote_count === "number" ? r.vote_count : undefined,
    director: director || undefined,
    cast: cast && cast.length ? cast : undefined,
  };
}
