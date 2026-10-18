import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/actions/auth";
import { createInsforgeServerClient } from "@/lib/insforge/server";

export default async function DashboardPage() {
  const insforge = await createInsforgeServerClient();
  const { data } = await insforge.auth.getCurrentUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Dashboard
              </p>
              <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-text-primary">
                Welcome back{data.user?.email ? `, ${data.user.email}` : ""}.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                Authentication is wired. The next phase will fill this page with
                live job stats, recent activity, and charts.
              </p>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-secondary"
              >
                Sign out
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <p className="text-sm font-medium text-text-secondary">
              Protected route
            </p>
            <p className="mt-2 text-sm leading-6 text-text-primary">
              This page only renders when the InsForge session is present.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <p className="text-sm font-medium text-text-secondary">Next up</p>
            <p className="mt-2 text-sm leading-6 text-text-primary">
              Profile and job search pages are scaffolded and will be filled in
              next.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <p className="text-sm font-medium text-text-secondary">
              Navigation
            </p>
            <div className="mt-2 flex flex-col gap-2 text-sm font-medium text-accent">
              <Link href="/profile">Go to profile</Link>
              <Link href="/find-jobs">Go to job search</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
