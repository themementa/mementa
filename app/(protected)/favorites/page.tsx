import { requireUser } from "@/lib/auth";
import { getFavoriteQuotesForUser } from "@/lib/favorites";
import { FavoritesPage } from "@/components/pages/favorites-page";

export default async function FavoritesPageServer() {
  // Middleware handles auth redirects, but we need user for favorites
  const user = await requireUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const quotes = await getFavoriteQuotesForUser(user.id);

  return <FavoritesPage quotes={quotes} />;
}


