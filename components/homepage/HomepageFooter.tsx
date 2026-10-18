import Image from "next/image";
import Link from "next/link";

export function HomepageFooter() {
  return (
    <footer className="bg-surface px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto flex max-w-330 flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            alt="JobPilot"
            src="/logo.png"
            width={140}
            height={40}
            className="h-9 w-auto"
          />
        </Link>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-8 text-[14px] text-text-secondary"
        >
          <Link
            href="/dashboard"
            className="transition-colors hover:text-text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-text-primary"
          >
            Terms &amp; Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
