"use client";

import Link from "next/link";
import { useFavorites } from "@/app/lib/favorites";
import EmptyState from "@/app/components/EmptyState";

export default function FavoritesPage() {
  const { favorites, hydrated, remove } = useFavorites();

  if (!hydrated) return null;

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        hint="Search for a movie and tap the heart to save it."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Your favorites</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((f) => (
          <div key={f.id} className="overflow-hidden rounded-lg bg-neutral-900">
            <Link href={`/movie/${f.id}`} className="flex gap-3">
              <div className="aspect-[2/3] w-24 shrink-0 bg-neutral-800">
                {f.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.posterUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 p-3">
                <h3 className="line-clamp-1 font-medium">{f.title}</h3>
                <p className="text-sm text-neutral-400">{f.year ?? "—"}</p>
                <p className="mt-1 text-sm">
                  {f.rating > 0 ? (
                    <span className="text-yellow-400">{"★".repeat(f.rating)}</span>
                  ) : (
                    <span className="text-neutral-600">Not rated</span>
                  )}
                </p>
                {f.note && (
                  <p className="mt-1 line-clamp-2 text-xs text-neutral-400">{f.note}</p>
                )}
              </div>
            </Link>
            <div className="border-t border-neutral-800 p-2 text-right">
              <button
                onClick={() => remove(f.id)}
                className="text-xs text-neutral-400 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
