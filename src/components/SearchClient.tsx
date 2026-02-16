"use client";

import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";

type Movie = {
  id: number;
  title: string;
  year: string;
  poster: string | null;
  overview: string;
};

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  year: string;
  runtime: number | null;
  poster: string | null;
};

type Favorite = MovieDetails & {
  rating: number;
  note: string;
};



export default function SearchClient() {
  /* View state */
  const [view, setView] = useState<"search" | "favorites">("search");

  /* Search state */
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = debouncedQuery.length > 0 && !hasSearched && !error;

  /* Modal state */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  /* Favorites */
  const [favorites, setFavorites] = useState<Favorite[]>([]);


  /* Debounce search input */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
      setHasSearched(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setError(null);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?query=${debouncedQuery}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResults(data.results);
      } catch {
        setError("Something went wrong. Please try again.");
        setResults([]);
      } finally {
        setHasSearched(true);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  /* Load favorites */
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  /* Persist favorites */
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  /* Helpers */

  const isFavorite = (id: number) =>
    favorites.some((fav) => fav.id === id);

  const openMovieDetails = async (movieId: number) => {
    setIsModalOpen(true);
    setDetailsLoading(true);
    setDetailsError(null);
    setMovieDetails(null);

    try {
      const res = await fetch(`/api/movie?id=${movieId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMovieDetails(data);
    } catch {
      setDetailsError("Failed to load movie details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const addFavorite = (movie: MovieDetails) => {
    if (isFavorite(movie.id)) return;

    setFavorites((prev) => [
      ...prev,
      { ...movie, rating: 3, note: "" },
    ]);
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFavorite = (
    id: number,
    updates: Partial<Pick<Favorite, "rating" | "note">>
  ) => {
    setFavorites((prev) =>
      prev.map((fav) =>
        fav.id === id ? { ...fav, ...updates } : fav
      )
    );
  };

  const addFavoriteAndOpenModal = (movie: Movie) => {
    if (!isFavorite(movie.id)) {
      setFavorites((prev) => [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          poster: movie.poster,
          overview: movie.overview,
          runtime: null,
          rating: 3,
          note: "",
        },
      ]);
    }

    openMovieDetails(movie.id);
  };

  return (
    
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4">
      {/* View Switcher */}
      <div className="mb-4 flex gap-4">
        <button onClick={() => setView("search")} 
        className={`text-sm font-medium ${ view === "search" ? "text-zinc-900" : "text-zinc-500" }`}
        > 
          Search
        </button>
        
        <button onClick={() => setView("favorites")}
        className={`text-sm font-medium ${ view === "favorites" ? "text-zinc-900" : "text-zinc-500" }`}
        > 
          Favorites ({favorites.length})
        </button>
      </div>

      {view === "search" && (
        <> 
        {/* existing search input + results */}
        {/* Search */}
        <div
            className={`w-full max-w-xl transition-all duration-500 ${
            hasSearched ? "mt-10" : "mt-[35vh]"
            }`}
        >
            <SearchInput value={query} onChange={setQuery} />
        </div>

        {/* Results */}
        {hasSearched && (
            <div className="mt-8 w-full max-w-3xl rounded-xl border bg-white shadow-sm">
            <div className="max-h-[60vh] overflow-y-auto p-4">
                {isLoading && (
                <p className="text-center text-sm text-zinc-500">
                    Searching movies…
                </p>
                )}

                {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
                )}

                {!isLoading && !error && results.length === 0 && (
                <p className="text-center text-sm text-zinc-500">
                    No movies found for "{debouncedQuery}"
                </p>
                )}

                <ul className="space-y-4">
                {results.map((movie) => (
                    <li
                    key={movie.id}
                    onClick={() => openMovieDetails(movie.id)}
                    className="flex gap-4 rounded-lg border p-3 cursor-pointer"
                    >
                    {movie.poster && (
                        <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-24 w-16 rounded object-cover"
                        />
                    )}

                    <div className="flex-1 space-y-1">
                        <p className="font-medium text-zinc-900">
                        {movie.title} ({movie.year})
                        </p>

                        <p className="line-clamp-2 text-sm text-zinc-600">
                        {movie.overview}
                        </p>

                        {!isFavorite(movie.id) ? (
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            addFavoriteAndOpenModal(movie);
                            }}
                            className="mt-2 text-sm font-medium text-zinc-900 hover:underline"
                        >
                            + Add to Favorites
                        </button>
                        ) : (
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(movie.id);
                            }}
                            className="mt-2 text-sm font-medium text-red-600 hover:underline"
                        >
                            Remove Favorite
                        </button>
                        )}
                    </div>
                    </li>
                ))}
                </ul>
            </div>
            </div>
        )}
        </> 
      )}
    
      {view === "favorites" && (
        <div className="mt-8 w-full max-w-3xl rounded-xl border bg-white shadow-sm">
        <div className="p-4">
        {favorites.length === 0 ? (
            <p className="text-center text-sm text-zinc-500">
                No favorites yet.
            </p>
        ) : (
            <ul className="space-y-4">
            {favorites.map((movie) => (
            <li
              key={movie.id}
              onClick={() => openMovieDetails(movie.id)}
              className="flex gap-4 rounded-lg border p-3 cursor-pointer"
            >
              {movie.poster && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-24 w-16 rounded object-cover"
                />
              )}

              <div className="flex-1 space-y-1">
                <p className="font-medium text-zinc-900">
                  {movie.title} ({movie.year})
                </p>

                <p className="text-sm text-zinc-600">
                  Rating: {movie.rating}/5
                </p>

                {movie.note && (
                  <p className="line-clamp-2 text-sm text-zinc-500">
                    {movie.note}
                  </p>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(movie.id);
                  }}
                  className="mt-2 text-sm font-medium text-red-600 hover:underline"
                >
                  Remove Favorite
                </button>
              </div>
            </li>
            ))}
            </ul>
        )}
        </div>
        </div>
    )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
            >
              ✕
            </button>

            {detailsLoading && (
              <p className="text-center text-sm text-zinc-500">
                Loading movie details…
              </p>
            )}

            {detailsError && (
              <p className="text-center text-sm text-red-500">
                {detailsError}
              </p>
            )}

            {movieDetails && (
              <>
                <div className="flex gap-4">
                  {movieDetails.poster && (
                    <img
                      src={movieDetails.poster}
                      alt={movieDetails.title}
                      className="h-40 w-28 rounded object-cover"
                    />
                  )}

                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-zinc-900">
                      {movieDetails.title} ({movieDetails.year})
                    </h2>

                    {movieDetails.runtime && (
                      <p className="text-sm text-zinc-500">
                        Runtime: {movieDetails.runtime} min
                      </p>
                    )}

                    <p className="text-sm text-zinc-700">
                      {movieDetails.overview}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {!isFavorite(movieDetails.id) ? (
                    <button
                      onClick={() => addFavorite(movieDetails)}
                      className="w-full rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                    >
                      Add to Favorites
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => removeFavorite(movieDetails.id)}
                        className="w-full rounded border px-4 py-2 text-sm text-zinc-900"
                      >
                        Remove from Favorites
                      </button>

                      <label className="block text-sm font-medium text-zinc-900">
                        Rating
                      </label>
                      <select
                        value={
                          favorites.find(
                            (f) => f.id === movieDetails.id
                          )?.rating
                        }
                        onChange={(e) =>
                          updateFavorite(movieDetails.id, {
                            rating: Number(e.target.value),
                          })
                        }
                        className="w-full rounded border bg-white px-3 py-2 text-sm text-zinc-900"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>

                      <label className="block text-sm font-medium text-zinc-900">
                        Note
                      </label>
                      <textarea
                        value={
                          favorites.find(
                            (f) => f.id === movieDetails.id
                          )?.note
                        }
                        onChange={(e) =>
                          updateFavorite(movieDetails.id, {
                            note: e.target.value,
                          })
                        }
                        className="w-full rounded border bg-white px-3 py-2 text-sm text-zinc-900"
                        rows={3}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
