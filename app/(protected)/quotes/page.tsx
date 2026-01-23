import { requireUser } from "../../../lib/auth";
import { getAllQuotes } from "../../../lib/quotes";
import { getFavoriteQuoteIdsForUser } from "../../../lib/favorites";
import { QuotesPage } from "../../../components/pages/quotes-page";

export default async function QuotesPageServer() {
  try {
    const user = await requireUser();
    const quotes = await getAllQuotes();
    const favoriteIds = await getFavoriteQuoteIdsForUser(user.id);
    return <QuotesPage quotes={quotes} favoriteIds={favoriteIds} />;
  } catch (error) {
    console.error("[quotes/page] server error:", error);
    throw error;
  }
}


