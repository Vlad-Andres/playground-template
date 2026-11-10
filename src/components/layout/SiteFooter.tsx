export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-2 px-4 py-8 text-sm text-faint sm:px-6">
        <p className="font-medium text-muted">DIS Study Playground</p>
        <p>
          A personal, interactive companion for the Data Intensive Systems course. Content is
          built from the course material and the assigned book chapters; progress is stored locally
          in your browser.
        </p>
      </div>
    </footer>
  );
}
