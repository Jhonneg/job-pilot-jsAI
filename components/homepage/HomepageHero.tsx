import { HomepageButton } from "./HomepageButton";

type HomepageHeroProps = {
  startHref: string;
};

export function HomepageHero({ startHref }: HomepageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-none border border-border bg-surface px-5 py-10 md:px-8 md:py-14 lg:px-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[-12%] h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-[6%] top-[4%] h-72 w-72 rounded-full bg-info/12 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[20%] h-56 w-56 rounded-full bg-error/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="mx-auto max-w-4xl text-[40px] font-semibold leading-[1.02] tracking-tighter text-text-slate md:text-[64px]">
          Job hunting is hard.
          <br />
          Your tools shouldn&apos;t be.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-7 text-text-secondary md:text-[17px]">
          Stop applying blind. JobPilot finds the jobs, researches the
          companies, and gives you everything you need to stand out.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <HomepageButton href={startHref}>
            <span className="inline-flex items-center gap-2">
              Get Started
              <span aria-hidden="true">▶</span>
            </span>
          </HomepageButton>
          <HomepageButton href={startHref} variant="secondary">
            Find Your First Match
          </HomepageButton>
        </div>
      </div>
    </section>
  );
}
