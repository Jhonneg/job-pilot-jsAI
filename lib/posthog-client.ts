import posthog, { type Properties } from "posthog-js";

export function capturePostHogEvent(
  event: string,
  properties?: Properties,
): void {
  if (!posthog.__loaded) {
    return;
  }

  posthog.capture(event, properties);
}
