"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AIAAFrame, StatusPill } from "@/components/aiaa-page-kit";
import {
  communityCategories,
  communityPosts,
  communityRules,
  getCategoryBySlug,
  moderationGuardrails,
  type CommunityAttachment,
  type CommunityComment,
  type CommunityPost
} from "@/lib/community/mock-data";
import { CommunityThreadInteractions } from "@/components/community/community-interactions";
import { getStoredSession } from "@/lib/supabase/browser";

const COMMUNITY_STORAGE_KEY = "aiaa-community-local-posts";

function roleTone(role: string): "neutral" | "good" | "warn" | "bad" {
  if (role === "admin" || role === "moderator") return "warn";
  if (role === "certified member") return "good";
  return "neutral";
}

function getDisplayName() {
  const session = getStoredSession();
  const metadata = session?.user?.user_metadata ?? {};
  const name = metadata.full_name || metadata.name || metadata.user_name;
  if (typeof name === "string" && name.trim()) return name.trim();
  const email = session?.user?.email ?? "";
  if (email.includes("@")) return email.split("@")[0];
  return "Community Member";
}

function formatCategoryName(slug: string) {
  return getCategoryBySlug(slug)?.name ?? "General";
}

function AttachmentGallery({ attachments }: { attachments: CommunityAttachment[] }) {
  if (!attachments.length) return null;

  return (
    <div className={`mt-4 grid gap-3 ${attachments.length === 1 ? "grid-cols-1" : attachments.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
      {attachments.map((attachment) => (
        <div key={attachment.id} className="overflow-hidden rounded-[1rem] border border-slate-200 bg-white">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            {attachment.src ? (
              <img src={attachment.src} alt={attachment.alt} className="h-full w-full object-cover" />
            ) : (
              <div className={`flex h-full items-end bg-gradient-to-br ${attachment.tone} p-4`}>
                <div className="rounded-2xl bg-white/85 px-3 py-2 text-sm font-semibold text-slate-700">{attachment.alt}</div>
              </div>
            )}
          </div>
          {attachment.caption ? <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">{attachment.caption}</div> : null}
        </div>
      ))}
    </div>
  );
}

function CompactPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1rem] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <h3 className="text-base font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function FeedPostCard({ post }: { post: CommunityPost }) {
  const category = getCategoryBySlug(post.categorySlug);
  const isLocalPost = post.slug.startsWith("local-");

  const content = (
    <article className="border-b border-slate-200 bg-white px-5 py-5 transition hover:bg-slate-50/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-blue-700 to-cyan-500 text-sm font-semibold text-white">
            {post.author.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-950">{post.author}</span>
              <StatusPill tone={roleTone(post.role)}>{post.role}</StatusPill>
              {post.certifiedBadge ? <StatusPill tone="good">{post.certifiedBadge}</StatusPill> : null}
              {isLocalPost ? <StatusPill tone="good">new</StatusPill> : null}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              <span>{post.postedAt}</span>
              <span>•</span>
              <span>{formatCategoryName(post.categorySlug)}</span>
              <span>•</span>
              <span>{post.views} views</span>
            </div>
          </div>
        </div>
        <StatusPill tone={post.status === "pinned" ? "good" : post.status === "review-only" ? "warn" : "neutral"}>{post.status}</StatusPill>
      </div>

      <h3 className="mt-4 text-[1.15rem] font-semibold tracking-[-0.04em] text-slate-950">{post.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
      {post.attachments?.length ? <AttachmentGallery attachments={post.attachments} /> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <span><strong className="text-slate-950">{post.likeCount}</strong> likes</span>
          <span><strong className="text-slate-950">{post.replies}</strong> comments</span>
          <span><strong className="text-slate-950">{post.shareCount}</strong> shares</span>
        </div>
        <div className="hidden gap-2 sm:flex">
          <span className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Like</span>
          <span className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Comment</span>
          <span className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Share</span>
        </div>
      </div>
    </article>
  );

  return isLocalPost ? content : <Link href={`/community/posts/${post.slug}`}>{content}</Link>;
}

export function CommunityPageShell() {
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>([]);

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

  const feedPosts = useMemo(() => [...localPosts, ...communityPosts], [localPosts]);
  const openCategories = useMemo(() => communityCategories.filter((category) => category.visibility === "public"), []);
  const displayName = getDisplayName();

  return (
    <AIAAFrame>
      <div className="mx-auto w-[min(1600px,calc(100vw-24px))] px-2 py-4">
        <header className="rounded-[1rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">AIAA Community</p>
              <h1 className="text-[clamp(2rem,3vw,3rem)] font-semibold tracking-[-0.06em] text-slate-950">AIAA 社群討論牆</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                這裡是貼文、圖片、留言、按讚、分享與檢舉都很清楚的社群流。版面採像 Facebook 一樣的整頁自然捲動，左右欄與主貼文會一起跟著頁面流動。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/community/create" className="aiaa-button-dark">
                發文
              </Link>
              <StatusPill tone="good">{feedPosts.length} posts</StatusPill>
              <StatusPill tone="warn">Human moderation</StatusPill>
            </div>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
          <aside className="pr-1">
            <div className="space-y-4">
              <CompactPanel title="社區頻道">
                <div className="space-y-3">
                  {communityCategories.map((category) => (
                    <div key={category.slug} className="rounded-[0.9rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-950">{category.name}</div>
                        <StatusPill tone={category.visibility === "public" ? "good" : "warn"}>{category.visibility}</StatusPill>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                    </div>
                  ))}
                </div>
              </CompactPanel>

              <CompactPanel title="熱門話題">
                <div className="flex flex-wrap gap-2">
                  {["Level 1 evidence", "AI agents", "debugging", "showcase", "support", "certification"].map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </CompactPanel>

              <CompactPanel title="社群狀態">
                <div className="space-y-3 text-sm leading-6 text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>公開分類</span>
                    <strong className="text-slate-950">{openCategories.length}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>目前貼文數</span>
                    <strong className="text-slate-950">{feedPosts.length}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>本機自建貼文</span>
                    <strong className="text-slate-950">{localPosts.length}</strong>
                  </div>
                </div>
              </CompactPanel>
            </div>
          </aside>

          <main className="pr-1">
            <div className="sticky top-4 z-10 bg-[var(--aiaa-bg)] pb-3">
              <div className="rounded-[1rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    {displayName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-950">{displayName}</div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">想發什麼？分享圖片、討論、提問都可以</div>
                  </div>
                  <Link href="/community/create" className="aiaa-button-light">
                    建立貼文
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-0 overflow-hidden rounded-[1rem] border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
              {feedPosts.map((post) => (
                <FeedPostCard key={post.slug} post={post} />
              ))}
            </div>
          </main>

          <aside className="pl-1">
            <div className="space-y-4">
              <CompactPanel title="為什麼這樣更安全">
                <div className="space-y-3 text-sm leading-6 text-slate-600">
                  {moderationGuardrails.map((guardrail) => (
                    <p key={guardrail}>{guardrail}</p>
                  ))}
                </div>
              </CompactPanel>

              <CompactPanel title="使用方式">
                <div className="space-y-3 text-sm leading-6 text-slate-600">
                  <p>按右上角「發文」進入獨立發文頁。</p>
                  <p>發文後貼文會先出現在本機 feed。</p>
                  <p>點貼文可進入完整討論串頁。</p>
                </div>
              </CompactPanel>

              <CompactPanel title="規則">
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  {communityRules.slice(0, 4).map((rule) => (
                    <li key={rule}>• {rule}</li>
                  ))}
                </ul>
              </CompactPanel>
            </div>
          </aside>
        </div>
      </div>
    </AIAAFrame>
  );
}

export function CommunityPostDetailShell({ post }: { post: CommunityPost }) {
  const [comments, setComments] = useState<CommunityComment[]>(post.comments);
  const category = getCategoryBySlug(post.categorySlug);

  function handleAddComment(comment: CommunityComment) {
    setComments((current) => [...current, comment]);
  }

  return (
    <AIAAFrame>
      <div className="mx-auto w-[min(1400px,calc(100vw-24px))] px-2 py-4">
        <div className="mb-4 rounded-[1rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Community Thread</p>
              <h1 className="text-[clamp(1.9rem,2.8vw,2.8rem)] font-semibold tracking-[-0.06em] text-slate-950">{post.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{post.excerpt}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/community" className="aiaa-button-light">返回社群</Link>
              <Link href="/community/create" className="aiaa-button-dark">發文</Link>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <article className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <strong className="text-slate-950">{post.author}</strong>
                <StatusPill tone={roleTone(post.role)}>{post.role}</StatusPill>
                {category ? <StatusPill tone={category.visibility === "public" ? "good" : "warn"}>{category.name}</StatusPill> : null}
                {post.certifiedBadge ? <StatusPill tone="good">{post.certifiedBadge}</StatusPill> : null}
              </div>
              <div className="mt-5 space-y-4 text-base leading-8 text-slate-700">
                {post.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {post.attachments?.length ? <AttachmentGallery attachments={post.attachments} /> : null}
              {post.links?.length ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {post.links.map((link) => (
                    <Link key={link.href} href={link.href} className="aiaa-button-light">
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </article>

            <CompactPanel title="留言與互動">
              <div className="space-y-4">
                <p className="text-sm leading-6 text-slate-600">
                  留言區現在放在貼文底下，和 Facebook 一樣先看內容，再往下看評論、按讚、分享與檢舉。
                </p>
                <CommunityThreadInteractions post={post} comments={comments} onAddComment={handleAddComment} />
              </div>
            </CompactPanel>
          </div>

          <div className="space-y-4">
            <CompactPanel title="Thread summary">
              <div className="space-y-3 text-sm leading-6 text-slate-600">
                <div className="flex items-center justify-between gap-3"><span>Likes</span><strong className="text-slate-950">{post.likeCount}</strong></div>
                <div className="flex items-center justify-between gap-3"><span>Comments</span><strong className="text-slate-950">{comments.length}</strong></div>
                <div className="flex items-center justify-between gap-3"><span>Shares</span><strong className="text-slate-950">{post.shareCount}</strong></div>
                <div className="flex items-center justify-between gap-3"><span>Reports</span><strong className="text-slate-950">{post.reportCount}</strong></div>
              </div>
            </CompactPanel>

            <CompactPanel title="Why this looks familiar">
              <div className="space-y-3 text-sm leading-6 text-slate-600">
                <p>Facebook 也是先放貼文，再把留言區接在內容下面，不會把主要互動放成右側欄位。</p>
                <p>這個頁面已經改成同樣的閱讀順序，讓使用者往下滑就能自然看到留言。</p>
                <p>右欄只保留摘要與安全說明，避免搶走主內容焦點。</p>
              </div>
            </CompactPanel>
          </div>
        </div>
      </div>
    </AIAAFrame>
  );
}
