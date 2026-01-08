"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Quote } from "@/lib/quotes";
import { FavoriteButtonWithText } from "./favorite-button-with-text";
import { getQuoteDisplayText, getTranslation } from "@/lib/i18n";
import { useLanguage } from "@/app/providers/language-provider";
import { saveJournalAction, getJournalAction } from "@/actions/journal-actions";
import { QuietShareModal } from "@/components/share/quiet-share-modal";
import { ShareCard } from "@/components/share/share-card";
import { AfterShare } from "@/components/share/after-share";
import { useNightMode } from "@/hooks/use-night-mode";
import { getNightModeStyles } from "@/lib/night-mode";

type TodaysQuoteDisplayProps = {
  quote: Quote | null | undefined;
  favoriteIds: string[];
  focusMoment?: boolean;
};


/**
 * Generate a shareable image of text (quote or moment) using canvas
 */
function generateShareImage(text: string): Promise<Blob> {
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
    const textAreaHeight = height - padding * 2;
    
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
    const hasSpaces = text.includes(" ");
    let testLines: string[] = [];
    
    if (hasSpaces) {
      // Space-separated: split by words
      const words = text.split(/\s+/);
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
      const chars = text.split("");
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
      const words = text.split(/\s+/);
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
      const chars = text.split("");
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
    const startY = (height - totalHeight) / 2;
    
    lines.forEach((line, index) => {
      const y = startY + index * finalLineHeight + fontSize / 2;
      ctx.fillText(line, width / 2, y);
    });
    
    // Draw quiet source attribution in bottom-right corner
    ctx.fillStyle = "#D1D5DB"; // Very light gray, low contrast
    ctx.font = `300 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("via mementa", width - padding, height - padding);
    
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

// CRITICAL FIX: Hardcoded fallback quote to ensure UI never renders blank
// This is a temporary fallback until data fetching is guaranteed
const FALLBACK_QUOTE: Quote = {
  id: "fallback-quote",
  user_id: null,
  original_text: "Take a moment. You're here.",
  cleaned_text_en: "Take a moment. You're here.",
  cleaned_text_zh_tw: "停一停，你在這裡。",
  cleaned_text_zh_cn: "停一停，你在这里。",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function TodaysQuoteDisplay({ quote: initialQuote, favoriteIds, focusMoment = false }: TodaysQuoteDisplayProps) {
  const { language } = useLanguage();
  const nightMode = useNightMode();
  const nightStyles = getNightModeStyles();
  
  // CRITICAL FIX: Force use fallback quote if initialQuote is null/undefined
  // This ensures UI NEVER renders blank, even if data fetching fails
  const safeQuote = initialQuote || FALLBACK_QUOTE;
  const [quote] = useState<Quote>(safeQuote);
  const [mounted, setMounted] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Share flow states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareContent, setShareContent] = useState<string>("");
  const [shareType, setShareType] = useState<"quote" | "moment">("quote");
  const [showAfterShare, setShowAfterShare] = useState(false);

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

  // Focus on textarea if focusMoment is true (from prop or localStorage)
  useEffect(() => {
    if (!mounted) return;

    // Check localStorage for focus moment flag
    const shouldFocus = focusMoment || (typeof window !== "undefined" && localStorage.getItem("mementa_focus_moment") === "true");
    
    if (shouldFocus && textareaRef.current) {
      // Clear the flag
      if (typeof window !== "undefined") {
        localStorage.removeItem("mementa_focus_moment");
      }
      // Small delay to ensure textarea is rendered
      setTimeout(() => {
        textareaRef.current?.focus();
        // Scroll to textarea smoothly
        textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [focusMoment, mounted]);

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
  // CRITICAL FIX: If displayText is empty, use fallback text to ensure UI never renders blank
  let displayText = getQuoteDisplayText(quote, language ?? "zh-tw");
  if (!displayText || displayText.trim() === "") {
    // Fallback to English if current language text is empty
    displayText = quote.cleaned_text_en || quote.original_text || FALLBACK_QUOTE.cleaned_text_en || "";
  }

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

  // Get placeholder text based on night mode
  const getJournalPlaceholder = () => {
    if (nightMode) {
      return getTranslation(language ?? "zh-tw", "journalPlaceholderNight");
    }
    return getTranslation(language ?? "zh-tw", "journalPlaceholder");
  };

  // Get page title based on night mode
  const getPageTitle = () => {
    if (nightMode) {
      return getTranslation(language ?? "zh-tw", "tonightsQuote");
    }
    return getTranslation(language ?? "zh-tw", "todaysQuote");
  };

  const handleQuietShare = () => {
    setShowShareModal(true);
  };

  const handleShareQuote = () => {
    setShareContent(displayText);
    setShareType("quote");
    setShowShareModal(false);
    setShowShareCard(true);
  };

  const handleShareMoment = () => {
    if (!journalText.trim()) return;
    setShareContent(journalText);
    setShareType("moment");
    setShowShareModal(false);
    setShowShareCard(true);
  };

  const handlePerformShare = async () => {
    try {
      // Generate image
      const blob = await generateShareImage(shareContent);
      const file = new File([blob], "mementa-share.png", { type: "image/png" });
      
      // Try Web Share API first (if supported)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            text: shareContent,
          });
          setShowShareCard(false);
          setShowAfterShare(true);
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
      link.download = "mementa-share.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShowShareCard(false);
      setShowAfterShare(true);
    } catch (error) {
      console.error("Failed to generate or share image:", error);
    }
  };

  const backgroundStyle = nightMode 
    ? nightStyles.background 
    : 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)';

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col justify-between px-4 py-12" style={{ background: backgroundStyle }}>
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
    <div 
      className="min-h-screen flex flex-col justify-between px-4 py-12" 
      style={{ 
        background: backgroundStyle,
        transition: `background ${nightStyles.transitionDuration} ease-in-out`
      }}
    >
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        {/* Date Display - Top left, subtle - Hidden in night mode */}
        {!nightMode && (
          <div className="mb-12">
            <p className="text-[11px] text-stone-400 font-sans">
              {dateString}
            </p>
          </div>
        )}

        {/* Transition Text - 樣式 A：情緒引導文字 */}
        <div className="mb-10">
          <p className="text-base md:text-lg lg:text-xl text-stone-500 text-center text-heading-tone">
            {transitionText}
          </p>
        </div>

        {/* Quote Display - 樣式 B：內容主體字 */}
        <div className="bg-white/50 rounded-3xl shadow-sm px-12 md:px-16 py-20 md:py-32 mb-12">
          <blockquote 
            className="text-lg md:text-xl lg:text-2xl text-center text-stone-700 text-content-tone" 
            style={{ 
              lineHeight: nightMode ? nightStyles.lineHeight : '2.0',
              letterSpacing: nightMode ? nightStyles.letterSpacing : '0.025em',
              transition: `line-height ${nightStyles.transitionDuration}, letter-spacing ${nightStyles.transitionDuration}`
            }}
          >
            {displayText}
          </blockquote>
        </div>

        {/* Journaling Section */}
        <div className="w-full max-w-4xl mx-auto">
          {/* Label - 樣式 A：情緒引導文字 */}
          <p className="text-sm md:text-base text-stone-500 mb-3 text-left text-heading-tone">
            {getTranslation(language ?? "zh-tw", "thisMomentIsYours")}
          </p>

          {/* Textarea */}
          <div>
            <textarea
              ref={textareaRef}
              value={journalText}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={getJournalPlaceholder()}
              className="w-full bg-white/40 rounded-xl px-4 py-3 text-base font-normal text-stone-700 font-sans resize-none overflow-hidden focus:outline-none focus:ring-0 focus:bg-white/50"
              style={{
                minHeight: "48px",
                lineHeight: nightMode ? nightStyles.lineHeight : "1.6",
                letterSpacing: nightMode ? nightStyles.letterSpacing : "normal",
                transition: `line-height ${nightStyles.transitionDuration}, letter-spacing ${nightStyles.transitionDuration}, background-color ${nightStyles.transitionDuration}`
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
          onClick={handleQuietShare}
          className="px-3 py-1.5 text-[11px] font-normal rounded-md bg-transparent text-stone-400 touch-manipulation min-h-[36px] flex items-center justify-center gap-1.5 hover:text-stone-600"
        >
          <span>{getTranslation(language ?? "zh-tw", "quietShareAMoment")}</span>
        </button>
      </div>

      {/* Share Flow Modals */}
      <QuietShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShareQuote={handleShareQuote}
        onShareMoment={handleShareMoment}
        hasMoment={!!journalText.trim()}
      />

      {showShareCard && (
        <ShareCard
          content={shareContent}
          type={shareType}
          onShare={handlePerformShare}
          onCancel={() => setShowShareCard(false)}
        />
      )}

      {showAfterShare && (
        <AfterShare
          onClose={() => setShowAfterShare(false)}
          sharedContent={shareContent}
        />
      )}
    </div>
  );
}

