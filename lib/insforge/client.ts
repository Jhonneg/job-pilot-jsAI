import { createBrowserClient } from "@insforge/sdk/ssr";

import { INSFORGE_ANON_KEY, INSFORGE_BASE_URL } from "./config";

export const insforge = createBrowserClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});
