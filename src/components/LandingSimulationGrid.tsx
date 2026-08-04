"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SimulationWord {
  word: string;
  status: string[];
}

export function LandingSimulationGrid({ simulationWords }: { simulationWords: SimulationWord[] }) {
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % simulationWords.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [simulationWords]);

  return (
    <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-12 pointer-events-none opacity-30 select-none overflow-hidden">
      {/* Left Stack */}
      <div className="flex flex-col gap-2 scale-75 sm:scale-100 rotate-[-5deg] translate-x-[-15%]">
        {simulationWords.map((row, rIdx) => {
          const isActive = rIdx === animStep;
          return (
            <div key={rIdx} className="flex gap-1.5">
              {row.word.split("").map((char, cIdx) => {
                const st = row.status[cIdx];
                const bgClass =
                  isActive && st === "CORRECT"
                    ? "bg-comic-correct text-white"
                    : isActive && st === "PRESENT"
                    ? "bg-comic-present text-comic-ink"
                    : "bg-gray-100 text-comic-ink";

                return (
                  <motion.div
                    key={cIdx}
                    animate={{
                      rotateY: isActive ? [0, 180, 0] : 0,
                      scale: isActive ? [1, 1.08, 1] : 1,
                    }}
                    transition={{ delay: cIdx * 0.12, duration: 0.5 }}
                    className={`w-9 h-9 sm:w-12 sm:h-12 comic-border rounded-md flex items-center justify-center font-bangers text-xl sm:text-2xl ${bgClass} comic-shadow-sm`}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Right Stack */}
      <div className="hidden md:flex flex-col gap-2 scale-75 sm:scale-100 rotate-[5deg] translate-x-[15%]">
        {simulationWords.slice().reverse().map((row, rIdx) => {
          const isActive = rIdx === animStep;
          return (
            <div key={rIdx} className="flex gap-1.5">
              {row.word.split("").map((char, cIdx) => {
                const st = row.status[cIdx];
                const bgClass =
                  isActive && st === "CORRECT"
                    ? "bg-comic-correct text-white"
                    : isActive && st === "PRESENT"
                    ? "bg-comic-present text-comic-ink"
                    : "bg-gray-100 text-comic-ink";

                return (
                  <motion.div
                    key={cIdx}
                    animate={{
                      scale: isActive ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ delay: cIdx * 0.1, duration: 0.5 }}
                    className={`w-9 h-9 sm:w-12 sm:h-12 comic-border rounded-md flex items-center justify-center font-bangers text-xl sm:text-2xl ${bgClass} comic-shadow-sm`}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
