import Link from "next/link";

import { signInWithGithub, signInWithGoogle } from "@/app/actions/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const showOauthError = resolvedSearchParams?.error === "oauth_failed";

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary md:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <section className="grid w-full gap-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between gap-10 bg-[linear-gradient(145deg,rgba(124,92,252,0.08),rgba(97,168,255,0.08),rgba(255,137,4,0.05))] px-8 py-10 md:px-10 md:py-12">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                JobPilot
              </p>
              <h1 className="mt-4 max-w-md text-[40px] font-semibold leading-[1.02] tracking-tighter text-text-slate md:text-[56px]">
                Sign in to start finding better matches.
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-6 text-text-secondary md:text-[16px]">
                Continue with Google or GitHub to unlock the dashboard, saved
                jobs, and your profile workspace.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-text-dark md:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-4">
                Faster search
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                Better matching
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                Clearer next steps
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center px-8 py-10 md:px-10 md:py-12">
            <div className="max-w-sm">
              <p className="text-sm font-medium text-text-secondary">
                Welcome back
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-text-primary">
                Choose a sign-in provider
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                We&apos;ll send you straight to the dashboard after
                authentication.
              </p>

              {showOauthError ? (
                <div className="mt-6 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                  We couldn&apos;t start sign in right now. Try again in a
                  moment.
                </div>
              ) : null}

              <div className="mt-8 grid gap-3">
                <form action={signInWithGoogle}>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-secondary"
                  >
                    <span aria-hidden="true">G</span>
                    Continue with Google
                  </button>
                </form>

                <form action={signInWithGithub}>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-secondary"
                  >
                    <span aria-hidden="true">⌘</span>
                    Continue with GitHub
                  </button>
                </form>
              </div>

              <p className="mt-6 text-sm text-text-muted">
                By continuing, you agree to keep your job search data in
                JobPilot.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex text-sm font-medium text-accent transition-colors hover:text-accent-dark"
              >
                Back to homepage
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
