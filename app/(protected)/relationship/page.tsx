import { requireUser } from "@/lib/auth";
import { getAllQuotes } from "@/lib/quotes";
import { getFavoriteQuoteIdsForUser } from "@/lib/favorites";
import { filterRelationshipQuotes } from "@/lib/quotes-relationship";
import { RelationshipPage } from "@/components/pages/relationship-page";

export default async function RelationshipPageServer() {
  const user = await requireUser();
  const allQuotes = await getAllQuotes();
  const relationshipQuotes = filterRelationshipQuotes(allQuotes);
  const favoriteIds = await getFavoriteQuoteIdsForUser(user.id);

  return <RelationshipPage quotes={relationshipQuotes} favoriteIds={favoriteIds} />;
}



