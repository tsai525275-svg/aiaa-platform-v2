import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export type Metric = [string, string];

const frameWidth = "mx-auto w-[min(1360px,calc(100vw-32px))]";

function AccentText({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 2) return <span className="aiaa-prism-text">{text}</span>;

  const keep = Math.max(words.length - 2, 1);
  return (
    <>
      {words.slice(0, keep).join(" ")} <span className="aiaa-prism-text">{words.slice(keep).join(" ")}</span>
    </>
  );
}

export function AIAAFrame({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--aiaa-bg)] text-[var(--aiaa-ink)]">
      <SiteHeader />
      {children}
    </main>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  stats,
  action
}: {
  eyebrow: string;
  title: string;
  copy: string;
  stats?: Metric[];
  action?: ReactNode;
}) {
  return (
    <section className="aiaa-identity-bg relative overflow-hidden border-b border-slate-200 px-4 py-12 lg:py-16">
      <div className="aiaa-axis-glow left-[8%] top-[18%]" aria-hidden="true" />
      <div className="aiaa-axis-glow right-[12%] top-[10%] [animation-delay:1.4s]" aria-hidden="true" />
      <div className={`relative z-10 ${frameWidth}`}>
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="aiaa-reveal max-w-5xl text-[clamp(2.7rem,5.4vw,6.25rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-slate-950">
              <AccentText text={title} />
            </h1>
          </div>
          <div className="lg:justify-self-end">
            <p className="aiaa-reveal max-w-3xl text-base leading-7 text-slate-700 md:text-lg md:leading-8 [animation-delay:120ms]">{copy}</p>
            {action ? <div className="mt-6">{action}</div> : null}
          </div>
        </div>
        {stats ? <MetricStrip items={stats} /> : null}
      </div>
    </section>
  );
}

export function MetricStrip({ items }: { items: Metric[] }) {
  const columns = items.length >= 5 ? "lg:grid-cols-5" : items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <div className={`aiaa-card mt-8 grid overflow-hidden md:grid-cols-2 ${columns}`}>
      {items.map(([value, label], index) => (
        <div key={`${value}-${label}`} className="aiaa-metric-tile relative border-b border-slate-200 px-5 py-5 md:border-r md:last:border-r-0 lg:border-b-0" data-tone={index % 5}>
          <div className="font-mono text-2xl font-semibold tracking-[-0.06em] text-slate-950 md:text-3xl">{value}</div>
          <div className="mt-2 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</div>
        </div>
      ))}
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  copy,
  children,
  id,
  compact = false
}: {
  eyebrow?: string;
  title?: string;
  copy?: string;
  children: ReactNode;
  id?: string;
  compact?: boolean;
}) {
  return (
    <section id={id} className={`relative overflow-hidden border-b border-slate-200 bg-[var(--aiaa-bg)] px-4 ${compact ? "py-10 lg:py-12" : "py-12 lg:py-16"}`}>
      <div className={frameWidth}>
        {(eyebrow || title || copy) && (
          <div className="mb-8 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              {title ? <h2 className="aiaa-reveal max-w-3xl text-[clamp(2.15rem,3.9vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-slate-950"><AccentText text={title} /></h2> : null}
            </div>
            {copy ? <p className="max-w-3xl text-base leading-7 text-slate-600 lg:justify-self-end">{copy}</p> : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function ThinTable({ headers, rows }: { headers: string[]; rows: Array<Array<ReactNode>>; minWidth?: string }) {
  return (
    <div className="aiaa-card w-full overflow-hidden">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-[#f7f9fc] text-[0.64rem] uppercase tracking-[0.22em] text-slate-500">
            {headers.map((header) => (
              <th key={header} className="break-words px-4 py-4 font-semibold first:pl-5 last:pr-5">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="group border-b border-slate-200 transition last:border-b-0 hover:bg-[#f1f6ff]">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="break-words px-4 py-4 align-top text-sm leading-6 text-slate-700 first:pl-5 last:pr-5 group-hover:text-slate-950">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IndexList({ rows }: { rows: Array<{ index: string; title: string; copy: string; meta?: string; href?: string; detail?: ReactNode }> }) {
  return (
    <div className="aiaa-card overflow-hidden">
      {rows.map((row) => {
        const content = (
          <>
            <div className="font-mono text-xl font-semibold tracking-[-0.06em] text-[var(--aiaa-blue)]">{row.index}</div>
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{row.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{row.copy}</p>
              {row.detail ? <div className="mt-4">{row.detail}</div> : null}
            </div>
            <div className="text-sm font-semibold text-slate-700">{row.meta ?? "Open"}</div>
          </>
        );

        if (row.href) {
          return (
            <Link key={row.index} href={row.href} className="group grid gap-4 border-b border-slate-200 px-5 py-5 transition last:border-b-0 hover:bg-[#f1f6ff] md:grid-cols-[76px_1fr_150px]">
              {content}
            </Link>
          );
        }

        return (
          <div key={row.index} className="grid gap-4 border-b border-slate-200 px-5 py-5 last:border-b-0 md:grid-cols-[76px_1fr_150px]">
            {content}
          </div>
        );
      })}
    </div>
  );
}

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const toneClass = {
    neutral: "border-blue-200 bg-blue-50 text-blue-700",
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warn: "border-amber-200 bg-amber-50 text-amber-700",
    bad: "border-rose-200 bg-rose-50 text-rose-700"
  }[tone];

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${toneClass}`}>{children}</span>;
}

export function CTASection({
  title,
  copy,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  title: string;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-[var(--aiaa-bg)] px-4 py-12 lg:py-16">
      <div className={`aiaa-identity-bg aiaa-card relative overflow-hidden px-6 py-8 lg:flex lg:items-center lg:justify-between lg:gap-7 ${frameWidth}`}>
        <div>
          <p className="eyebrow">Next Action</p>
          <h2 className="relative z-10 max-w-4xl text-[clamp(2.1rem,4.2vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-slate-950"><AccentText text={title} /></h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{copy}</p>
        </div>
        <div className="relative z-10 mt-6 flex flex-wrap gap-3 lg:mt-0">
          <Link href={primaryHref} className="aiaa-button-dark">{primaryLabel}</Link>
          {secondaryHref && secondaryLabel ? <Link href={secondaryHref} className="aiaa-button-light">{secondaryLabel}</Link> : null}
        </div>
      </div>
    </section>
  );
}

export function SplitLedger({ left, right }: { left: ReactNode; right: ReactNode }) {
  return <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr]">{left}<div>{right}</div></div>;
}

export function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-y border-slate-200 py-5">
      <h3 className="text-2xl font-semibold tracking-[-0.05em] text-slate-950">{title}</h3>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

export function StaticInput({ label, placeholder, type = "text", wide = false }: { label: string; placeholder: string; type?: string; wide?: boolean }) {
  return (
    <label className={wide ? "md:col-span-2" : undefined}>
      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <input type={type} placeholder={placeholder} className="mt-3 h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]" />
    </label>
  );
}

export function StaticTextarea({ label, placeholder, rows = 5 }: { label: string; placeholder: string; rows?: number }) {
  return (
    <label className="md:col-span-2">
      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <textarea rows={rows} placeholder={placeholder} className="mt-3 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]" />
    </label>
  );
}

export function DataPanel({ label, title, copy, children }: { label: string; title: string; copy?: string; children?: ReactNode }) {
  return (
    <div className="aiaa-card p-5">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">{label}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-950">{title}</h3>
      {copy ? <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p> : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

export function DotMatrix({ labels }: { labels: string[] }) {
  return (
    <div className="aiaa-identity-bg relative h-40 overflow-hidden border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="relative z-10 grid h-full grid-cols-5 items-center gap-2 px-5">
        {labels.map((label, index) => (
          <div key={label} className="text-center">
            <div className="mx-auto h-3 w-3 rounded-full bg-[var(--aiaa-blue)] shadow-[0_0_0_7px_rgba(37,99,235,0.08)]" />
            <div className="mt-4 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-slate-500" translate="no">{label}</div>
            <div className="mt-2 font-mono text-2xl font-semibold tracking-[-0.08em] text-slate-950">{String(index + 1).padStart(2, "0")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
