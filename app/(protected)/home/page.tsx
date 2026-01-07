import { requireUser } from "@/lib/auth";
import { getFavoriteQuoteIdsForUser } from "@/lib/favorites";
import { getTodaysQuoteAction } from "@/actions/daily-quote-actions";
import { TodaysQuoteDisplay } from "@/components/quotes/todays-quote-display";
import { HomeEmptyState } from "@/components/pages/home-empty-state";

/**
 * Next.js 14 App Router: Dynamic route configuration
 * 
 * Why "force-dynamic":
 * - This page requires authentication (requireUser())
 * - It fetches user-specific data (favorites, today's quote)
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
    const user = await requireUser();
    
    // Get today's quote (always from all quotes, not dependent on favorites)
    const todaysQuote = await getTodaysQuoteAction();
    
    // Get favorite IDs separately (only for display state, not for selection)
    const favoriteIds = await getFavoriteQuoteIdsForUser(user.id);

    // focusMoment is handled client-side via localStorage in TodaysQuoteDisplay component
    return <TodaysQuoteDisplay quote={todaysQuote} favoriteIds={favoriteIds} />;
  } catch (error) {
    console.error("[HomePage] 錯誤:", error);
    // Only show empty state if there are truly no quotes in the database
    // Check if it's a "No quotes available" error
    if (error instanceof Error && error.message === "No quotes available") {
      return <HomeEmptyState />;
    }
    // For other errors, still try to show the page (might be auth issue)
    throw error;
  }
}