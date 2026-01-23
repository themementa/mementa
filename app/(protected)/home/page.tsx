import { requireUser } from "../../../lib/auth";
import { HomeEmptyState } from "../../../components/pages/home-empty-state";

export default async function HomePage() {
  try {
    await requireUser();
    return <HomeEmptyState />;
  } catch (error) {
    console.error("[home/page] server error:", error);
    throw error;
  }
}
