import Link from "next/link";
import type { Movie } from "@/app/lib/types";
import FavoriteButton from "./FavoriteButton";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-neutral-900 transition hover:scale-[1.02] hover:shadow-lg">
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] w-full bg-neutral-800">
          {movie.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-neutral-500">
              {movie.title}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 font-medium text-neutral-100">{movie.title}</h3>
          <p className="text-sm text-neutral-400">{movie.year ?? "—"}</p>
          {movie.overview && (
            <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{movie.overview}</p>
          )}
        </div>
      </Link>
      <div className="absolute right-2 top-2">
        <FavoriteButton movie={movie} />
      </div>
    </div>
  );
}
