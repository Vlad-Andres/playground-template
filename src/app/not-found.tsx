import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4 px-4 py-24 text-center">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="text-2xl font-semibold">That page is not part of the course yet.</h1>
      <p className="text-muted">
        The lecture you are looking for may not have been added. Head back to the overview to see
        what is available.
      </p>
      <Link
        href="/"
        className="mx-auto w-fit rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-ink transition-opacity hover:opacity-90"
      >
        Back to the overview
      </Link>
    </div>
  );
}
