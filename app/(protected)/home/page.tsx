import { requireUser } from "@/lib/auth";
import { getFavoriteQuoteIdsForUser } from "@/lib/favorites";
import { getTodaysQuoteAction } from "@/actions/daily-quote-actions";
import { getFirstAvailableQuote } from "@/lib/quotes";
import { TodaysQuoteDisplay } from "@/components/quotes/todays-quote-display";
import { HomeEmptyState } from "@/components/pages/home-empty-state";

/**
 * Next.js 14 App Router: Dynamic route configuration
 * 
 * Why "force-dynamic":
 * - This page requires authentication (requireUser()) for access control
 * - Today's quote is GLOBAL (same for all users), not user-specific
 * - Only favorites are user-specific (for display state, not quote selection)
 * - It must run on every request to ensure fresh data
 * - Prevents static generation that would cache user-specific content
 */
export const dynamic = "force-dynamic";

/**
 * HomePage - Main authenticated home page
 * 
 * Type Safety Note:
 * - No props are accepted (Next.js 14 App Router pages without params/searchParams)
 * - Explicit return type prevents Next.js from inferring phantom PageProps
 * - The "HomePageProps | undefined" error occurs when Next.js type system
 *   caches inferred types from compiled JS, even after source code changes.
 * 
 * Fix Explanation:
 * - Using traditional function declaration (not arrow function) ensures Next.js
 *   type system correctly infers the function signature from the compiled JS
 * - Empty parameter list () explicitly tells TypeScript this function takes no arguments
 * - Explicit return type Promise<JSX.Element> prevents union type inference
 * - The combination of () and explicit return type forces FirstArg<TEntry['default']>
 *   to resolve to never (no parameters), which satisfies Diff<PageProps, never>
 *   because PageProps is assignable to never when the function has no parameters
 */
export default async function HomePage(): Promise<JSX.Element> {
  try {
    // Authentication is required to access this page (protected route)
    // Middleware handles auth redirects, but we still need user for favorites
    const user = await requireUser();
    if (!user) {
      // This should never happen due to middleware, but TypeScript requires the check
      throw new Error("Unauthorized");
    }
    
    // Get today's quote (GLOBAL - same for all users, from all quotes)
    // This does NOT depend on userId or user's favorites
    let todaysQuote;
    try {
      todaysQuote = await getTodaysQuoteAction();
    } catch (quoteError) {
      // CRITICAL FIX: If getTodaysQuoteAction fails, try to get first available quote
      // This ensures UI always renders content if data exists in database
      console.warn("[HomePage] Failed to get today's quote, trying fallback:", quoteError);
      const fallbackQuote = await getFirstAvailableQuote();
      if (fallbackQuote) {
        todaysQuote = fallbackQuote;
      } else {
        // Only show empty state if database truly has no quotes
        return <HomeEmptyState />;
      }
    }
    
    // Get favorite IDs separately (only for display state - to show if quote is favorited)
    // This is user-specific but does not affect quote selection
    // CRITICAL FIX: If getFavoriteQuoteIdsForUser fails, use empty array as fallback
    // This ensures new users (with no favorites) still see the quote
    let favoriteIds: string[] = [];
    try {
      favoriteIds = await getFavoriteQuoteIdsForUser(user.id);
    } catch (favoriteError) {
      // Log but don't fail - favorites are optional, quote display should continue
      console.warn("[HomePage] Failed to load favorites, using empty array:", favoriteError);
    }

    // focusMoment is handled client-side via localStorage in TodaysQuoteDisplay component
    return <TodaysQuoteDisplay quote={todaysQuote} favoriteIds={favoriteIds} />;
  } catch (error) {
    console.error("[HomePage] 錯誤:", error);
    
    // For auth errors, redirect is handled by requireUser() in layout
    // For other errors, try fallback before showing empty state
    if (error instanceof Error && error.message !== "No quotes available") {
      try {
        const fallbackQuote = await getFirstAvailableQuote();
        if (fallbackQuote) {
          // If we can get any quote, render it instead of showing error
          return <TodaysQuoteDisplay quote={fallbackQuote} favoriteIds={[]} />;
        }
      } catch (fallbackError) {
        console.error("[HomePage] Fallback also failed:", fallbackError);
      }
    }
    
    // Only show empty state if database truly has no quotes
    if (error instanceof Error && error.message === "No quotes available") {
      return <HomeEmptyState />;
    }
    
    // For other errors, re-throw to show error page
    throw error;
  }
}