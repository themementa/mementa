"use client";

import { useState } from "react";
import { generateCaptionsFromQuote } from "@/lib/captions";

type CaptionGeneratorProps = {
  quoteText: string;
};

export function CaptionGenerator({ quoteText }: CaptionGeneratorProps) {
  const [captions, setCaptions] = useState<string[] | null>(null);

  const handleGenerate = () => {
    const result = generateCaptionsFromQuote(quoteText);
    setCaptions(result);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-soft-pink-dark/20 bg-white/90 backdrop-blur-sm shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-medium text-neutral-800">
          Caption 建議
        </h2>
        <button
          type="button"
          onClick={handleGenerate}
          className="px-4 py-2 text-xs font-medium rounded-xl bg-soft-lavender hover:bg-soft-lavender-dark text-neutral-700 transition-colors touch-manipulation min-h-[44px]"
        >
          產生 Caption
        </button>
      </div>

      {captions ? (
        <ul className="space-y-3">
          {captions.map((caption, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-soft-pink/30 bg-soft-pink-light/50 p-3 md:p-4"
            >
              <p className="text-xs md:text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {caption}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-neutral-500">
          按下「產生 Caption」會根據這句金句給你幾個 IG 風格文案草稿。
        </p>
      )}
    </div>
  );
}


