import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-2xl">Not found</p>
      <p className="mt-2 text-neutral-400">We couldn&apos;t find what you were looking for.</p>
      <Link href="/" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
        Back to search
      </Link>
    </div>
  );
}
