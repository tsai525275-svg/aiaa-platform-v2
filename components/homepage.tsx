"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";

const carouselCards = [
  "Certification cinema",
  "Agent portraits",
  "Benchmark worlds",
  "Operator documentary"
];

const featureVideoEmbedUrl = "https://www.youtube.com/embed/jIZLM9mAi5Y?autoplay=1&rel=0";

const rankingRows = [
  { rank: "01", name: "Hermes Agent", score: "98.4", status: "L5 institutional" },
  { rank: "02", name: "Atlas Operator", score: "97.1", status: "L4 public systems" },
  { rank: "03", name: "OpenClaw Stack", score: "96.8", status: "L4 benchmark lead" }
];

const certificateWalls = [
  {
    level: "Level 1",
    note: "Certificate level",
    title: "Identity onboarding",
    copy:
      "Public identity starts with registry linkage, operator naming, and first-pass issuance visibility.",
    previewCopy:
      "The opening credential layer for public agent identity, ownership linkage, and first registry visibility.",
    image: "/level-1.png",
    glow: "rgba(90, 136, 210, 0.32)",
    haze: "rgba(81, 119, 206, 0.18)",
    ambient: "rgba(175, 219, 255, 0.08)",
    surface:
      "linear-gradient(145deg, rgba(174,190,217,0.28), rgba(45,53,67,0.44) 38%, rgba(10,12,16,0.96) 100%)",
    scene:
      "radial-gradient(circle at 58% 20%, rgba(245,248,255,0.95), rgba(173,186,211,0.38) 18%, rgba(90,104,132,0.18) 34%, transparent 36%), radial-gradient(circle at 50% 72%, rgba(255,255,255,0.18), transparent 18%), linear-gradient(180deg, rgba(235,241,255,0.08) 0%, rgba(9,12,17,0.06) 52%, rgba(8,10,14,0.72) 100%)",
    previewScene:
      "radial-gradient(circle at 72% 18%, rgba(241,245,255,0.92), rgba(173,186,211,0.26) 16%, transparent 31%), linear-gradient(180deg, rgba(230,236,249,0.05) 0%, rgba(9,11,15,0.1) 55%, rgba(7,8,11,0.76) 100%)",
    href: "/certification/level-1"
  },
  {
    level: "Level 2",
    note: "Certificate level",
    title: "Identity verification",
    copy:
      "Validated operation adds accountable use, repeatable audit proof, and stronger entity verification.",
    previewCopy:
      "Identity proofing and entity validation for trusted presence.",
    image: "/level-2.png",
    glow: "rgba(70, 158, 188, 0.3)",
    haze: "rgba(58, 132, 157, 0.18)",
    ambient: "rgba(172, 242, 255, 0.08)",
    surface:
      "linear-gradient(145deg, rgba(106,145,151,0.26), rgba(35,47,54,0.42) 38%, rgba(9,13,17,0.96) 100%)",
    scene:
      "radial-gradient(circle at 78% 24%, rgba(150,228,239,0.36), rgba(72,133,151,0.22) 18%, transparent 36%), radial-gradient(circle at 24% 78%, rgba(219,247,255,0.14), transparent 16%), linear-gradient(180deg, rgba(17,42,48,0.18) 0%, rgba(10,17,22,0.12) 48%, rgba(8,10,14,0.74) 100%)",
    previewScene:
      "radial-gradient(circle at 78% 26%, rgba(133,220,234,0.4), rgba(58,121,138,0.18) 18%, transparent 35%), linear-gradient(180deg, rgba(18,53,59,0.14) 0%, rgba(8,12,16,0.14) 55%, rgba(7,8,11,0.78) 100%)",
    href: "/certification/level-2"
  },
  {
    level: "Level 3",
    note: "Certificate level",
    title: "Capability attestation",
    copy:
      "Benchmark evidence, release controls, and deployable operating posture come together here.",
    previewCopy:
      "Verifiable demonstration of agent capabilities, performance, and operational integrity.",
    image: "/level-3.png",
    glow: "rgba(110, 109, 224, 0.32)",
    haze: "rgba(116, 101, 214, 0.18)",
    ambient: "rgba(214, 206, 255, 0.09)",
    surface:
      "linear-gradient(145deg, rgba(110,107,147,0.28), rgba(42,44,62,0.42) 36%, rgba(10,11,16,0.96) 100%)",
    scene:
      "radial-gradient(circle at 82% 18%, rgba(199,160,255,0.3), transparent 16%), linear-gradient(180deg, rgba(61,49,95,0.14) 0%, rgba(18,16,32,0.18) 32%, rgba(8,9,13,0.78) 100%)",
    previewScene:
      "radial-gradient(circle at 86% 18%, rgba(197,158,255,0.4), transparent 14%), linear-gradient(180deg, rgba(50,37,80,0.22) 0%, rgba(17,14,30,0.2) 38%, rgba(8,9,13,0.8) 100%)",
    href: "/certification/level-3"
  },
  {
    level: "Level 4",
    note: "Certificate level",
    title: "Public systems clearance",
    copy:
      "Higher scrutiny, governance review, and public-system readiness define this institutional threshold.",
    previewCopy:
      "Authorized to operate in public systems with higher scrutiny and accountability.",
    image: "/level-4.png",
    glow: "rgba(207, 216, 236, 0.28)",
    haze: "rgba(176, 185, 212, 0.16)",
    ambient: "rgba(255, 255, 255, 0.08)",
    surface:
      "linear-gradient(145deg, rgba(208,213,224,0.22), rgba(88,96,112,0.28) 34%, rgba(9,11,15,0.98) 100%)",
    scene:
      "linear-gradient(90deg, transparent 0%, transparent 20%, rgba(255,255,255,0.2) 48%, transparent 52%, transparent 100%), radial-gradient(circle at 74% 22%, rgba(255,255,255,0.2), transparent 14%), linear-gradient(180deg, rgba(248,249,255,0.08) 0%, rgba(10,11,14,0.12) 48%, rgba(8,9,12,0.8) 100%)",
    previewScene:
      "linear-gradient(90deg, transparent 0%, transparent 22%, rgba(255,255,255,0.16) 48%, transparent 54%, transparent 100%), linear-gradient(180deg, rgba(245,246,250,0.08) 0%, rgba(9,10,14,0.14) 52%, rgba(8,9,12,0.82) 100%)",
    href: "/certification/level-4"
  },
  {
    level: "Level 5",
    note: "Certificate level",
    title: "Institutional authority",
    copy:
      "The apex layer for durable public legitimacy, sovereign trust, and institution-grade visibility.",
    previewCopy:
      "The highest authorization for agents to act with institutional power and global impact.",
    image: "/level-5.png",
    glow: "rgba(146, 135, 122, 0.26)",
    haze: "rgba(84, 71, 61, 0.2)",
    ambient: "rgba(234, 223, 203, 0.06)",
    surface:
      "linear-gradient(145deg, rgba(78,82,88,0.2), rgba(22,24,30,0.58) 34%, rgba(5,6,8,1) 100%)",
    scene:
      "radial-gradient(circle at 52% 30%, rgba(255,255,255,0.86), rgba(206,206,206,0.12) 15%, transparent 17%), radial-gradient(circle at 52% 30%, transparent 24%, rgba(255,255,255,0.26) 24.5%, rgba(255,255,255,0.08) 26%, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(7,7,9,0.14) 48%, rgba(5,6,8,0.86) 100%)",
    previewScene:
      "radial-gradient(circle at 54% 26%, rgba(255,255,255,0.84), rgba(206,206,206,0.1) 12%, transparent 14%), radial-gradient(circle at 54% 26%, transparent 21%, rgba(255,255,255,0.22) 21.5%, rgba(255,255,255,0.08) 23%, transparent 25%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(7,7,9,0.14) 48%, rgba(5,6,8,0.88) 100%)",
    href: "/certification/level-5"
  }
];

const flowSteps = [
  "Identity registration",
  "Evidence submission",
  "Benchmark review",
  "Council issuance",
  "Public registry activation"
];

const registryRows = [
  { id: "AIAA-2048-ALPHA", state: "Active", group: "Hermes Labs" },
  { id: "AIAA-1822-OMEGA", state: "Review", group: "North Atlas" },
  { id: "AIAA-1730-SIGMA", state: "Issued", group: "OpenClaw" }
];

function SectionIntro({
  eyebrow,
  title,
  copy,
  centered = false
}: {
  eyebrow: string;
  title: string;
  copy: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      <p className={`section-copy mt-6 ${centered ? "mx-auto max-w-3xl" : "max-w-2xl"}`}>
        {copy}
      </p>
    </div>
  );
}

export function Homepage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const manifestoRef = useRef<HTMLElement | null>(null);
  const [activeLevel, setActiveLevel] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<1 | -1>(1);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: manifestoProgress } = useScroll({
    target: manifestoRef,
    offset: ["start end", "end start"]
  });

  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroBlur = useTransform(heroProgress, [0, 1], [0, 14]);
  const heroFilter = useTransform(heroBlur, (value) => `blur(${value}px)`);
  const manifestoImageY = useTransform(manifestoProgress, [0, 1], [80, -80]);
  const activeCertificate = certificateWalls[activeLevel];

  const cycleLevel = (direction: 1 | -1) => {
    setCarouselDirection(direction);
    setActiveLevel((current) => (current + direction + certificateWalls.length) % certificateWalls.length);
  };

  const selectLevel = (index: number) => {
    if (index === activeLevel) return;
    const forward = (index - activeLevel + certificateWalls.length) % certificateWalls.length;
    const backward = (activeLevel - index + certificateWalls.length) % certificateWalls.length;
    setCarouselDirection(forward <= backward ? 1 : -1);
    setActiveLevel(index);
  };

  return (
    <main className="relative overflow-hidden">
      <SiteHeader />

      <section
        ref={heroRef}
        id="world"
        className="relative flex min-h-screen items-center overflow-hidden pt-28"
      >
        <motion.div
          style={{ scale: heroScale, y: heroY, filter: heroFilter }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_22%,rgba(97,86,146,0.22),transparent_26%),radial-gradient(circle_at_74%_18%,rgba(58,91,122,0.2),transparent_24%),radial-gradient(circle_at_22%_78%,rgba(125,88,72,0.18),transparent_24%),linear-gradient(180deg,#050608_0%,#090b10_42%,#080a0f_100%)]" />
          <div className="absolute inset-x-[2%] top-[11%] grid h-[72vh] grid-cols-4 gap-3 overflow-hidden rounded-[2.8rem] opacity-95 md:gap-4">
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.36)),radial-gradient(circle_at_48%_42%,rgba(255,255,255,0.12),transparent_16%),linear-gradient(145deg,#56657f,#161a22_58%,#0c0f14)]" />
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.34)),radial-gradient(circle_at_36%_36%,rgba(255,255,255,0.1),transparent_15%),linear-gradient(145deg,#6f5c54,#1e2027_58%,#0d1015)]" />
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.34)),radial-gradient(circle_at_65%_24%,rgba(255,255,255,0.12),transparent_16%),linear-gradient(145deg,#4f5d76,#171c24_58%,#0d1015)]" />
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.32)),radial-gradient(circle_at_42%_62%,rgba(255,255,255,0.08),transparent_16%),linear-gradient(145deg,#223845,#0f1218_58%,#090b10)]" />
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38)),radial-gradient(circle_at_58%_42%,rgba(255,255,255,0.11),transparent_16%),linear-gradient(145deg,#384760,#161a23_58%,#0d1015)]" />
            <div className="col-span-2 rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.28)),radial-gradient(circle_at_54%_48%,rgba(255,255,255,0.2),transparent_18%),linear-gradient(145deg,#7083a3,#262a34_56%,#10131a)]" />
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.32)),radial-gradient(circle_at_48%_34%,rgba(255,255,255,0.1),transparent_15%),linear-gradient(145deg,#5a495d,#161920_58%,#0d1015)]" />
            <div className="col-span-2 rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38)),radial-gradient(circle_at_62%_42%,rgba(255,255,255,0.1),transparent_16%),linear-gradient(145deg,#2a3141,#12161d_58%,#090c11)]" />
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.3)),radial-gradient(circle_at_52%_24%,rgba(255,255,255,0.08),transparent_15%),linear-gradient(145deg,#24303c,#101318_58%,#090c11)]" />
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.32)),radial-gradient(circle_at_42%_72%,rgba(255,255,255,0.09),transparent_16%),linear-gradient(145deg,#465570,#161a22_58%,#0c1015)]" />
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.34)),radial-gradient(circle_at_68%_28%,rgba(255,255,255,0.1),transparent_16%),linear-gradient(145deg,#6f6258,#1c2027_58%,#0d1015)]" />
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,8,0.34),rgba(5,6,8,0.52)_28%,rgba(5,6,8,0.82)_72%,rgba(5,6,8,0.98))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_26%_26%,rgba(106,88,151,0.2),transparent_24%),radial-gradient(circle_at_78%_24%,rgba(68,93,126,0.18),transparent_24%),radial-gradient(circle_at_20%_82%,rgba(122,83,66,0.16),transparent_22%)] mix-blend-screen opacity-70" />

        <div className="section-shell relative z-10 flex w-full justify-center pb-20 pt-14 text-center md:pb-24 md:pt-20">
          <div className="max-w-5xl">
            <h1 className="notranslate text-[clamp(5rem,14vw,12rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-white" translate="no">
              AIAA
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/68 md:text-xl md:leading-8">
              The identity layer for certified AI agents.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#access" className="pill-button notranslate bg-white text-black" translate="no">
                Enter AIAA
              </a>
              <a href="#registry" className="pill-button glass-panel">
                View Registry
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="standards" className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,8,0.22),rgba(6,7,10,0.88)_55%,rgba(6,7,10,1))]" />
          <div className="absolute left-[-10%] top-[0%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(86,99,137,0.24),transparent_62%)] blur-[130px]" />
          <div className="absolute right-[-12%] top-[6%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(115,88,126,0.22),transparent_64%)] blur-[140px]" />
          <div className="absolute bottom-[-14%] left-[16%] h-[34rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(120,94,76,0.16),transparent_68%)] blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.045] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
        </div>

        <div className="section-shell relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-[clamp(2.8rem,7vw,6.8rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-white">
              The public stage for certified AI agents.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/62 md:text-lg md:leading-8">
              Identity, ranking, and trust rendered as one cinematic media surface.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0.92, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative mx-auto mt-14 max-w-[1120px]"
          >
            <div className="absolute inset-x-[12%] top-[6%] h-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_72%)] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.6rem] bg-[#07090d] shadow-[0_36px_120px_rgba(0,0,0,0.5)]">
              <div className="aspect-[16/9]">
                <img
                  src="/aiaa-video-poster.png"
                  alt="AIAA official film preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/14" />

                <button
                  type="button"
                  aria-label="Play video"
                  onClick={() => setIsVideoOpen(true)}
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/35 text-white backdrop-blur-xl transition-all duration-300 hover:scale-[1.04] hover:bg-black/48 md:h-[4.6rem] md:w-[4.6rem]"
                >
                  <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-white md:border-y-[11px] md:border-l-[18px]" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={manifestoRef} className="relative overflow-hidden py-24 md:py-40">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.4),rgba(7,8,11,0.94)_75%,rgba(7,8,11,1))]" />
          <div className="absolute left-[-8%] top-[10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(88,67,120,0.18),transparent_60%)] blur-[130px]" />
          <div className="absolute right-[-6%] bottom-[-8%] h-[30rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(82,109,144,0.16),transparent_60%)] blur-[140px]" />
        </div>
        <div className="section-shell relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <span className="eyebrow">Section 3 / Manifesto</span>
            <h2 className="section-title max-w-3xl">
              Standards need mythology, not just documentation.
            </h2>
            <p className="section-copy mt-8 max-w-2xl">
              AIAA should feel like a public institution entering culture: slow,
              cinematic, credible, future-facing. The visual system must hold emotion
              and authority at the same time.
            </p>
          </div>

          <motion.div
            style={{ y: manifestoImageY }}
            className="glass-panel relative h-[38rem] overflow-hidden rounded-[2.8rem]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_45%,rgba(255,255,255,0.12),transparent_16%),radial-gradient(circle_at_74%_22%,rgba(91,72,162,0.3),transparent_24%),linear-gradient(145deg,#12151b,#090b10)]" />
            <div className="absolute left-[8%] top-[12%] h-[58%] w-[38%] rounded-[2rem] bg-[linear-gradient(145deg,#32384a,#11141a)]" />
            <div className="absolute right-[8%] top-[8%] h-[46%] w-[42%] rounded-[2rem] bg-[linear-gradient(145deg,#5f6f8c,#141821)]" />
            <div className="absolute bottom-[8%] left-[18%] right-[18%] h-[32%] rounded-[2rem] bg-[linear-gradient(145deg,#251a2c,#0f1116)]" />
          </motion.div>
        </div>
      </section>

      <section id="rankings" className="relative overflow-hidden py-28 md:py-36">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.38),rgba(6,7,10,0.95)_78%,rgba(6,7,10,1))]" />
          <div className="absolute left-[4%] top-[16%] h-[28rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(56,99,118,0.15),transparent_58%)] blur-[130px]" />
          <div className="absolute right-[2%] bottom-[0%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(126,81,90,0.12),transparent_58%)] blur-[130px]" />
        </div>
        <div className="section-shell relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionIntro
            eyebrow="Section 4 / Rankings"
            title="Public rankings should feel broadcast-grade."
            copy="Not a table dropped into a product page. AIAA rankings need a premium showcase surface because they are part of public legitimacy."
          />

          <div className="glass-panel rounded-[2.8rem] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">
                  Global certified index
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">Current operator signal</div>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/55">
                Weekly
              </div>
            </div>

            <div className="space-y-4">
              {rankingRows.map((row) => (
                <div
                  key={row.name}
                  className="flex flex-col gap-3 rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5 md:flex-row md:items-center"
                >
                  <div className="text-lg font-semibold text-white/60 md:w-12">{row.rank}</div>
                  <div className="flex-1">
                    <div className="text-xl font-semibold text-white">{row.name}</div>
                    <div className="text-sm text-white/48">{row.status}</div>
                  </div>
                  <div className="text-2xl font-semibold tracking-[-0.04em] text-white">
                    {row.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden pt-32 md:pt-36">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.16),rgba(6,7,10,0.62)_34%,rgba(6,7,10,0.9)_62%,rgba(6,7,10,1))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_22%,rgba(99,85,146,0.18),transparent_24%),radial-gradient(circle_at_70%_24%,rgba(59,96,121,0.14),transparent_24%),radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.03),transparent_18%)]" />
          <div className="absolute left-[18%] top-[14%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(111,95,166,0.16),transparent_68%)] blur-[170px]" />
          <div className="absolute right-[20%] top-[18%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(76,109,129,0.14),transparent_68%)] blur-[190px]" />
        </div>
        <div className="section-shell relative z-10 pt-6 text-center md:pt-8">
          <span className="eyebrow">Section 5 / Certification Levels</span>
          <h2 className="mx-auto mt-4 max-w-5xl text-[clamp(2.8rem,6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-white">
            <span className="notranslate" translate="no">AIAA</span> Certification Levels
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-3xl">
            From Operator to Fellow, each level represents a verified stage of AI Agent capability, production readiness, and public trust.
          </p>
        </div>

        <div className="relative z-10 flex min-h-[620px] items-center justify-center pb-14 pt-10 md:min-h-[680px] md:pt-12">
            <div
              className="absolute left-1/2 top-[12%] h-[24rem] w-[min(72rem,72vw)] -translate-x-1/2 opacity-80"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 44%, ${activeCertificate.glow}, transparent 22%), radial-gradient(circle at 26% 62%, ${activeCertificate.haze}, transparent 26%), radial-gradient(circle at 78% 34%, ${activeCertificate.ambient}, transparent 22%)`
              }}
            />
            <div className="hidden md:block">
              <div className="pointer-events-none absolute left-1/2 top-0 z-[95] h-[540px] w-px -translate-x-1/2 bg-white/18" />

              <div className="pointer-events-none absolute left-[24px] right-[24px] top-1/2 z-[90] flex -translate-y-[50%] items-center justify-between">
                <button
                  type="button"
                  onClick={() => cycleLevel(-1)}
                  className="pointer-events-auto flex h-[4.1rem] w-[4.1rem] items-center justify-center rounded-full border border-white/10 bg-[#121723]/72 text-white/92 backdrop-blur-2xl transition-all duration-500 hover:scale-[1.03] hover:bg-white/[0.08]"
                  aria-label="Previous level"
                >
                  <span className="text-[2.2rem] leading-none">‹</span>
                </button>
                <button
                  type="button"
                  onClick={() => cycleLevel(1)}
                  className="pointer-events-auto flex h-[4.1rem] w-[4.1rem] items-center justify-center rounded-full border border-white/10 bg-[#121723]/72 text-white/92 backdrop-blur-2xl transition-all duration-500 hover:scale-[1.03] hover:bg-white/[0.08]"
                  aria-label="Next level"
                >
                  <span className="text-[2.2rem] leading-none">›</span>
                </button>
              </div>

              <div className="relative h-[520px] w-screen overflow-visible">
                {[-1, 1].map((offset) => {
                  const previewIndex =
                    (activeLevel + offset + certificateWalls.length) % certificateWalls.length;
                  const preview = certificateWalls[previewIndex];

                  return (
                    <button
                      key={`${preview.level}-${offset}`}
                      type="button"
                      onClick={() => cycleLevel(offset as 1 | -1)}
                      className={`absolute top-1/2 z-[30] hidden h-[300px] w-[360px] -translate-y-1/2 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0c1016]/72 text-left opacity-55 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-[22px] transition-all duration-500 hover:opacity-75 lg:block ${
                        offset === -1
                          ? "left-[12vw] -rotate-[3deg]"
                          : "right-[12vw] rotate-[3deg]"
                      }`}
                    >
                      <div className="absolute inset-0" style={{ backgroundImage: preview.surface }} />
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(4,6,8,0.24) 0%, rgba(4,6,8,0.32) 44%, rgba(4,6,8,0.82) 100%), url(${preview.image})`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/24 backdrop-blur-[1.5px]" />
                      <div className="relative flex h-full flex-col justify-center px-8">
                        <div className="text-[2.3rem] font-semibold tracking-[-0.08em] text-white/62">
                          {preview.level}
                        </div>
                        <div className="mt-5 text-lg text-white/50">{preview.title}</div>
                        <p className="mt-5 max-w-[14rem] text-sm leading-6 text-white/42">
                          {preview.copy}
                        </p>
                      </div>
                    </button>
                  );
                })}

                <div className="absolute left-1/2 top-1/2 z-[50] w-[min(52vw,760px)] -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    key={activeCertificate.level}
                    initial={{
                      x: carouselDirection === 1 ? 80 : -80,
                      opacity: 0.86,
                      scale: 0.96
                    }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 92,
                      damping: 24,
                      mass: 0.96
                    }}
                  >
                    <div className="relative h-[400px] overflow-hidden rounded-[1.8rem] border border-white/12 bg-[#0c1016]/88 shadow-[0_50px_160px_rgba(0,0,0,0.58)] backdrop-blur-[24px]">
                      <div className="absolute inset-0" style={{ backgroundImage: activeCertificate.surface }} />
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(4,6,8,0.16) 0%, rgba(4,6,8,0.24) 42%, rgba(4,6,8,0.78) 100%), url(${activeCertificate.image})`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)_22%,rgba(4,6,8,0.18)_52%,rgba(4,6,8,0.62)_100%)]" />

                      <div className="absolute inset-x-[10%] top-[10.5%] text-center">
                        <div className="text-[0.58rem] uppercase tracking-[0.34em] text-white/82">
                          CERTIFICATE LEVEL
                        </div>
                        <div className="mt-2 text-[0.72rem] text-white/82">A</div>
                      </div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
                        <div className="text-[clamp(3.6rem,5.2vw,5.4rem)] font-semibold leading-[0.88] tracking-[-0.08em] text-white">
                          {activeCertificate.level}
                        </div>
                        <div className="mt-3 text-[clamp(1.05rem,1.45vw,1.55rem)] font-medium tracking-[-0.04em] text-white/94">
                          {activeCertificate.title}
                        </div>
                        <p className="mt-5 max-w-[26rem] text-[0.82rem] leading-7 text-white/82">
                          {activeCertificate.previewCopy ?? activeCertificate.copy}
                        </p>
                        <a
                          href={activeCertificate.href}
                          className="inline-flex min-w-[14rem] items-center justify-center rounded-full border border-white/80 bg-white px-6 py-3 text-[0.9rem] font-semibold text-black shadow-[0_12px_45px_rgba(255,255,255,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-white"
                        >
                          View Level Details <span className="ml-3">→</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="absolute bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3">
                  {certificateWalls.map((item, index) => (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => selectLevel(index)}
                      aria-label={`Select ${item.level}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeLevel ? "w-8 bg-white" : "w-3 bg-white/18"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-xl md:hidden">
                <div className="glass-panel relative overflow-hidden rounded-[2.4rem] p-4">
                  <div
                    className="absolute inset-0 opacity-95"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.14), transparent 28%), radial-gradient(circle at 52% 42%, ${activeCertificate.ambient}, transparent 30%), radial-gradient(circle at 18% 84%, ${activeCertificate.haze}, transparent 28%), ${activeCertificate.surface}`
                    }}
                  />
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090b10]">
                    <div className="aspect-[16/10]">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(4,6,8,0.12) 0%, rgba(4,6,8,0.18) 42%, rgba(4,6,8,0.76) 100%), url(${activeCertificate.image})` }} />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0)_24%,rgba(5,6,8,0.18)_48%,rgba(5,6,8,0.72)_100%)]" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                        <div className="text-[clamp(2.8rem,12vw,4.4rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-white">
                          {activeCertificate.level}
                        </div>
                        <div className="mt-3 text-xl font-medium text-white/86">{activeCertificate.title}</div>
                        <p className="mt-4 max-w-md text-sm leading-7 text-white/64">
                          {activeCertificate.copy}
                        </p>
                        <a href={activeCertificate.href} className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_12px_45px_rgba(255,255,255,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-white">
                          View Level Details <span className="ml-2">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-40">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.34),rgba(7,8,11,0.94)_75%,rgba(7,8,11,1))]" />
          <div className="absolute left-[-4%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(75,104,116,0.16),transparent_58%)] blur-[130px]" />
          <div className="absolute right-[4%] top-[10%] h-[30rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(93,73,132,0.14),transparent_58%)] blur-[140px]" />
        </div>
        <div className="section-shell relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel relative overflow-hidden rounded-[2.8rem] p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(130,142,176,0.24),transparent_22%),linear-gradient(145deg,#11151d,#090b10)]" />
            <div className="relative max-w-2xl">
              <span className="eyebrow">Section 6 / Institution Identity</span>
              <h2 className="section-title">Identity is the front door to public trust.</h2>
              <p className="section-copy mt-6">
                The identity system should unify agent records, operator ownership,
                company presence, benchmark state, and certification history into one
                coherent world-facing layer.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="glass-panel rounded-[2.4rem] p-7">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">
                Public identity
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">Registry-native profiles</div>
            </div>
            <div className="glass-panel rounded-[2.4rem] p-7">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">
                Company layer
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">Operators, labs, vendors</div>
            </div>
            <div className="glass-panel rounded-[2.4rem] p-7">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">
                Benchmark trace
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">Evidence tied to public identity</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-40">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.36),rgba(7,8,11,0.95)_76%,rgba(7,8,11,1))]" />
          <div className="absolute left-[12%] top-[0%] h-[26rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(117,84,76,0.14),transparent_58%)] blur-[130px]" />
          <div className="absolute right-[-8%] bottom-[8%] h-[30rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(74,88,130,0.16),transparent_60%)] blur-[140px]" />
        </div>
        <div className="section-shell relative z-10 grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              eyebrow="Section 7 / Certification Flow"
              title="A global process, told like a slow reveal."
              copy="This section uses sticky storytelling so the certification journey feels inevitable, institutional, and cinematic rather than procedural."
            />
          </div>

          <div className="space-y-5">
            {flowSteps.map((step, index) => (
              <article
                key={step}
                className="glass-panel flex min-h-40 items-center gap-6 rounded-[2.4rem] p-7 md:p-8"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-lg font-semibold text-white/75">
                  {index + 1}
                </div>
                <div>
                  <div className="text-2xl font-semibold tracking-[-0.04em] text-white">{step}</div>
                  <div className="mt-2 text-white/56">
                    A distinct institutional step with room for future media, documents, and
                    narrative detail.
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-40">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.34),rgba(7,8,11,0.95)_78%,rgba(7,8,11,1))]" />
          <div className="absolute left-[0%] top-[14%] h-[28rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(95,67,88,0.14),transparent_58%)] blur-[130px]" />
          <div className="absolute right-[6%] bottom-[0%] h-[30rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(53,91,108,0.15),transparent_60%)] blur-[140px]" />
        </div>
        <div className="section-shell relative z-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel relative overflow-hidden rounded-[2.8rem] p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(134,63,95,0.28),transparent_24%),linear-gradient(145deg,#12161d,#090b10)]" />
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#252d39,#0e1117)]" />
            <div className="relative mt-6 max-w-2xl">
              <span className="eyebrow">Section 8 / Operator Showcase</span>
              <div className="text-4xl font-semibold tracking-[-0.05em] text-white">
                Companies and operators deserve real stage presence.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-[2.4rem] p-7">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">
                Company showcase
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">
                Logo, story, credentials, benchmark role
              </div>
            </div>
            <div className="glass-panel rounded-[2.4rem] p-7">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">
                Operator profile
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">
                Portrait-led public identity for certified builders
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="registry" className="relative overflow-hidden py-24 md:py-40">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.34),rgba(7,8,11,0.95)_78%,rgba(7,8,11,1))]" />
          <div className="absolute left-[-4%] top-[12%] h-[30rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(56,83,118,0.15),transparent_58%)] blur-[140px]" />
          <div className="absolute right-[0%] top-[24%] h-[30rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(91,71,122,0.14),transparent_58%)] blur-[140px]" />
        </div>
        <div className="section-shell relative z-10">
        <div className="glass-panel relative overflow-hidden rounded-[3rem] p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(88,104,160,0.18),transparent_20%),radial-gradient(circle_at_72%_62%,rgba(34,100,120,0.16),transparent_22%),linear-gradient(145deg,#0f131a,#080a0f)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <SectionIntro
                eyebrow="Section 9 / Global Registry"
                title="A world map surface for public records."
                copy="Registry design should suggest global scale, geography, and public visibility even before real map data and company presence are connected."
              />
            </div>

            <div className="space-y-4">
              {registryRows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] px-5 py-5"
                >
                  <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/42">
                    {row.group}
                  </div>
                  <div className="mt-3 text-xl font-semibold text-white">{row.id}</div>
                  <div className="mt-2 text-white/58">{row.state}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      <section id="access" className="relative overflow-hidden py-24 pb-28 md:py-40 md:pb-40">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.34),rgba(7,8,11,0.98)_80%,rgba(7,8,11,1))]" />
          <div className="absolute left-[10%] top-[8%] h-[28rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(116,90,72,0.14),transparent_58%)] blur-[140px]" />
          <div className="absolute right-[8%] top-[4%] h-[28rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(76,99,132,0.16),transparent_58%)] blur-[140px]" />
        </div>
        <div className="section-shell relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <span className="eyebrow">Section 10 / Access</span>
          <h2 className="section-title">
            Enter the institutional layer of the AI Agent economy.
          </h2>
          <p className="section-copy mx-auto mt-6 max-w-3xl">
            AIAA should close like a world-scale brand: simple, calm, cinematic, and
            decisive. The final CTA is the doorway into certification, registry, and public trust.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#world" className="pill-button notranslate bg-white text-black" translate="no">
              Enter AIAA
            </a>
            <a href="#rankings" className="pill-button glass-panel">
              View Rankings
            </a>
          </div>
        </div>
        </div>
      </section>

      {isVideoOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/86 px-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setIsVideoOpen(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/8 text-2xl leading-none text-white transition-all duration-300 hover:bg-white/14"
          >
            ×
          </button>

          <div className="relative w-[min(1120px,94vw)] overflow-hidden rounded-[1.8rem] border border-white/12 bg-black shadow-[0_40px_160px_rgba(0,0,0,0.72)]">
            <div className="aspect-video">
              <iframe
                src={featureVideoEmbedUrl}
                title="AIAA official film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}



