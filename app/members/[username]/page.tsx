import { AIAAFrame } from "@/components/aiaa-page-kit";
import { PublicMemberProfile } from "@/components/member-dashboard";

export default async function PublicMemberPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return (
    <AIAAFrame>
      <PublicMemberProfile username={username} />
    </AIAAFrame>
  );
}
