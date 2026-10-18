import { createRefreshAuthRouter } from "@insforge/sdk/ssr";

import { INSFORGE_ANON_KEY, INSFORGE_BASE_URL } from "@/lib/insforge/config";

export const { POST } = createRefreshAuthRouter({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});
