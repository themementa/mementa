import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getQuoteById } from "@/lib/quotes";
import { getFavoriteQuoteIdsForUser } from "@/lib/favorites";
import { QuoteDetailPage } from "@/components/pages/quote-detail-page";

type QuoteDetailPageProps = {
  params: { id: string };
};

export default async function QuoteDetailPageServer({ params }: QuoteDetailPageProps) {
  // Middleware handles auth redirects, but we need user for favorites
  const user = await requireUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const quote = await getQuoteById(params.id);
  const favoriteIds = await getFavoriteQuoteIdsForUser(user.id);
  const isFavorited = favoriteIds.includes(quote?.id ?? "");

  if (!quote) {
    notFound();
  }

  return <QuoteDetailPage quote={quote} isFavorited={isFavorited} />;
}


