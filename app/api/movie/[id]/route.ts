import { NextResponse } from "next/server";
import { getMovie } from "@/app/lib/tmdb";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const movie = await getMovie(numeric);
    if (!movie) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(movie, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    console.error("movie route error:", err);
    return NextResponse.json({ error: "Upstream API error" }, { status: 502 });
  }
}
