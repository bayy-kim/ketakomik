export interface FallbackWord {
  id: string;
  text: string;
  normalizedText: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  clueHonest: string;
  clueMisleading: string;
  scheduledDate: string;
  category: string;
  chapterId?: string;
}

export interface FallbackChapter {
  id: string;
  title: string;
  chapterNote: string;
  unlockComicImageUrl: string;
  weekStartDate: string;
  isPublished: boolean;
  wordIds: string[];
}

export const FALLBACK_WORDS: FallbackWord[] = [];
export const FALLBACK_CHAPTERS: FallbackChapter[] = [];
