"use client";

import { useCallback, useEffect, useState } from "react";
import type { Favorite, Movie } from "./types";

const STORAGE_KEY = "movie-explorer:favorites:v1";
const CHANGE_EVENT = "movie-explorer:favorites-changed";

function readAll(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Favorite[]) : [];
  } catch {
    return [];
  }
}

function writeAll(next: Favorite[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readAll());
    setHydrated(true);

    const onChange = () => setFavorites(readAll());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const add = useCallback((m: Movie) => {
    const current = readAll();
    if (current.some((f) => f.id === m.id)) return;
    const next: Favorite[] = [
      ...current,
      {
        id: m.id,
        title: m.title,
        year: m.year,
        posterUrl: m.posterUrl,
        rating: 0,
        note: "",
        savedAt: new Date().toISOString(),
      },
    ];
    writeAll(next);
    setFavorites(next);
  }, []);

  const remove = useCallback((id: number) => {
    const next = readAll().filter((f) => f.id !== id);
    writeAll(next);
    setFavorites(next);
  }, []);

  const updateRating = useCallback((id: number, rating: number) => {
    const clamped = Math.max(0, Math.min(5, Math.round(rating)));
    const next = readAll().map((f) => (f.id === id ? { ...f, rating: clamped } : f));
    writeAll(next);
    setFavorites(next);
  }, []);

  const updateNote = useCallback((id: number, note: string) => {
    const next = readAll().map((f) => (f.id === id ? { ...f, note } : f));
    writeAll(next);
    setFavorites(next);
  }, []);

  return { favorites, isFavorite, add, remove, updateRating, updateNote, hydrated };
}
