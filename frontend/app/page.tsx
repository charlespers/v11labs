import SocialLinks from '@/components/SocialLinks'
import { getSiteConfig, getSocialLinks } from '@/lib/config'
import Logo from '@/components/Logo'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

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
    console.error('Error loading config:', error)
    // Use environment variables as fallback
    config = { 
      name: process.env.SITE_NAME || 'v11labs', 
      description: process.env.SITE_DESCRIPTION || 'Tech breakdowns related to robotics and hardware software codesign' 
    }
    socialLinks = {
      instagram: process.env.INSTAGRAM ? `https://instagram.com/${process.env.INSTAGRAM.replace('@', '')}` : undefined,
      twitter: process.env.X_HANDLE ? `https://twitter.com/${process.env.X_HANDLE.replace('@', '')}` : undefined,
      linkedin: process.env.LINKEDIN ? `https://linkedin.com/in/${process.env.LINKEDIN.replace('@', '')}` : undefined,
      email: process.env.EMAIL ? `mailto:${process.env.EMAIL}` : undefined,
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
