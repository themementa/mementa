import { requireUser } from "@/lib/auth";
import { getAllQuotes } from "@/lib/quotes";
import { getFavoriteQuoteIdsForUser } from "@/lib/favorites";
import { filterRelationshipQuotes } from "@/lib/quotes-relationship";
import { RelationshipPage } from "@/components/pages/relationship-page";

export default async function RelationshipPageServer() {
  // Middleware handles auth redirects, but we need user for favorites
  const user = await requireUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const allQuotes = await getAllQuotes();
  const relationshipQuotes = filterRelationshipQuotes(allQuotes);
  const favoriteIds = await getFavoriteQuoteIdsForUser(user.id);

  return <RelationshipPage quotes={relationshipQuotes} favoriteIds={favoriteIds} />;
}



