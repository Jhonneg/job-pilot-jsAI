import { HomepageCta } from "./HomepageCta";
import { HomepageConfidenceSplit } from "./HomepageConfidenceSplit";
import { HomepageFeatureSplit } from "./HomepageFeatureSplit";
import { HomepageFooter } from "./HomepageFooter";
import { HomepageHeader } from "./HomepageHeader";
import { HomepageHero } from "./HomepageHero";
import { HomepagePreview } from "./HomepagePreview";
import { HomepageTestimonial } from "./HomepageTestimonial";

export function Homepage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-360 flex-col">
        <HomepageHeader />

        <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
          <HomepageHero />
          <HomepagePreview />
          <HomepageFeatureSplit />
          <HomepageConfidenceSplit />
          <HomepageTestimonial />
          <HomepageCta />
          <HomepageFooter />
        </div>
      </div>
    </main>
  );
}
