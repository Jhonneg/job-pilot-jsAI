import Image from "next/image";

import { confidencePoints } from "./homepage-content";

export function HomepageConfidenceSplit() {
  return (
    <section className="border-y border-border bg-surface-secondary">
      <div className="grid gap-0 lg:grid-cols-[0.93fr_1.07fr]">
        <div className="flex items-center justify-center px-6 py-10 lg:px-10 lg:py-14">
          <div className="w-full max-w-140">
            <Image
              alt="JobPilot agent activity log"
              className="h-auto w-full"
              sizes="(min-width: 1280px) 560px, 100vw"
              src="/images/agnet-log.png"
              width={1200}
              height={900}
            />
          </div>
        </div>

        <div className="border-t border-border px-6 py-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-16">
          <div className="max-w-xl">
            <h2 className="max-w-lg text-[32px] font-semibold leading-[1.08] tracking-[-0.04em] text-text-slate md:text-[48px]">
              Apply With More
              <br />
              Confidence, Every Time
            </h2>

            <div className="mt-8 space-y-8">
              {confidencePoints.map((item) => (
                <article key={item.title}>
                  <h3 className="text-[17px] font-semibold text-text-slate">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
