import { redirect } from "next/navigation";

export default async function FindJobDetailsPage(
  props: PageProps<"/find-jobs/[id]">,
) {
  const { id } = await props.params;

  if (!id) {
    redirect("/find-jobs");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <p className="text-sm font-medium text-text-secondary">Job details</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-text-primary">
          Protected route scaffold
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Job detail {id} will render the full application view in the next
          phase.
        </p>
      </div>
    </main>
  );
}
