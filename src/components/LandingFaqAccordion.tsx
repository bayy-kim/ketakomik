"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function LandingFaqAccordion({ faqList }: { faqList: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2.5">
      {faqList.map((faq, idx) => {
        const isOpen = openFaq === idx;
        return (
          <div key={idx} className={`comic-border rounded-xl overflow-hidden transition-all bg-white ${isOpen ? "comic-shadow" : "shadow-none"}`}>
            <button
              onClick={() => setOpenFaq(isOpen ? null : idx)}
              className={`w-full px-3.5 py-3 flex items-start justify-between gap-3 text-left transition-colors ${isOpen ? "bg-amber-50" : "hover:bg-gray-50"}`}
            >
              <span className="font-bangers text-sm sm:text-base text-comic-ink leading-snug">{faq.q}</span>
              <span className={`shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4 text-comic-ink" />
              </span>
            </button>
            {isOpen && (
              <div className="px-3.5 pb-3.5 pt-1.5 font-sans text-xs sm:text-sm text-gray-700 leading-relaxed border-t-2 border-amber-100 bg-amber-50">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
