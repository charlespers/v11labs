import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getSiteConfig } from "@/lib/config";

const config = getSiteConfig();

export const metadata: Metadata = {
  title: config.name,
  description: config.description || "Technology articles and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors tracking-tight uppercase">
                {config.name}
              </Link>
              <div className="flex space-x-8">
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Home
                </Link>
                <Link href="/articles" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Articles
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
