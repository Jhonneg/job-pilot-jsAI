import Image from "next/image";
import Link from "next/link";

import { HomepageButton } from "./HomepageButton";
import { navItems } from "./homepage-content";

export function HomepageHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="flex h-16 items-center justify-between gap-6 px-6 md:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            alt="JobPilot"
            src="/logo.png"
            priority
            width={118}
            height={36}
            className="h-9 w-auto"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-10 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                item.active
                  ? "border-accent text-accent"
                  : "border-transparent text-text-dark hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <HomepageButton href="/login">Start for free</HomepageButton>
      </div>
    </header>
  );
}
