import { requireUser } from "@/lib/auth";
import { getFavoriteQuotesForUser } from "@/lib/favorites";
import { FavoritesPage } from "@/components/pages/favorites-page";

export default async function FavoritesPageServer() {
  const user = await requireUser();
  const quotes = await getFavoriteQuotesForUser(user.id);

  return <FavoritesPage quotes={quotes} />;
}


