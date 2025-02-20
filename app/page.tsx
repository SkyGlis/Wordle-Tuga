"use client";

import Wordle from "@/app/components/Wordle";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { VscAccount } from "react-icons/vsc";

const GameWrapper = () => {
  const [numLetters, setnumLetters] = useState<number | null>(null);
  const [numAttempts, setNumAttempts] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();


  const startGame = () => {
    if (numLetters && numAttempts) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("length", numLetters.toString());
      newSearchParams.set("attempts", numAttempts.toString());

      router.push(`/?${newSearchParams.toString()}`);
    }
  };

  const length = searchParams.get("length");
  const attempts = searchParams.get("attempts");
  const game = length !== null && attempts !== null;

  return game ? (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div className="flex gap-4 items-center flex-col sm:flex-col">
        <h1 className="text-3xl sm:text-6xl font-extrabold bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 inline-block text-transparent bg-clip-text mb-6">
          Wordle Tuga
        </h1>
        <Wordle length={Number(length)} attempts={Number(attempts)} />
      </div>
    </main>
  ) : (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    <div className="flex gap-4 items-center flex-col sm:flex-col">
      <h1 className="text-3xl sm:text-6xl font-extrabold bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 inline-block text-transparent bg-clip-text mb-6">
        Wordle Tuga
      </h1>
      <div className="flex flex-col gap-4">
        <label className="text-white text-lg">
          Número de letras:
          <input
            type="number"
            min="1"
            max="10"
            value={numLetters || ""}
            onChange={(e) => setnumLetters(Number(e.target.value))}
            className="ml-2 px-2 py-1 text-lg rounded bg-gray-800 text-white border border-gray-500"
          />
        </label>

        <label className="text-white text-lg">
          Número de Tentativas:
          <input
            type="number"
            min="1"
            max="10"
            value={numAttempts || ""}
            onChange={(e) => setNumAttempts(Number(e.target.value))}
            className="ml-2 px-2 py-1 text-lg rounded bg-gray-800 text-white border border-gray-500"
          />
        </label>

        <button
          onClick={startGame}
          className="mt-4 px-6 py-2 bg-green-600 text-white text-lg font-semibold rounded hover:bg-green-500 transition"
        >
          Iniciar Jogo
        </button>
      </div>
    </div>
  </main>
  );
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<p>Carregando...</p>}>
        <GameWrapper />
      </Suspense>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Feito por
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/skyglis"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VscAccount size={20} />
          Daniel Santos
        </a>
      </footer>
    </div>
  );
}