import SocialLinks from '@/components/SocialLinks'
import Logo from '@/components/Logo'

// Simple, bulletproof homepage that will never crash
export default function Home() {
  // Use environment variables directly - no complex config loading
  const siteName = process.env.SITE_NAME || 'v11labs'
  const description = process.env.SITE_DESCRIPTION || 'Tech breakdowns related to robotics and hardware software codesign'

  const instagram = process.env.INSTAGRAM
  const xHandle = process.env.X_HANDLE
  const linkedin = process.env.LINKEDIN
  const email = process.env.EMAIL

  const socialLinks = {
    instagram: instagram ? `https://instagram.com/${instagram.replace('@', '')}` : undefined,
    twitter: xHandle ? `https://twitter.com/${xHandle.replace('@', '')}` : undefined,
    linkedin: linkedin ? `https://linkedin.com/in/${linkedin.replace('@', '')}` : undefined,
    email: email ? `mailto:${email}` : undefined,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <div className="flex justify-center mb-12">
          <Logo />
        </div>
        {description && (
          <p className="text-lg md:text-xl text-gray-900 mb-10 font-light tracking-tight leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <div className="mt-12">
          <SocialLinks {...socialLinks} />
        </div>
      </div>
    </div>
  )
}
