import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-neutral-100">
          🎬 Movie Explorer
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-neutral-300 hover:text-neutral-100">
            Search
          </Link>
          <Link href="/favorites" className="text-neutral-300 hover:text-neutral-100">
            Favorites
          </Link>
        </div>
      </nav>
    </header>
  );
}
