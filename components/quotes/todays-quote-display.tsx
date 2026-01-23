"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Quote } from "@/lib/quotes";
import { FavoriteButtonWithText } from "./favorite-button-with-text";
import { getQuoteDisplayText, getTranslation } from "@/lib/i18n";
import { useLanguage } from "@/app/providers/language-provider";
import { saveJournalAction, getJournalAction } from "@/actions/journal-actions";

type TodaysQuoteDisplayProps = {
  quote: Quote;
  favoriteIds: string[];
};


/**
 * Generate a shareable image of the quote using canvas
 */
function generateQuoteImage(quoteText: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Canvas dimensions
    const width = 1200;
    const height = 800;
    const padding = 80;
    
    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }
    
    // Background - white or dark based on preference (using white for simplicity)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    
    // Quote text styling
    ctx.fillStyle = "#1F2937"; // Dark gray text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Calculate text area
    const textAreaWidth = width - padding * 2;
    const textAreaHeight = height - padding * 3 - 40; // Reserve space for app name
    
    // Font size - adjust based on text length
    const baseFontSize = 48;
    const maxFontSize = 64;
    const minFontSize = 36;
    
    // Measure text and adjust font size
    let fontSize = baseFontSize;
    let lines: string[] = [];
    let textHeight = 0;
    
    // Try to fit text with word wrapping
    // Handle both space-separated languages (English) and character-based languages (Chinese)
    const hasSpaces = quoteText.includes(" ");
    let testLines: string[] = [];
    
    if (hasSpaces) {
      // Space-separated: split by words
      const words = quoteText.split(/\s+/);
      let currentLine = "";
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        ctx.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > textAreaWidth && currentLine) {
          testLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        testLines.push(currentLine);
      }
    } else {
      // Character-based: split by characters
      const chars = quoteText.split("");
      let currentLine = "";
      
      for (const char of chars) {
        const testLine = currentLine + char;
        ctx.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > textAreaWidth && currentLine) {
          testLines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        testLines.push(currentLine);
      }
    }
    
    // Adjust font size to fit
    const lineHeight = fontSize * 1.6;
    const totalTextHeight = testLines.length * lineHeight;
    
    if (totalTextHeight > textAreaHeight) {
      fontSize = Math.max(minFontSize, (textAreaHeight / testLines.length / 1.6));
    } else if (totalTextHeight < textAreaHeight * 0.6 && testLines.length <= 3) {
      fontSize = Math.min(maxFontSize, fontSize * 1.2);
    }
    
    // Recalculate lines with final font size
    lines = [];
    ctx.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    
    if (hasSpaces) {
      // Space-separated: split by words
      const words = quoteText.split(/\s+/);
      let currentLine = "";
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > textAreaWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    } else {
      // Character-based: split by characters
      const chars = quoteText.split("");
      let currentLine = "";
      
      for (const char of chars) {
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > textAreaWidth && currentLine) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }
    
    // Draw quote text
    const finalLineHeight = fontSize * 1.6;
    const totalHeight = lines.length * finalLineHeight;
    const startY = (height - totalHeight) / 2 - 20; // Slightly above center to make room for app name
    
    lines.forEach((line, index) => {
      const y = startY + index * finalLineHeight + fontSize / 2;
      ctx.fillText(line, width / 2, y);
    });
    
    // Draw app name at bottom
    ctx.fillStyle = "#9CA3AF"; // Light gray
    ctx.font = `300 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    ctx.fillText("Mementa", width / 2, height - padding);
    
    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to generate image blob"));
      }
    }, "image/png");
  });
}

export function TodaysQuoteDisplay({ quote: initialQuote, favoriteIds }: TodaysQuoteDisplayProps) {
  const { language } = useLanguage();
  const [quote] = useState<Quote>(initialQuote);
  const [mounted, setMounted] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure client-side rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved journal entry for today's quote from database
  useEffect(() => {
    if (!mounted) return;
    
    const loadJournal = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const result = await getJournalAction(quote.id, today);
        if (result.journal && !result.error) {
          setJournalText(result.journal.content);
        }
      } catch (error) {
        console.error("Failed to load journal:", error);
      }
    };
    
    loadJournal();
  }, [quote.id, mounted]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 2 * 24; // 2 lines at ~24px line height
      textareaRef.current.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    }
  }, [journalText]);

  // Debounced save function
  const saveJournal = useCallback(async (content: string) => {
    if (!content.trim()) {
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const formData = new FormData();
    formData.append("quote_id", quote.id);
    formData.append("date", today);
    formData.append("content", content);

    try {
      await saveJournalAction(formData);
      // Show save message briefly
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to save journal:", error);
    }
  }, [quote.id]);

  // Handle text change with debounce
  const handleChange = (value: string) => {
    setJournalText(value);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (800ms after user stops typing)
    saveTimeoutRef.current = setTimeout(() => {
      saveJournal(value);
    }, 800);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const isFavorited = favoriteIds.includes(quote.id);
  // Display text changes based on language, but quote remains the same
  const displayText = getQuoteDisplayText(quote, language ?? "zh-tw");

  // Format today's date - minimal, elegant
  const today = new Date();
  const dateString = today.toLocaleDateString(
    language === "en" ? "en-US" : language === "zh-cn" ? "zh-CN" : "zh-TW",
    { 
      year: "numeric", 
      month: language === "en" ? "short" : "long", 
      day: "numeric" 
    }
  );

  // Transition text - fixed, never changes (no period)
  const transitionText = language === "en" 
    ? "This moment, only yours" 
    : language === "zh-cn" 
    ? "这一刻，只属于你" 
    : "這一刻，只屬於你";

  const handleShare = async () => {
    if (!quote || !displayText) return;
    
    try {
      // Generate image
      const blob = await generateQuoteImage(displayText);
      const file = new File([blob], "mementa-quote.png", { type: "image/png" });
      
      // Try Web Share API first (if supported)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "今日金句",
            text: displayText,
          });
          return;
        } catch (shareError) {
          // If share fails, fall back to download
          console.log("Web Share failed, falling back to download:", shareError);
        }
      }
      
      // Fallback: Download image
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mementa-quote.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate or share image:", error);
      alert("無法生成圖片，請稍後再試");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col justify-between px-4 py-12" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)' }}>
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
          <div className="bg-white/60 rounded-3xl shadow-sm px-12 md:px-16 py-16 md:py-24">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-4/5 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-12" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)' }}>
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        {/* Date Display - Top left, subtle */}
        <div className="mb-12">
          <p className="text-[11px] text-stone-400 font-sans">
            {dateString}
          </p>
        </div>

        {/* Transition Text - Fixed, body font, 40% smaller than quote, secondary color */}
        <div className="mb-10">
          <p className="text-base md:text-lg lg:text-xl text-stone-500 font-sans font-light text-center">
            {transitionText}
          </p>
        </div>

        {/* Quote Display - Serif font, book-like, spacious, calm */}
        <div className="bg-white/50 rounded-3xl shadow-sm px-12 md:px-16 py-20 md:py-32 mb-12">
          <blockquote 
            className="text-lg md:text-xl lg:text-2xl leading-[2.0] text-center text-stone-700 font-normal" 
            style={{ 
              fontFamily: '"Playfair Display", "Libre Baskerville", Georgia, "Times New Roman", serif',
              letterSpacing: '0.025em'
            }}
          >
            {displayText}
          </blockquote>
        </div>

        {/* Journaling Section */}
        <div className="w-full max-w-4xl mx-auto">
          {/* Label */}
          <p className="text-sm md:text-base text-stone-500 font-sans font-light mb-3 text-left">
            {getTranslation(language ?? "zh-tw", "thisMomentIsYours")}
          </p>

          {/* Textarea */}
          <div>
            <textarea
              ref={textareaRef}
              value={journalText}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={getTranslation(language ?? "zh-tw", "journalPlaceholder")}
              className="w-full bg-white/40 rounded-xl px-4 py-3 text-base font-normal text-stone-700 font-sans resize-none overflow-hidden focus:outline-none focus:ring-0 focus:bg-white/50 transition-colors"
              style={{
                minHeight: "48px",
                lineHeight: "1.6"
              }}
            />
            
            {/* Save message - below textarea */}
            {showSaveMessage && journalText.trim() && (
              <p className="mt-2 text-xs text-stone-400 font-light animate-fade-out">
                {getTranslation(language ?? "zh-tw", "journalSaved")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons - Bottom, small, subtle, hover only */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-3 pb-8">
        <FavoriteButtonWithText quoteId={quote.id} isFavorited={isFavorited} />
        
        <button
          type="button"
          onClick={handleShare}
          className="px-3 py-1.5 text-[11px] font-normal rounded-md bg-transparent text-stone-400 touch-manipulation min-h-[36px] flex items-center justify-center gap-1.5 hover:text-stone-600"
        >
          <span className="text-sm">📤</span>
          <span>{language === "zh-tw" ? "分享" : language === "zh-cn" ? "分享" : "Share"}</span>
        </button>
      </div>
    </div>
  );
}

