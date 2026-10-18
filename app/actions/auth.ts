"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createAuthActions } from "@insforge/sdk/ssr";

import {
  APP_URL,
  INSFORGE_ANON_KEY,
  INSFORGE_BASE_URL,
} from "@/lib/insforge/config";

async function initiateOAuth(provider: "google" | "github") {
  const cookieStore = await cookies();
  const auth = createAuthActions({
    baseUrl: INSFORGE_BASE_URL,
    anonKey: INSFORGE_ANON_KEY,
    cookies: cookieStore,
  });
  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo: new URL("/api/auth/callback", APP_URL).toString(),
    skipBrowserRedirect: true,
  });

  if (error || !data?.url || !data.codeVerifier) {
    redirect("/login?error=oauth_failed");
  }

  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  redirect(data.url);
}

export async function signInWithGoogle() {
  return initiateOAuth("google");
}

export async function signInWithGithub() {
  return initiateOAuth("github");
}

export async function signOut() {
  const auth = createAuthActions({
    baseUrl: INSFORGE_BASE_URL,
    anonKey: INSFORGE_ANON_KEY,
    cookies: await cookies(),
  });
  await auth.signOut();
  redirect("/login");
}
