"use client";

import { useCallback, useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import LoadingSkeleton from "./components/LoadingSkeleton";
import type { Movie, SearchResponse } from "./lib/types";

type Status = "idle" | "loading" | "ok" | "error";

export default function Home() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<Movie[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const runSearch = useCallback(async (q: string) => {
    if (!q) {
      setStatus("idle");
      setResults([]);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data: SearchResponse = await res.json();
      setResults(data.results);
      setStatus("ok");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    runSearch(query);
  }, [query, runSearch]);

  return (
    <div className="space-y-6">
      <SearchBar onQueryChange={setQuery} />

      {status === "idle" && (
        <EmptyState title="Search for a movie to get started" hint="Try 'Inception' or 'Dune'." />
      )}
      {status === "loading" && <LoadingSkeleton />}
      {status === "error" && (
        <ErrorState message={errorMsg || "Something went wrong"} onRetry={() => runSearch(query)} />
      )}
      {status === "ok" && results.length === 0 && (
        <EmptyState title={`No movies match "${query}"`} hint="Try a different title." />
      )}
      {status === "ok" && results.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}
