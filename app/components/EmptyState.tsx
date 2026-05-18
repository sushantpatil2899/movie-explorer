export default function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
      <p className="text-lg">{title}</p>
      {hint && <p className="mt-2 text-sm">{hint}</p>}
    </div>
  );
}
