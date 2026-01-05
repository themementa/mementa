import { requireUser } from "@/lib/auth";
import { SharedMomentReceiver } from "@/components/share/shared-moment-receiver";

type SharePageProps = {
  params: {
    id: string;
  };
  searchParams: {
    type?: "quote" | "moment";
    content?: string;
  };
};

export default async function SharePage({ params, searchParams }: SharePageProps) {
  // Note: In a real implementation, you would fetch the shared content by ID
  // For now, we'll use searchParams for simplicity
  const type = searchParams.type || "quote";
  const content = searchParams.content || "";

  // Decode content if it's URL encoded
  const decodedContent = content ? decodeURIComponent(content) : "";

  return (
    <SharedMomentReceiver
      type={type as "quote" | "moment"}
      content={decodedContent}
    />
  );
}

