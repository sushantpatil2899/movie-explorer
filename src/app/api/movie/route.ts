import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Movie ID is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.TMDB_API_KEY;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const data = await res.json();

    return NextResponse.json({
      id: data.id,
      title: data.title,
      overview: data.overview,
      year: data.release_date?.split("-")[0] ?? "—",
      runtime: data.runtime ?? null,
      poster: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load movie details" },
      { status: 500 }
    );
  }
}
