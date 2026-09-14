import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-[1560px] flex-col justify-center px-5 sm:px-8 lg:px-12">
      <p className="text-label uppercase text-ink-soft">404</p>
      <h1 className="text-display mt-4 max-w-[16ch]">
        This page turned out to be a thought, not a reality.
      </h1>
      <Link
        href="/"
        className="pill mt-8 inline-flex w-fit items-center gap-2 bg-blue-deep px-6 py-3.5 text-[0.9rem] font-semibold text-paper transition-colors hover:bg-ink"
      >
        Back home <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
