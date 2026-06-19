"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AIAAFrame, StatusPill } from "@/components/aiaa-page-kit";
import { CommunityComposer } from "@/components/community/community-interactions";
import { communityCategories, communityPosts, type CommunityAttachment, type CommunityPost } from "@/lib/community/mock-data";
import { getStoredSession } from "@/lib/supabase/browser";

const COMMUNITY_STORAGE_KEY = "aiaa-community-local-posts";

function getDisplayName() {
  const session = getStoredSession();
  const metadata = session?.user?.user_metadata ?? {};
  const name = metadata.full_name || metadata.name || metadata.user_name;
  if (typeof name === "string" && name.trim()) return name.trim();
  const email = session?.user?.email ?? "";
  if (email.includes("@")) return email.split("@")[0];
  return "Community Member";
}

export default function CommunityCreatePage() {
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>([]);
  const [lastCreated, setLastCreated] = useState<CommunityPost | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(COMMUNITY_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CommunityPost[];
      setLocalPosts(Array.isArray(parsed) ? parsed : []);
    } catch {
      setLocalPosts([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(localPosts));
  }, [localPosts]);

  const displayName = useMemo(() => getDisplayName(), []);

  function handleCreatePost(payload: { categorySlug: string; title: string; body: string; attachments: CommunityAttachment[] }) {
    const now = Date.now();
    const nextPost: CommunityPost = {
      slug: `local-${now}`,
      categorySlug: payload.categorySlug,
      title: payload.title,
      excerpt: payload.body.slice(0, 280),
      body: [payload.body],
      author: displayName,
      role: "registered user",
      postedAt: "Just now",
      status: "active",
      tags: ["community", "member-post"],
      replies: 0,
      views: 1,
      likeCount: 0,
      shareCount: 0,
      reportCount: 0,
      attachments: payload.attachments,
      comments: []
    };

    setLocalPosts((current) => [nextPost, ...current]);
    setLastCreated(nextPost);
  }

  return (
    <AIAAFrame>
      <div className="mx-auto w-[min(1360px,calc(100vw-24px))] px-2 py-4">
        <div className="mb-4 rounded-[1rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">AIAA Community</p>
              <h1 className="text-[clamp(1.9rem,2.8vw,2.8rem)] font-semibold tracking-[-0.06em] text-slate-950">建立貼文</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                這是獨立發文頁。你可以在這裡寫貼文、上傳圖片，按下發文後回到社群牆就會看到新內容。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/community" className="aiaa-button-light">
                返回社群
              </Link>
              <StatusPill tone="good">{communityPosts.length + localPosts.length} total posts</StatusPill>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-[1rem] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
            <CommunityComposer categories={communityCategories} onCreatePost={handleCreatePost} />
          </div>

          <div className="space-y-4">
            <section className="rounded-[1rem] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
              <h2 className="text-base font-semibold tracking-[-0.03em] text-slate-950">發文前預覽</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                這個頁面比較像 Facebook 的建立貼文視窗，左邊輸入，右邊看規則與貼文狀態。
              </p>
              <div className="mt-4 rounded-[0.9rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                <p><strong className="text-slate-950">貼文作者：</strong>{displayName}</p>
                <p className="mt-2"><strong className="text-slate-950">圖片：</strong>可以直接選本機圖片，發完會保留在本機 feed。</p>
                <p className="mt-2"><strong className="text-slate-950">安全性：</strong>不雅、冒犯、秘密字串都會先攔掉。</p>
              </div>
            </section>

            <section className="rounded-[1rem] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
              <h2 className="text-base font-semibold tracking-[-0.03em] text-slate-950">最近建立的貼文</h2>
              <div className="mt-4 space-y-3">
                {lastCreated ? (
                  <div className="rounded-[0.9rem] border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="text-sm font-semibold text-slate-950">{lastCreated.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{lastCreated.excerpt}</div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Link href={`/community/posts/${lastCreated.slug}`} className="aiaa-button-dark">
                        開啟貼文
                      </Link>
                      <Link href="/community" className="aiaa-button-light">
                        回到社群牆
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-slate-600">還沒有建立貼文。完成表單後這裡會顯示你剛剛送出的內容。</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AIAAFrame>
  );
}
