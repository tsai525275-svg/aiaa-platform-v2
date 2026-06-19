import { notFound } from "next/navigation";
import { CommunityPostDetailShell } from "@/components/community/community-shell";
import { communityPosts, getPostBySlug } from "@/lib/community/mock-data";

export function generateStaticParams() {
  return communityPosts.map((post) => ({ slug: post.slug }));
}

export default async function CommunityPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return <CommunityPostDetailShell post={post} />;
}
