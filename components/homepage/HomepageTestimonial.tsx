import Image from "next/image";

export function HomepageTestimonial() {
  return (
    <section className="border-y border-border bg-surface px-6 py-16 md:px-10 lg:px-12 lg:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
          Success Stories
        </p>
        <blockquote className="mt-6 max-w-4xl text-[22px] leading-[1.45] tracking-[-0.03em] text-text-slate md:text-[31px]">
          “I used to spend my evenings copy-pasting resumes. Now I open my
          dashboard to see interviews waiting. It feels like cheating. Had 3
          offers on the table simultaneously.”
        </blockquote>

        <div className="mt-6 flex items-center gap-3">
          <Image
            alt="Tom Wilson"
            className="h-10 w-10 rounded-full object-cover"
            src="/images/user-icon.png"
            width={80}
            height={80}
          />
          <div className="text-left">
            <p className="text-[14px] font-medium text-text-slate">
              Tom Wilson
            </p>
            <p className="text-[12px] text-text-secondary">Junior Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
