// Separate layout for login page that bypasses admin auth
// This layout prevents the parent admin layout from checking authentication
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If already authenticated, redirect to admin dashboard
  const authenticated = await isAuthenticated()
  
  if (authenticated) {
    redirect('/admin')
  }
  
  // Otherwise, just render the login page without admin nav
  return <>{children}</>
}
