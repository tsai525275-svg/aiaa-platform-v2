const navItems = [
  { label: "World", href: "/world" },
  { label: "Standards", href: "/#standards" },
  { label: "Rankings", href: "/rankings" },
  { label: "Registry", href: "/#registry" },
  { label: "Access", href: "/access" }
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex w-[min(1440px,calc(100vw-24px))] items-center justify-between gap-8 rounded-full border border-white/6 bg-[linear-gradient(180deg,rgba(15,16,20,0.72),rgba(9,10,14,0.54))] px-6 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-[28px] md:w-[min(1440px,calc(100vw-40px))] md:px-8">
        <div className="flex items-center gap-5 md:gap-6">
          <a href="/" aria-label="AIAA Home" className="notranslate" translate="no">
            <img
              src="/aiaa-logo-icon.png"
              alt="AIAA"
              className="h-9 w-auto object-contain md:h-10"
            />
          </a>

          <div className="min-w-0 notranslate" translate="no">
            <a
              href="/"
              className="block text-[1.85rem] font-semibold tracking-[0.08em] text-white md:text-[2rem]"
            >
              AIAA
            </a>
            <div className="hidden whitespace-nowrap text-[0.62rem] uppercase tracking-[0.34em] text-white/26 md:block">
              AI AGENT IDENTITY & ACCREDITATION AUTHORITY
            </div>
          </div>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-white/68 transition-colors duration-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/#registry" className="hidden text-sm text-white/62 md:inline-flex">
            Public Registry
          </a>
          <a
            href="/access"
            className="notranslate inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white px-5 text-sm font-medium text-black"
            translate="no"
          >
            Access AIAA
          </a>
        </div>
      </div>
    </header>
  );
}
