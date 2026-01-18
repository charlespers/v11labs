// Root admin layout - no auth check here to avoid redirect loop
// Auth is checked in individual pages and the dashboard layout
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
