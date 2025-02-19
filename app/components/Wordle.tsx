"use client";

import { useState, useEffect, useCallback } from "react";

const fetchPortugueseWord = async (length: number | null): Promise<string | null> => {
  try {
    let word: string | null = null;
    
    while (!word || word.length !== length) {
      const response = await fetch("https://api.dicionario-aberto.net/random");
      const data = await response.json();
      word = data.word.toUpperCase();
      console.log(word)
    }

    console.log(word)
    return word;
  } catch (error) {
    console.error("Error fetching word:", error);
    return "CASA";
  }
};

const Wordle = ({length, attempts}: {length: number | 0, attempts: number | null}) => {
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewWord();
  }, [length]);

  const getNewWord = useCallback(async () => {
    setLoading(true); 
    setGameOver(false);
    setGuesses([]);
    setCurrentGuess("");
    const word = await fetchPortugueseWord(length);
    setTargetWord(word);
    setLoading(false);
  }, [length]);
  

  useEffect(() => {
    if (targetWord && (guesses.includes(targetWord) || guesses.length === attempts)) {
      setGameOver(true);
    }
  }, [guesses, targetWord, getNewWord, attempts]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameOver || !targetWord) return;

    if (/^[a-zA-Záéíóúãõâêîôûç]$/.test(e.key) && currentGuess.length < length) {
      setCurrentGuess((prev) => (prev + e.key).toUpperCase());
    } else if (e.key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (e.key === "Enter" && currentGuess.length === length) {
      setGuesses((prev) => [...prev, currentGuess]);
      setCurrentGuess("");
    }
  };

  const getLetterStyle = (letter: string, index: number) => {
    if (!targetWord) return "bg-gray-700";
    if (targetWord[index] === letter) return "bg-green-500";
    if (targetWord.includes(letter)) return "bg-yellow-500";
    return "bg-gray-500";
  };

  if (loading) return <p className="text-white text-xl">Carregando palavra...</p>;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid gap-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {guess.split("").map((letter, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center text-xl font-bold uppercase text-white border-2 border-gray-800 ${getLetterStyle(
                  letter,
                  index
                )}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}

        {!gameOver && (
          <div className="flex gap-2">
            {Array.from({ length: length }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={currentGuess[index] || ""}
                onKeyDown={handleKeyDown}
                className="w-12 h-12 text-center text-xl font-bold uppercase bg-black text-white border-2 border-gray-700 focus:outline-none"
                readOnly
              />
            ))}
          </div>
        )}
      </div>

      {gameOver && (
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold text-white">
            {guesses.includes(targetWord || "") ? "Ganhaste!" : `Perdeste! (Palavra: ${targetWord})`}
          </p>
          <button
            onClick={getNewWord}
            className="mt-4 px-4 py-2 bg-gray-700 text-white text-lg font-semibold rounded hover:bg-blue-500 transition"
          >
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default Wordle;