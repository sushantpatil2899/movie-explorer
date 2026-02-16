import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }

  const data = await res.json();

  const results = data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date?.split("-")[0] ?? "—",
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    overview: movie.overview || "",
  }));

  return NextResponse.json({ results });
}
