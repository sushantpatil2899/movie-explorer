"use client";

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded bg-neutral-800 px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
