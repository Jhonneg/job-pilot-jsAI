import { HomepageCta } from "./HomepageCta";
import { HomepageConfidenceSplit } from "./HomepageConfidenceSplit";
import { HomepageFeatureSplit } from "./HomepageFeatureSplit";
import { HomepageFooter } from "./HomepageFooter";
import { HomepageHeader } from "./HomepageHeader";
import { HomepageHero } from "./HomepageHero";
import { HomepagePreview } from "./HomepagePreview";
import { HomepageTestimonial } from "./HomepageTestimonial";

type HomepageProps = {
  startHref: string;
};

export function Homepage({ startHref }: HomepageProps) {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-360 flex-col">
        <HomepageHeader startHref={startHref} />

        <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
          <HomepageHero startHref={startHref} />
          <HomepagePreview />
          <HomepageFeatureSplit />
          <HomepageConfidenceSplit />
          <HomepageTestimonial />
          <HomepageCta startHref={startHref} />
          <HomepageFooter />
        </div>
      </div>
    </main>
  );
}
