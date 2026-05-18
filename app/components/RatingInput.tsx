"use client";

import { useFavorites } from "@/app/lib/favorites";

export default function RatingInput({ id }: { id: number }) {
  const { favorites, updateRating, updateNote, hydrated } = useFavorites();
  const fav = favorites.find((f) => f.id === id);

  if (!hydrated || !fav) {
    return (
      <p className="text-sm text-neutral-500">
        Add this movie to favorites to rate it and leave a note.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-400">Your rating:</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => updateRating(id, n === fav.rating ? 0 : n)}
            aria-label={`Rate ${n} of 5`}
            className={`text-2xl leading-none ${n <= fav.rating ? "text-yellow-400" : "text-neutral-600"}`}
          >
            ★
          </button>
        ))}
        {fav.rating > 0 && (
          <span className="text-sm text-neutral-400">{fav.rating}/5</span>
        )}
      </div>
      <textarea
        value={fav.note}
        onChange={(e) => updateNote(id, e.target.value)}
        placeholder="Add a note (optional)"
        rows={3}
        className="w-full rounded border border-neutral-700 bg-neutral-900 p-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
      />
    </div>
  );
}
