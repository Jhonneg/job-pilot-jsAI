import { HomepageButton } from "./HomepageButton";

export function HomepageCta() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface px-6 py-12 md:px-10 lg:px-12 lg:py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-10%] h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-[10%] top-[0%] h-72 w-72 rounded-full bg-info/12 blur-3xl" />
        <div className="absolute bottom-[-16%] left-[40%] h-60 w-60 rounded-full bg-error/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="mx-auto max-w-3xl text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] text-text-slate md:text-[48px]">
          Your next job search can feel a lot less overwhelming
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-6 text-text-secondary md:text-[16px]">
          Set up your profile, upload your resume, and start finding matches in
          minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <HomepageButton href="/login">
            <span className="inline-flex items-center gap-2">
              Get Started
              <span aria-hidden="true">▶</span>
            </span>
          </HomepageButton>
          <HomepageButton href="/login" variant="secondary">
            Find Your First Match
          </HomepageButton>
        </div>
      </div>
    </section>
  );
}
