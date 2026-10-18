import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  icon: ReactNode;
};

export type FeatureItem = {
  title: string;
  description: string;
};

export type ValueItem = {
  title: string;
  description: string;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    active: true,
    icon: (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <path
          d="M2.5 2.5h4v4h-4v-4Zm7 0h4v2.5h-4V2.5ZM2.5 9.5h4v4h-4v-4Zm7-2.5h4v6.5h-4V7Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  {
    label: "Find Jobs",
    href: "/find-jobs",
    icon: (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="m10 10 3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <circle cx="8" cy="5.1" r="2.1" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M3.8 13c.7-2.4 2.3-3.6 4.2-3.6S11.5 10.6 12.2 13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
];

export const heroFeatures: FeatureItem[] = [
  {
    title: "Find jobs that actually fit",
    description: "Search by title and location and get matched roles you can quickly scan.",
  },
  {
    title: "Know the company before you apply",
    description:
      "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
  },
  {
    title: "Keep track of every application",
    description:
      "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
  },
];

export const confidencePoints: ValueItem[] = [
  {
    title: "Understand your match score",
    description:
      "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
  },
  {
    title: "AI-powered job matching",
    description:
      "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
  },
  {
    title: "Focus on the right roles",
    description:
      "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
  },
];
