import { NextResponse } from "next/server";
import { searchMovies } from "@/app/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) return NextResponse.json({ error: "Query required" }, { status: 400 });
  if (q.length > 100) return NextResponse.json({ error: "Query too long" }, { status: 400 });

  try {
    const results = await searchMovies(q);
    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (err) {
    console.error("search route error:", err);
    return NextResponse.json({ error: "Upstream API error" }, { status: 502 });
  }
}
