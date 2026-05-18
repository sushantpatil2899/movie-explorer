import { notFound } from "next/navigation";
import { getMovie } from "@/app/lib/tmdb";
import FavoriteButton from "@/app/components/FavoriteButton";
import RatingInput from "@/app/components/RatingInput";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) notFound();

  const movie = await getMovie(numeric);
  if (!movie) notFound();

  return (
    <article className="grid gap-8 md:grid-cols-[300px_1fr]">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-neutral-800">
        {movie.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-neutral-500">
            {movie.title}
          </div>
        )}
      </div>

      <div className="space-y-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{movie.title}</h1>
            {movie.tagline && (
              <p className="mt-1 italic text-neutral-400">&ldquo;{movie.tagline}&rdquo;</p>
            )}
            <p className="mt-2 text-sm text-neutral-400">
              {movie.year ?? "—"}
              {movie.runtime ? ` · ${movie.runtime} min` : ""}
              {movie.tmdbRating
                ? ` · ★ ${movie.tmdbRating.toFixed(1)}/10${
                    movie.tmdbVoteCount ? ` (${movie.tmdbVoteCount.toLocaleString()} votes)` : ""
                  }`
                : ""}
            </p>
          </div>
          <FavoriteButton movie={movie} />
        </header>

        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-300"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        <div>
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-neutral-500">
            Overview
          </h2>
          <p className="leading-relaxed text-neutral-200">
            {movie.overview || "No overview available."}
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {movie.director && (
            <div>
              <dt className="text-neutral-500">Director</dt>
              <dd className="text-neutral-200">{movie.director}</dd>
            </div>
          )}
          {movie.cast && movie.cast.length > 0 && (
            <div>
              <dt className="text-neutral-500">Starring</dt>
              <dd className="text-neutral-200">{movie.cast.join(", ")}</dd>
            </div>
          )}
          {movie.releaseDate && (
            <div>
              <dt className="text-neutral-500">Released</dt>
              <dd className="text-neutral-200">{movie.releaseDate}</dd>
            </div>
          )}
        </dl>

        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="mb-3 text-lg font-medium">Your notes</h2>
          <RatingInput id={movie.id} />
        </section>
      </div>
    </article>
  );
}
