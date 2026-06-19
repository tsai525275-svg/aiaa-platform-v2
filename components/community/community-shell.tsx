import Link from "next/link";
import {
  AIAAFrame,
  CTASection,
  DataPanel,
  PageHero,
  Section,
  StatusPill
} from "@/components/aiaa-page-kit";
import {
  communityCategories,
  communityPosts,
  communityRoles,
  communityRules,
  getCategoryBySlug,
  type CommunityPost
} from "@/lib/community/mock-data";
import { CommunityComposer, ReplyAndReportPanel } from "@/components/community/community-interactions";

function roleTone(role: string): "neutral" | "good" | "warn" | "bad" {
  if (role === "admin" || role === "moderator") return "warn";
  if (role === "certified member") return "good";
  return "neutral";
}

export function CommunityPageShell() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Community Discussion Forum MVP"
        title="Structured discussion for AIAA members, applicants, and AI Agent builders."
        copy="This MVP is intentionally safe. It demonstrates category browsing, post detail reading, local drafting, local reply/report flows, moderation notice patterns, and role-based labels without introducing a production write path."
        stats={[
          [String(communityCategories.length), "Categories"],
          [String(communityPosts.length), "Mock posts"],
          [String(communityRoles.length), "User roles"],
          ["MVP", "Read-safe mode"]
        ]}
        action={
          <div className="flex flex-wrap gap-3">
            <StatusPill tone="good">Public-safe MVP</StatusPill>
            <StatusPill tone="warn">Moderation human review</StatusPill>
            <StatusPill tone="bad">No auto deletion</StatusPill>
          </div>
        }
      />

      <Section
        eyebrow="Community rules"
        title="Trust-first discussion rules are visible before any future write path."
        copy="The MVP makes its moderation and safety boundary explicit so users are not misled into thinking content actions are already fully automated."
        compact
      >
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="aiaa-card grid gap-0 overflow-hidden">
            {communityRules.map((rule, index) => (
              <div key={rule} className="border-b border-slate-200 px-5 py-4 last:border-b-0">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm font-semibold text-[var(--aiaa-blue)]">0{index + 1}</span>
                  <p className="text-sm leading-6 text-slate-700">{rule}</p>
                </div>
              </div>
            ))}
          </div>
          <DataPanel
            label="Moderation notice"
            title="Reported content enters review, not auto-removal."
            copy="This version intentionally does not auto-delete content, auto-lock users, or imply that moderation is autonomous."
          >
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p>Posts can be flagged, but a human moderator remains responsible for any future production moderation action.</p>
              <StatusPill tone="warn">Human moderation required</StatusPill>
            </div>
          </DataPanel>
        </div>
      </Section>

      <Section
        eyebrow="Categories"
        title="Eight launch categories cover certification, study, showcases, and enterprise context."
        copy="Public and member-only labels are visible now so future access control can be mapped cleanly to RLS and UI gating."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {communityCategories.map((category) => (
            <div key={category.slug} className="aiaa-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.04em] text-slate-950">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                </div>
                <StatusPill tone={category.visibility === "public" ? "good" : "warn"}>{category.visibility}</StatusPill>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-950">{category.postCount}</div>
                  <div className="mt-1">posts</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-950">{category.lastActive}</div>
                  <div className="mt-1">last active</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-950">{category.moderators.join(", ")}</div>
                  <div className="mt-1">moderation owner</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                <strong className="text-slate-950">Posting policy:</strong> {category.postingPolicy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Post list"
        title="Current MVP threads show pinned, active, and review-only states."
        copy="Each thread keeps status visible and avoids fake certification claims. Public project quality is not presented as certification unless verified data exists."
      >
        <div className="grid gap-4">
          {communityPosts.map((post) => {
            const category = getCategoryBySlug(post.categorySlug);
            return (
              <Link key={post.slug} href={`/community/posts/${post.slug}`} className="aiaa-card block p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_80px_rgba(15,23,42,0.08)]">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusPill tone={post.status === "pinned" ? "good" : post.status === "review-only" ? "warn" : "neutral"}>{post.status}</StatusPill>
                  {category ? <StatusPill tone={category.visibility === "public" ? "neutral" : "warn"}>{category.name}</StatusPill> : null}
                  <StatusPill tone={roleTone(post.role)}>{post.role}</StatusPill>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-slate-950">{post.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{tag}</span>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-4">
                  <div><strong className="text-slate-950">{post.author}</strong><div className="mt-1">author</div></div>
                  <div><strong className="text-slate-950">{post.postedAt}</strong><div className="mt-1">posted</div></div>
                  <div><strong className="text-slate-950">{post.replies}</strong><div className="mt-1">replies</div></div>
                  <div><strong className="text-slate-950">{post.views}</strong><div className="mt-1">views</div></div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section
        eyebrow="Create post"
        title="The composer is production-safe and local-only."
        copy="Users can experience the future post creation UX now, while the system remains honest that no production forum write is available yet."
        compact
      >
        <CommunityComposer categories={communityCategories} />
      </Section>

      <Section
        eyebrow="State patterns"
        title="Loading, empty, and error states are designed before backend integration."
        copy="These patterns are visible now so later schema and API work can plug into the same UX without implying production completeness."
        compact
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <DataPanel label="Loading state" title="Refreshing category feed" copy="Use skeleton or shimmer patterns when future backend data is loading.">
            <div className="space-y-3">
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-200" />
            </div>
          </DataPanel>
          <DataPanel label="Empty state" title="No posts match the current filter" copy="Prompt the user to reset filters, review another category, or start a local draft.">
            <StatusPill tone="neutral">No matching threads</StatusPill>
          </DataPanel>
          <DataPanel label="Error state" title="Forum feed temporarily unavailable" copy="The UI can explain the state clearly without implying data loss or attempting unsafe retries against production write paths.">
            <StatusPill tone="bad">Safe read retry only</StatusPill>
          </DataPanel>
        </div>
      </Section>

      <Section
        eyebrow="Role labels"
        title="Role-based UI stays descriptive and non-misleading."
        copy="Certification claims are not invented. These labels describe forum access patterns and trust posture, not a verified certificate outcome unless real data exists."
        compact
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {communityRoles.map((role) => (
            <div key={role.role} className="aiaa-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{role.label}</h3>
                <StatusPill tone={roleTone(role.role)}>{role.role}</StatusPill>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                {role.capabilities.map((capability) => (
                  <li key={capability}>• {capability}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Use support and operations surfaces alongside the community MVP."
        copy="The forum MVP works best when paired with the read-only operations command center and the support knowledge assistant."
        primaryHref="/community/posts/what-counts-as-level-1-practical-evidence"
        primaryLabel="Open a sample thread"
        secondaryHref="/support"
        secondaryLabel="Open AI support MVP"
      />
    </AIAAFrame>
  );
}

export function CommunityPostDetailShell({ post }: { post: CommunityPost }) {
  const category = getCategoryBySlug(post.categorySlug);

  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Community Post Detail"
        title={post.title}
        copy={post.excerpt}
        stats={[
          [String(post.replies), "Replies"],
          [String(post.views), "Views"],
          [String(post.reportCount), "Reports"],
          [post.status, "State"]
        ]}
        action={
          <div className="flex flex-wrap gap-3">
            {category ? <StatusPill tone={category.visibility === "public" ? "good" : "warn"}>{category.name}</StatusPill> : null}
            <StatusPill tone={roleTone(post.role)}>{post.role}</StatusPill>
            <StatusPill tone={post.status === "pinned" ? "good" : post.status === "review-only" ? "warn" : "neutral"}>{post.status}</StatusPill>
          </div>
        }
      />

      <Section
        eyebrow="Thread content"
        title="Post detail view shows evidence-oriented conversation, not autonomous moderation."
        copy="This thread detail view demonstrates future forum depth while keeping reply and report flows local-only in this MVP."
      >
        <div className="grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
          <article className="aiaa-card p-6">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span><strong className="text-slate-950">{post.author}</strong></span>
              <span>{post.postedAt}</span>
              {post.certifiedBadge ? <StatusPill tone="good">{post.certifiedBadge}</StatusPill> : null}
            </div>
            <div className="mt-5 space-y-4 text-base leading-8 text-slate-700">
              {post.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
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

          <DataPanel
            label="Moderation notice"
            title="No auto-delete or auto-ban path exists"
            copy="Report actions remain descriptive and local in this MVP. Human moderation is still the only authority for future production decisions."
          >
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p>Current reports on this thread: <strong className="text-slate-950">{post.reportCount}</strong></p>
              <p>Replies and reports may be drafted safely, but they do not mutate a live production forum table in this release.</p>
            </div>
          </DataPanel>
        </div>
      </Section>

      <Section
        eyebrow="Comments"
        title="Visible comments preserve context and moderation status."
        copy="Flagged content is shown with a clear moderation notice pattern instead of pretending the system has already taken a production action."
        compact
      >
        <div className="grid gap-4">
          {post.comments.length ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="aiaa-card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-slate-950">{comment.author}</span>
                  <StatusPill tone={roleTone(comment.role)}>{comment.role}</StatusPill>
                  <span className="text-sm text-slate-500">{comment.postedAt}</span>
                  {comment.moderationStatus === "flagged" ? <StatusPill tone="warn">moderation notice</StatusPill> : null}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{comment.body}</p>
              </div>
            ))
          ) : (
            <div className="aiaa-card p-6 text-sm leading-6 text-slate-600">
              No comments yet. This is the empty state pattern for a new or moderation-limited thread.
            </div>
          )}
        </div>
      </Section>

      <Section
        eyebrow="Local interactions"
        title="Reply and report flows are UI-complete without production writes."
        copy="These interactions validate UX, labels, and safety messaging while keeping all live moderation actions blocked."
        compact
      >
        <ReplyAndReportPanel post={post} />
      </Section>
    </AIAAFrame>
  );
}
