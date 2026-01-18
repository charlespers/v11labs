import SocialLinks from '@/components/SocialLinks'
import { getSiteConfig, getSocialLinks } from '@/lib/config'
import Logo from '@/components/Logo'

export default function Home() {
  const config = getSiteConfig()
  const socialLinks = getSocialLinks()

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
