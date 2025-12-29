export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold">All systems running</h1>
      <p className="mt-2 text-muted-foreground">
        PostingExpert is working quietly in the background.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="stat-card">Auto Mode: ON</div>
        <div className="stat-card">Platforms: Connected</div>
        <div className="stat-card">Posts this week: 12</div>
      </div>
    </main>
  );
}
