import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Check authentication for dashboard routes
    const authenticated = await isAuthenticated()

    if (!authenticated) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/admin" className="flex items-center px-4 text-lg font-semibold text-gray-900">
                                Admin
                            </Link>
                            <div className="flex space-x-4 ml-8">
                                <Link
                                    href="/admin/articles"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Articles
                                </Link>
                                <Link
                                    href="/admin/research"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Research
                                </Link>
                                <Link
                                    href="/admin/projects"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Projects
                                </Link>
                                <Link
                                    href="/admin/websites"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Websites
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}
