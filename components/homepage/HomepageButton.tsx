import Link from "next/link";

import type { ReactNode } from "react";

type HomepageButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function HomepageButton({
  href,
  children,
  variant = "primary",
}: HomepageButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-overlay text-accent-foreground shadow-sm hover:bg-overlay-dark"
      : "border border-border bg-surface text-text-primary shadow-sm hover:bg-surface-secondary";

  return (
    <Link className={`${base} ${styles}`} href={href}>
      {children}
    </Link>
  );
}
