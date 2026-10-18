import { cookies } from "next/headers";

import { createServerClient } from "@insforge/sdk/ssr";

import { INSFORGE_ANON_KEY, INSFORGE_BASE_URL } from "./config";

export async function createInsforgeServerClient() {
  return createServerClient({
    baseUrl: INSFORGE_BASE_URL,
    anonKey: INSFORGE_ANON_KEY,
    cookies: await cookies(),
  });
}
