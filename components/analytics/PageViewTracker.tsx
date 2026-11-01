"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { capturePostHogEvent } from "@/lib/posthog-client";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    capturePostHogEvent("page_viewed", {
      path: pathname,
    });
  }, [pathname]);

  return null;
}
