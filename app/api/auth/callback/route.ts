import { SeverityNumber } from "@opentelemetry/api-logs";
import { after, NextResponse, type NextRequest } from "next/server";

import { createAuthActions } from "@insforge/sdk/ssr";

import { loggerProvider, posthogLog } from "@/instrumentation";
import { INSFORGE_ANON_KEY, INSFORGE_BASE_URL } from "@/lib/insforge/config";

function flushPostHogLogs() {
  after(async () => {
    await loggerProvider.forceFlush();
  });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("insforge_code");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError || !code) {
    posthogLog.emit({
      body: "oauth_callback_rejected",
      severityNumber: SeverityNumber.WARN,
      attributes: { failure_stage: "missing_callback_parameters" },
    });
    flushPostHogLogs();

    return NextResponse.redirect(
      new URL("/login?error=oauth_failed", request.url),
    );
  }

  const codeVerifier = request.cookies.get("insforge_code_verifier")?.value;
  if (!codeVerifier) {
    posthogLog.emit({
      body: "oauth_callback_rejected",
      severityNumber: SeverityNumber.WARN,
      attributes: { failure_stage: "missing_code_verifier" },
    });
    flushPostHogLogs();

    return NextResponse.redirect(
      new URL("/login?error=missing_verifier", request.url),
    );
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  const auth = createAuthActions({
    baseUrl: INSFORGE_BASE_URL,
    anonKey: INSFORGE_ANON_KEY,
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier);
  if (error || !data?.user) {
    posthogLog.emit({
      body: "oauth_callback_rejected",
      severityNumber: SeverityNumber.WARN,
      attributes: { failure_stage: "oauth_exchange" },
    });
    flushPostHogLogs();

    return NextResponse.redirect(
      new URL("/login?error=exchange_failed", request.url),
    );
  }

  response.cookies.delete("insforge_code_verifier");
  posthogLog.emit({
    body: "oauth_callback_completed",
    severityNumber: SeverityNumber.INFO,
  });
  flushPostHogLogs();

  return response;
}
