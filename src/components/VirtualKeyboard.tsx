"use client";

import { Delete, CornerDownLeft } from "lucide-react";
import { LetterState } from "./LetterBox";

interface VirtualKeyboardProps {
  onChar: (char: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  letterStatuses?: Record<string, LetterState>;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

export function VirtualKeyboard({
  onChar,
  onDelete,
  onEnter,
  letterStatuses = {},
  disabled = false,
}: VirtualKeyboardProps) {
  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto flex flex-col gap-1 sm:gap-1.5 p-1.5 sm:p-2 bg-comic-paper comic-border rounded-lg comic-shadow touch-manipulation">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-0.5 sm:gap-1.5">
          {row.map((key) => {
            const status = letterStatuses[key];

            let btnBg = "bg-white hover:bg-gray-100";
            let btnText = "text-comic-ink";

            if (status === "CORRECT") {
              btnBg = "bg-comic-correct text-white hover:bg-green-600";
              btnText = "text-white";
            } else if (status === "PRESENT") {
              btnBg = "bg-comic-present text-comic-ink hover:bg-yellow-500";
              btnText = "text-comic-ink";
            } else if (status === "ABSENT") {
              btnBg = "bg-comic-absent text-white opacity-70 hover:bg-slate-700";
              btnText = "text-white";
            }

            if (key === "ENTER" || key === "DELETE") {
              btnBg = "bg-comic-yellow hover:bg-yellow-400 font-bold";
            }

            const isSpecialKey = key === "ENTER" || key === "DELETE";

            return (
              <button
                key={key}
                disabled={disabled}
                onClick={() => {
                  if (key === "ENTER") onEnter();
                  else if (key === "DELETE") onDelete();
                  else onChar(key);
                }}
                /* Technical Guardrail: flex-1 for fluid universal 320px–430px+ mobile screens, min-h-[44px] touch target */
                className={`${
                  isSpecialKey ? "flex-[1.5] max-w-[62px] px-1" : "flex-1 max-w-[42px] px-0.5"
                } min-h-[44px] sm:min-h-[48px] py-1.5 font-bangers text-base sm:text-lg border-2 border-comic-ink rounded flex items-center justify-center select-none comic-shadow-sm transition-transform active:translate-y-0.5 disabled:opacity-50 ${btnBg} ${btnText}`}
              >
                {key === "ENTER" ? (
                  <span className="flex items-center gap-0.5 text-[11px] sm:text-sm font-bold leading-none">
                    CEK <CornerDownLeft className="w-3 h-3 hidden sm:inline" />
                  </span>
                ) : key === "DELETE" ? (
                  <Delete className="w-4 h-4 sm:w-5 sm:h-5 text-comic-ink" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
