import SocialLinks from '@/components/SocialLinks'
import { getSiteConfig, getSocialLinks } from '@/lib/config'
import Logo from '@/components/Logo'

export default async function Home() {
  // Always provide defaults to prevent any undefined errors
  let config: { name: string; description: string } = {
    name: 'v11labs',
    description: 'Tech breakdowns related to robotics and hardware software codesign'
  }

  let socialLinks: {
    instagram?: string
    twitter?: string
    linkedin?: string
    email?: string
  } = {}

  try {
    const siteConfig = getSiteConfig()
    config = {
      name: siteConfig.name || 'v11labs',
      description: siteConfig.description || 'Tech breakdowns related to robotics and hardware software codesign'
    }
    socialLinks = getSocialLinks()
  } catch (error) {
    // Silent fallback - use environment variables or defaults
    config = {
      name: process.env.SITE_NAME || 'v11labs',
      description: process.env.SITE_DESCRIPTION || 'Tech breakdowns related to robotics and hardware software codesign'
    }
    const instagram = process.env.INSTAGRAM
    const xHandle = process.env.X_HANDLE
    const linkedin = process.env.LINKEDIN
    const email = process.env.EMAIL

    socialLinks = {
      instagram: instagram ? `https://instagram.com/${instagram.replace('@', '')}` : undefined,
      twitter: xHandle ? `https://twitter.com/${xHandle.replace('@', '')}` : undefined,
      linkedin: linkedin ? `https://linkedin.com/in/${linkedin.replace('@', '')}` : undefined,
      email: email ? `mailto:${email}` : undefined,
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <div className="flex justify-center mb-12">
          <Logo />
        </div>
        {config.description && (
          <p className="text-lg md:text-xl text-gray-900 mb-10 font-light tracking-tight leading-relaxed max-w-2xl mx-auto">
            {config.description}
          </p>
        )}
        <div className="mt-12">
          <SocialLinks {...socialLinks} />
        </div>
      </div>
    </div>
  )
}
