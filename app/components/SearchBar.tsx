"use client";

import { useEffect, useState } from "react";

export default function SearchBar({
  initial = "",
  onQueryChange,
  debounceMs = 300,
}: {
  initial?: string;
  onQueryChange: (q: string) => void;
  debounceMs?: number;
}) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const t = setTimeout(() => onQueryChange(value.trim()), debounceMs);
    return () => clearTimeout(t);
  }, [value, debounceMs, onQueryChange]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search movies…"
      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
      aria-label="Search movies"
    />
  );
}
