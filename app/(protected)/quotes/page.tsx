import { requireUser } from "@/lib/auth";
import { getAllQuotes, getFirstAvailableQuote, type Quote } from "@/lib/quotes";
import { getFavoriteQuoteIdsForUser } from "@/lib/favorites";
import { ensureQuotesSeeded } from "@/lib/seed-quotes";
import { QuotesPage } from "@/components/pages/quotes-page";

/**
 * Quotes Page Server Component
 * 
 * Data Flow:
 * - getAllQuotes(): User's personal quote library (seeded from system master)
 * - getFavoriteQuoteIdsForUser(): User-specific favorites (for display state only)
 * 
 * Note: Authentication is required to access this page (protected route).
 * getAllQuotes ensures user quotes are seeded before returning.
 */
export default async function QuotesPageServer() {
  // Authentication is required to access this page (protected route)
  // Middleware handles auth redirects, but we still need user for favorites
  const user = await requireUser();
  if (!user) {
    // This should never happen due to middleware, but TypeScript requires the check
    throw new Error("Unauthorized");
  }
  
  // Ensure system master quotes exist (source for user seeding)
  await ensureQuotesSeeded();
  
  // Get all user quotes (getAllQuotes ensures seeding before returning)
  let quotes: Quote[] = [];
  try {
    quotes = await getAllQuotes();
    
    // CRITICAL FIX: If quotes array is empty but data exists, try to get first available quote
    // This ensures UI always renders content if data exists in database
    if (!quotes || quotes.length === 0) {
      const fallbackQuote = await getFirstAvailableQuote();
      if (fallbackQuote) {
        quotes = [fallbackQuote];
      }
    }
  } catch (quotesError) {
    // If getAllQuotes fails, try fallback
    console.warn("[QuotesPageServer] Failed to get all quotes, trying fallback:", quotesError);
    const fallbackQuote = await getFirstAvailableQuote();
    if (fallbackQuote) {
      quotes = [fallbackQuote];
    } else {
      quotes = [];
    }
  }
  
  // Get user's favorite IDs (only for display state - to show which quotes are favorited)
  // CRITICAL FIX: If getFavoriteQuoteIdsForUser fails, use empty array as fallback
  // This ensures new users (with no favorites) still see the quote library
  let favoriteIds: string[] = [];
  try {
    favoriteIds = await getFavoriteQuoteIdsForUser(user.id);
  } catch (favoriteError) {
    // Log but don't fail - favorites are optional, quote library display should continue
    console.warn("[QuotesPageServer] Failed to load favorites, using empty array:", favoriteError);
  }

  return <QuotesPage quotes={quotes} favoriteIds={favoriteIds} />;
}


