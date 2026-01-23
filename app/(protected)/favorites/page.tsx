import { requireUser } from "../../../lib/auth";
import { getFavoriteQuotesForUser } from "../../../lib/favorites";
import { FavoritesPage } from "../../../components/pages/favorites-page";

export default async function FavoritesPageServer() {
  try {
    const user = await requireUser();
    const quotes = await getFavoriteQuotesForUser(user.id);
    return <FavoritesPage quotes={quotes} />;
  } catch (error) {
    console.error("[favorites/page] server error:", error);
    throw error;
  }
}


