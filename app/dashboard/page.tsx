export default function Page() {
  // Dashboard index content — keep it minimal. Nested routes (e.g. /dashboard/blank)
  // will now render inside the dashboard layout (`layout.tsx`).
  return (
    <div style={{ padding: 12 }}>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">Welcome to your dashboard overview.</p>
      <div className="mt-6">
        {/* Keep BlankPage available for quick preview on the index if desired */}
        {/* <BlankPage /> */}
      </div>
    </div>
  );
}
