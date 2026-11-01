import posthog from "posthog-js";

import { insforge } from "@/lib/insforge/client";
import { capturePostHogEvent } from "@/lib/posthog-client";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogKey || !posthogHost) {
  if (process.env.NODE_ENV === "development") {
    const missingVariable = posthogKey
      ? "NEXT_PUBLIC_POSTHOG_HOST"
      : "NEXT_PUBLIC_POSTHOG_KEY";

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });

  void insforge.auth.getCurrentUser().then(({ data }) => {
    const user = data.user;

    if (!user) {
      return;
    }

    posthog.identify(user.id, {
      email: user.email,
      ...(user.profile?.name ? { name: user.profile.name } : {}),
    });
  });

  document.addEventListener("submit", (event) => {
    if (!(event.target instanceof HTMLFormElement)) {
      return;
    }

    const signInProvider = event.target.dataset.posthogSignInProvider;

    if (signInProvider === "google" || signInProvider === "github") {
      capturePostHogEvent("sign_in_started", {
        provider: signInProvider,
      });
    }

    if (event.target.dataset.posthogReset === "true") {
      capturePostHogEvent("signed_out");
      posthog.reset();
    }
  });
}
