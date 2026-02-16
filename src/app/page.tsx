import SearchClient from "@/components/SearchClient";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-100">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200" />

        <div
          className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-pink-300/40 blur-3xl"
          style={{ animation: "floatSlow 20s ease-in-out infinite" }}
        />

        <div
          className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-sky-300/40 blur-3xl"
          style={{ animation: "floatSlow 26s ease-in-out infinite" }}
        />
      </div>

      {/* Foreground */}
      <section className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-2xl rounded-2xl bg-white/80 backdrop-blur-xl p-10 shadow-lg">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Movie Explorer
            </h1>
            <p className="mt-2 text-zinc-600">
              Discover movies in a cinematic way
            </p>
          </header>

          <SearchClient />
        </div>
      </section>
    </main>
  );
}
