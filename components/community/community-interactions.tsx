"use client";

import { useEffect, useMemo, useState } from "react";
import { getStoredSession } from "@/lib/supabase/browser";
import type { CommunityAttachment, CommunityCategory, CommunityComment, CommunityPost } from "@/lib/community/mock-data";
import { reportReasonOptions } from "@/lib/community/mock-data";

const blockedTerms = [
  "idiot",
  "stupid",
  "trash",
  "hate you",
  "kill yourself",
  "白癡",
  "笨蛋",
  "智障",
  "垃圾",
  "幹你",
  "去死"
];

function simulateUnsafeInput(value: string) {
  return /(api[_ -]?key|secret|token|password)/i.test(value);
}

function simulateAbusiveInput(value: string) {
  const normalized = value.trim().toLowerCase();
  return blockedTerms.some((term) => normalized.includes(term.toLowerCase()));
}

function MockImageCard({ tone, alt, caption }: { tone: string; alt: string; caption?: string }) {
  return (
    <div className={`overflow-hidden rounded-[1.75rem] border border-slate-200 bg-gradient-to-br ${tone}`}>
      <div className="flex aspect-[4/3] items-end p-4">
        <div className="rounded-2xl bg-white/82 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">{alt}</div>
      </div>
      {caption ? <div className="border-t border-white/50 bg-white/70 px-4 py-3 text-sm text-slate-600">{caption}</div> : null}
    </div>
  );
}

type LocalImagePreview = {
  id: string;
  name: string;
  previewUrl: string;
};

type CommunityDraftPayload = {
  categorySlug: string;
  title: string;
  body: string;
  attachments: CommunityAttachment[];
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error(`Unable to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function getCommunityDisplayName() {
  const session = getStoredSession();
  const metadata = session?.user?.user_metadata ?? {};
  const name = metadata.full_name || metadata.name || metadata.user_name;
  if (typeof name === "string" && name.trim()) return name.trim();
  const email = session?.user?.email ?? "";
  if (email.includes("@")) return email.split("@")[0];
  return "AIAA Member";
}

export function CommunityComposer({
  categories,
  onCreatePost
}: {
  categories: CommunityCategory[];
  onCreatePost: (payload: CommunityDraftPayload) => void;
}) {
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted" | "error" | "abuse">("idle");
  const [mockImages] = useState([
    { id: "draft-1", tone: "from-slate-100 via-blue-100 to-white", alt: "Draft image slot 1", caption: "Local-safe image preview" }
  ]);
  const [uploadedImages, setUploadedImages] = useState<LocalImagePreview[]>([]);

  const currentCategory = useMemo(
    () => categories.find((category) => category.slug === categorySlug) ?? null,
    [categories, categorySlug]
  );

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [uploadedImages]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    event.target.value = "";

    const remaining = Math.max(0, 4 - uploadedImages.length);
    const nextFiles = files.slice(0, remaining);

    const nextImages = await Promise.all(
      nextFiles.map(async (file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        previewUrl: await readFileAsDataUrl(file)
      }))
    );

    setUploadedImages((current) => [...current, ...nextImages]);
  }

  function removeUploadedImage(imageId: string) {
    setUploadedImages((current) => {
      const target = current.find((image) => image.id === imageId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((image) => image.id !== imageId);
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !body.trim() || simulateUnsafeInput(body) || simulateUnsafeInput(title)) {
      setStatus("error");
      return;
    }
    if (simulateAbusiveInput(body) || simulateAbusiveInput(title)) {
      setStatus("abuse");
      return;
    }
    onCreatePost({
      categorySlug,
      title: title.trim(),
      body: body.trim(),
      attachments: uploadedImages.map((image, index) => ({
        id: image.id,
        kind: "image",
        alt: image.name || `Uploaded image ${index + 1}`,
        tone: "from-slate-100 via-blue-100 to-white",
        caption: "User uploaded image",
        src: image.previewUrl
      }))
    });
    setTitle("");
    setBody("");
    setUploadedImages([]);
    setStatus("submitted");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Create post</p>
        <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Post to the community feed</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          這個版本已經有貼文輸入、圖片選取預覽、按讚留言分享互動原型，但目前仍是本機安全模式，不會直接發到正式社群資料庫。
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.92fr]">
        <div className="space-y-5">
          <label className="block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Category</span>
            <select
              aria-label="Choose forum category"
              value={categorySlug}
              onChange={(event) => setCategorySlug(event.target.value)}
              className="mt-3 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Post title</span>
            <input
              aria-label="Community post title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Describe your question, project, or discussion topic"
              className="mt-3 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
            />
          </label>

          <label className="block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Post body</span>
            <textarea
              aria-label="Community post body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={7}
              placeholder="Keep it evidence-based. Do not share API keys, do not attack other users, and do not make fake certification claims."
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            <strong className="text-slate-900">Posting policy:</strong> {currentCategory?.postingPolicy}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            <strong className="text-slate-900">Language safety:</strong> obscene language, personal insults, fake certification claims, and secret leakage are blocked before a local draft is accepted.
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Image attachments</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">這裡可以直接選本機圖片做貼文預覽，呈現更接近 Facebook / Dcard 的多圖貼文體驗。</p>
              </div>
              <label className="inline-flex cursor-pointer rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--aiaa-blue)] hover:text-[var(--aiaa-blue)]">
                Select images
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {mockImages.map((image) => (
                <MockImageCard key={image.id} tone={image.tone} alt={image.alt} caption={image.caption} />
              ))}
              {uploadedImages.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={image.previewUrl} alt={image.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(image.id)}
                      className="absolute right-3 top-3 rounded-lg bg-slate-950/72 px-3 py-1 text-xs font-semibold text-white"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">{image.name}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">最多 4 張。這裡是本機預覽，不會上傳到 production。</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="aiaa-button-dark">
          Post to community feed
        </button>
        <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400">
          Production publish pending backend
        </button>
      </div>

      {status === "submitted" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
          貼文已加入目前這個社群頁的 feed，圖片預覽也已保留。這一版仍未寫入 production forum backend。
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-800">
          Draft blocked. Add both title and body, and remove anything that looks like a secret or credential.
        </div>
      ) : null}

      {status === "abuse" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
          Draft blocked for civility review. Please remove obscene wording, personal attacks, or disrespectful language before continuing.
        </div>
      ) : null}
    </form>
  );
}

export function ReplyAndReportPanel({ post }: { post: CommunityPost }) {
  const [reply, setReply] = useState("");
  const [reportReason, setReportReason] = useState<string>(reportReasonOptions[0]);
  const [lastAction, setLastAction] = useState<"" | "reply" | "report" | "error" | "abuse">("");
  const [likedPost, setLikedPost] = useState(false);
  const [sharedPost, setSharedPost] = useState(false);
  const [postLikes, setPostLikes] = useState(post.likeCount);
  const [shareCount, setShareCount] = useState(Math.max(1, Math.floor(post.likeCount / 4)));
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(
    Object.fromEntries(post.comments.map((comment) => [comment.id, comment.likeCount]))
  );

  function togglePostLike() {
    setLikedPost((current) => !current);
    setPostLikes((current) => current + (likedPost ? -1 : 1));
  }

  function toggleCommentLike(commentId: string) {
    setCommentLikes((current) => ({
      ...current,
      [commentId]: (current[commentId] ?? 0) + 1
    }));
  }

  function toggleShare() {
    setSharedPost((current) => !current);
    setShareCount((current) => current + (sharedPost ? -1 : 1));
  }

  function handleReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reply.trim() || simulateUnsafeInput(reply)) {
      setLastAction("error");
      return;
    }
    if (simulateAbusiveInput(reply)) {
      setLastAction("abuse");
      return;
    }
    setLastAction("reply");
  }

  function handleReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reportReason.trim()) {
      setLastAction("error");
      return;
    }
    setLastAction("report");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Social interaction</p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Like, comment, and report patterns</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={togglePostLike} className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${likedPost ? "border-[var(--aiaa-blue)] bg-blue-50 text-[var(--aiaa-blue)]" : "border-slate-200 bg-white text-slate-700 hover:border-[var(--aiaa-blue)]"}`}>
              {likedPost ? "Liked" : "Like"} · {postLikes}
            </button>
            <button
              type="button"
              onClick={toggleShare}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${sharedPost ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700"}`}
            >
              {sharedPost ? "Shared" : "Share"} · {shareCount}
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <div className="font-semibold text-slate-950">{postLikes}</div>
            <div className="mt-1">post likes</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <div className="font-semibold text-slate-950">{post.replies}</div>
            <div className="mt-1">comment threads</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <div className="font-semibold text-slate-950">{shareCount}</div>
            <div className="mt-1">shares</div>
          </div>
        </div>
      </div>

      {post.comments.length ? (
        <div className="grid gap-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="aiaa-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">{comment.author}</div>
                  <div className="mt-1 text-sm text-slate-500">{comment.postedAt}</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => toggleCommentLike(comment.id)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--aiaa-blue)] hover:text-[var(--aiaa-blue)]">
                    Like · {commentLikes[comment.id] ?? comment.likeCount}
                  </button>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
                    Reports · {comment.reportCount}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{comment.body}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <form onSubmit={handleReply} className="aiaa-card p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Reply UI</p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Prepare a reply</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">這個區塊模擬真實社群留言區。可以先寫留言草稿、做禮貌與不雅文字攔截，再決定未來怎麼接正式後端。</p>
          <textarea
            aria-label={`Reply to ${post.title}`}
            rows={5}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder="Reply respectfully. Do not insult other users, impersonate AIAA staff, or share secrets."
            className="mt-4 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="aiaa-button-dark">Save local comment draft</button>
            <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400">
              Live reply blocked
            </button>
          </div>
        </form>

        <form onSubmit={handleReport} className="aiaa-card p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Report content UI</p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Send to moderation review</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Reports are represented safely here. No automatic deletion, blocking, or user ban action will occur.</p>
          <label className="mt-4 block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Report reason</span>
            <select
              aria-label={`Report reason for ${post.title}`}
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              className="mt-3 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
            >
              {reportReasonOptions.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="aiaa-button-light">Create local moderation note</button>
            <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400">
              Auto removal blocked
            </button>
          </div>
        </form>
      </div>

      {lastAction === "reply" ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
          本機留言草稿已保存。沒有發出任何 production community write。
        </div>
      ) : null}
      {lastAction === "report" ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
          本機檢舉紀錄已建立，原因是「{reportReason}」。未來正式版可把它送進人工 moderation queue。
        </div>
      ) : null}
      {lastAction === "error" ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-800">
          Action blocked. Add content and remove anything that looks like a secret or credential.
        </div>
      ) : null}
      {lastAction === "abuse" ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
          Reply blocked for civility review. Remove obscene wording, disrespectful language, or personal attacks before continuing.
        </div>
      ) : null}
    </div>
  );
}

export function CommunityThreadInteractions({
  post,
  comments,
  onAddComment
}: {
  post: CommunityPost;
  comments: CommunityComment[];
  onAddComment: (comment: CommunityComment) => void;
}) {
  const [reply, setReply] = useState("");
  const [reportReason, setReportReason] = useState<string>(reportReasonOptions[0]);
  const [lastAction, setLastAction] = useState<"" | "reply" | "report" | "error" | "abuse">("");
  const [likedPost, setLikedPost] = useState(false);
  const [sharedPost, setSharedPost] = useState(false);
  const [postLikes, setPostLikes] = useState(post.likeCount);
  const [shareCount, setShareCount] = useState(post.shareCount);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(
    Object.fromEntries(comments.map((comment) => [comment.id, comment.likeCount]))
  );

  useEffect(() => {
    setCommentLikes(Object.fromEntries(comments.map((comment) => [comment.id, comment.likeCount])));
  }, [comments]);

  function togglePostLike() {
    setLikedPost((current) => !current);
    setPostLikes((current) => current + (likedPost ? -1 : 1));
  }

  function toggleCommentLike(commentId: string) {
    setCommentLikes((current) => ({
      ...current,
      [commentId]: (current[commentId] ?? 0) + 1
    }));
  }

  function toggleShare() {
    setSharedPost((current) => !current);
    setShareCount((current) => current + (sharedPost ? -1 : 1));
  }

  function handleReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reply.trim() || simulateUnsafeInput(reply)) {
      setLastAction("error");
      return;
    }
    if (simulateAbusiveInput(reply)) {
      setLastAction("abuse");
      return;
    }

    onAddComment({
      id: `local-comment-${Date.now()}`,
      author: getCommunityDisplayName(),
      role: "registered user",
      postedAt: "Just now",
      body: reply.trim(),
      moderationStatus: "visible",
      likeCount: 0,
      reportCount: 0
    });
    setReply("");
    setLastAction("reply");
  }

  function handleReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reportReason.trim()) {
      setLastAction("error");
      return;
    }
    setLastAction("report");
  }

  return (
    <div className="space-y-5">
      <div className="aiaa-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Social interaction</p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Like, comment, share, and report</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={togglePostLike} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${likedPost ? "border-[var(--aiaa-blue)] bg-blue-50 text-[var(--aiaa-blue)]" : "border-slate-200 bg-white text-slate-700 hover:border-[var(--aiaa-blue)]"}`}>
              {likedPost ? "Liked" : "Like"} · {postLikes}
            </button>
            <button
              type="button"
              onClick={toggleShare}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${sharedPost ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700"}`}
            >
              {sharedPost ? "Shared" : "Share"} · {shareCount}
            </button>
          </div>
        </div>
      </div>

      {comments.length ? (
        <div className="grid gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">{comment.author}</div>
                  <div className="mt-1 text-sm text-slate-500">{comment.postedAt}</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => toggleCommentLike(comment.id)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--aiaa-blue)] hover:text-[var(--aiaa-blue)]">
                    Like · {commentLikes[comment.id] ?? comment.likeCount}
                  </button>
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
                    Reports · {comment.reportCount}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{comment.body}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <form onSubmit={handleReply} className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Comment UI</p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Write a comment</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">這裡現在會把新留言直接插進目前頁面的討論串，讓互動更像真正社群。</p>
          <textarea
            aria-label={`Reply to ${post.title}`}
            rows={5}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder="Reply respectfully. Do not insult other users, impersonate AIAA staff, or share secrets."
            className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="aiaa-button-dark">Post comment</button>
            <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400">
              Backend sync pending
            </button>
          </div>
        </form>

        <form onSubmit={handleReport} className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Report content UI</p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Report to moderation</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">檢舉功能已經有完整流程 UI，但目前仍維持安全模式，不會真的對 production 做移除或封鎖。</p>
          <label className="mt-4 block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Report reason</span>
            <select
              aria-label={`Report reason for ${post.title}`}
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              className="mt-3 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
            >
              {reportReasonOptions.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="aiaa-button-light">Create moderation note</button>
            <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400">
              Auto removal blocked
            </button>
          </div>
        </form>
      </div>

      {lastAction === "reply" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
          新留言已加入這個討論串。這一版仍未同步到 production backend。
        </div>
      ) : null}
      {lastAction === "report" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
          本機檢舉紀錄已建立，原因是「{reportReason}」。未來正式版可把它送進人工 moderation queue。
        </div>
      ) : null}
      {lastAction === "error" ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-800">
          Action blocked. Add content and remove anything that looks like a secret or credential.
        </div>
      ) : null}
      {lastAction === "abuse" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
          Reply blocked for civility review. Remove obscene wording, disrespectful language, or personal attacks before continuing.
        </div>
      ) : null}
    </div>
  );
}
