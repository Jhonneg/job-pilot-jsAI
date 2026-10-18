import Image from "next/image";

export function HomepagePreview() {
  return (
    <section className="px-0">
      <div className="mx-auto max-w-330">
        <Image
          alt="JobPilot dashboard preview"
          className="h-auto w-full"
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          src="/images/dashboard-demo.png"
          width={1600}
          height={740}
        />
      </div>
    </section>
  );
}
