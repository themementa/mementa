import { requireUser } from "@/lib/auth";
import { getAllJournalsWithQuotes } from "@/lib/journals";
import { MomentsPage } from "@/components/pages/moments-page";

export default async function MomentsPageServer() {
  const user = await requireUser();
  const journals = await getAllJournalsWithQuotes(user.id);

  return <MomentsPage journals={journals} />;
}



