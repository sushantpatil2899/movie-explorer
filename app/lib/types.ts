export type Movie = {
  id: number;
  title: string;
  year: string | null;
  overview: string;
  posterUrl: string | null;
  runtime?: number;
  tagline?: string;
  genres?: string[];
  releaseDate?: string;
  tmdbRating?: number;
  tmdbVoteCount?: number;
  director?: string;
  cast?: string[];
};

export type Favorite = {
  id: number;
  title: string;
  year: string | null;
  posterUrl: string | null;
  rating: number;
  note: string;
  savedAt: string;
};

export type SearchResponse = { results: Movie[] };
export type ApiError = { error: string };
