export default function LoadingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-comic-paper p-4">
      <div className="bg-white comic-border p-6 rounded-xl comic-shadow text-center flex flex-col items-center gap-3 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-comic-yellow comic-border flex items-center justify-center font-bangers text-2xl text-comic-ink comic-shadow">
          💥
        </div>
        <h2 className="font-bangers text-2xl text-comic-ink tracking-wide">
          MEMUAT PETUALANGAN KOMIK...
        </h2>
        <p className="text-xs font-sans text-gray-600">
          Kapten Klu sedang menyiapkan panel komik terbaru...
        </p>
      </div>
    </div>
  );
}
