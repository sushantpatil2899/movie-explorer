"use client";

import { useFavorites } from "@/app/lib/favorites";
import type { Movie } from "@/app/lib/types";

export default function FavoriteButton({ movie }: { movie: Movie }) {
  const { isFavorite, add, remove, hydrated } = useFavorites();
  const active = hydrated && isFavorite(movie.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) remove(movie.id);
        else add(movie);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className="rounded-full bg-black/60 p-2 text-lg backdrop-blur hover:bg-black/80"
    >
      <span aria-hidden>{active ? "♥" : "♡"}</span>
    </button>
  );
}
