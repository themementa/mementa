import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getQuoteById } from "@/lib/quotes";
import { getFavoriteQuoteIdsForUser } from "@/lib/favorites";
import { QuoteDetailPage } from "@/components/pages/quote-detail-page";

type QuoteDetailPageProps = {
  params: { id: string };
};

export default async function QuoteDetailPageServer({ params }: QuoteDetailPageProps) {
  const user = await requireUser();
  const quote = await getQuoteById(params.id);
  const favoriteIds = await getFavoriteQuoteIdsForUser(user.id);
  const isFavorited = favoriteIds.includes(quote?.id ?? "");

  if (!quote) {
    notFound();
  }

  return <QuoteDetailPage quote={quote} isFavorited={isFavorited} />;
}


