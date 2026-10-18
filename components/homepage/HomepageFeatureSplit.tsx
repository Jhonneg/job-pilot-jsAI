import Image from "next/image";

import { heroFeatures } from "./homepage-content";

export function HomepageFeatureSplit() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-border px-6 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-14">
          <div className="max-w-xl">
            <h2 className="max-w-md text-[32px] font-semibold leading-[1.08] tracking-[-0.04em] text-text-slate md:text-[48px]">
              Manage Your Job
              <br />
              Search With Ease
            </h2>

            <div className="mt-8 divide-y divide-border border-y border-border">
              {heroFeatures.map((item) => (
                <div key={item.title} className="py-6 first:pt-8 last:pb-8">
                  <h3 className="text-[17px] font-semibold text-text-slate">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-[15px] leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-surface-secondary px-6 py-8 lg:px-10 lg:py-12">
          <div className="w-full max-w-150">
            <Image
              alt="Job list preview"
              className="h-auto w-full"
              sizes="(min-width: 1280px) 600px, 100vw"
              src="/images/jobs-lists.png"
              width={1200}
              height={900}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
