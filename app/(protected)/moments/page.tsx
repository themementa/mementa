import { requireUser } from "@/lib/auth";
import { getAllJournalsWithQuotes } from "@/lib/journals";
import { MomentsPage } from "@/components/pages/moments-page";

export default async function MomentsPageServer() {
  // Middleware handles auth redirects, but we need user for journals
  const user = await requireUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const journals = await getAllJournalsWithQuotes(user.id);

  return <MomentsPage journals={journals} />;
}



