export type OfflineLetterFeedback = "CORRECT" | "PRESENT" | "ABSENT";

export interface OfflineEvaluationResult {
  feedback: OfflineLetterFeedback[];
  isWon: boolean;
  isGameOver: boolean;
  score: number;
  tintaEarned: number;
}

export function evaluateOfflineGuess(
  guess: string,
  targetWordText: string,
  attemptNumber: number
): OfflineEvaluationResult {
  const normalizedGuess = guess.trim().toUpperCase();
  const target = targetWordText.trim().toUpperCase();
  const length = target.length;

  const feedback: OfflineLetterFeedback[] = new Array(length).fill("ABSENT");
  const targetLetterCounts: Record<string, number> = {};

  for (let i = 0; i < length; i++) {
    const char = target[i];
    targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
  }

  // Pass 1: EXACT Matches (GREEN / CORRECT)
  for (let i = 0; i < length; i++) {
    if (normalizedGuess[i] === target[i]) {
      feedback[i] = "CORRECT";
      targetLetterCounts[normalizedGuess[i]]--;
    }
  }

  // Pass 2: MISPLACED Matches (YELLOW / PRESENT)
  for (let i = 0; i < length; i++) {
    if (feedback[i] !== "CORRECT") {
      const char = normalizedGuess[i];
      if (targetLetterCounts[char] && targetLetterCounts[char] > 0) {
        feedback[i] = "PRESENT";
        targetLetterCounts[char]--;
      }
    }
  }

  const isWon = feedback.every((f) => f === "CORRECT");
  const isGameOver = isWon || attemptNumber >= 6;

  let score = 0;
  let tintaEarned = 0;

  if (isWon) {
    const baseScore = Math.max(25, 100 - (attemptNumber - 1) * 15);
    score = Math.max(20, baseScore);
    tintaEarned = Math.max(15, 60 - attemptNumber * 8);
  }

  return {
    feedback,
    isWon,
    isGameOver,
    score,
    tintaEarned,
  };
}
