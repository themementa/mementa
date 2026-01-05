import { requireUser } from "@/lib/auth";
import { getFavoriteQuoteIdsForUser } from "@/lib/favorites";
import { getTodaysQuoteAction } from "@/actions/daily-quote-actions";
import { TodaysQuoteDisplay } from "@/components/quotes/todays-quote-display";
import { HomeEmptyState } from "@/components/pages/home-empty-state";

type HomePageProps = {
  searchParams?: {
    focus?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps = {}) {
  try {
    const user = await requireUser();
    
    // Get today's quote (always from all quotes, not dependent on favorites)
    const todaysQuote = await getTodaysQuoteAction();
    
    // Get favorite IDs separately (only for display state, not for selection)
    const favoriteIds = await getFavoriteQuoteIdsForUser(user.id);

    const focusMoment = searchParams?.focus === "moment";

    return <TodaysQuoteDisplay quote={todaysQuote} favoriteIds={favoriteIds} focusMoment={focusMoment} />;
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

