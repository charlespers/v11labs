import fs from 'fs'
import path from 'path'

interface SiteConfig {
  name: string
  description: string
  instagram: string
  x: string
  linkedin: string
  email: string
}

let cachedConfig: SiteConfig | null = null

export function getSiteConfig(): SiteConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  // Always check environment variables first (for Vercel)
  // Use try-catch to ensure we never throw
  let envConfig: Partial<SiteConfig> = {}
  try {
    envConfig = {
      name: process.env.SITE_NAME,
      description: process.env.SITE_DESCRIPTION,
      instagram: process.env.INSTAGRAM,
      x: process.env.X_HANDLE,
      linkedin: process.env.LINKEDIN,
      email: process.env.EMAIL,
    }
  } catch (error) {
    // Ignore errors accessing env vars
  }

  // If ANY env vars are set, use them (Vercel deployment)
  // This ensures Vercel deployments work even if only some env vars are set
  if (envConfig.name || envConfig.description || envConfig.instagram || envConfig.x || envConfig.linkedin || envConfig.email) {
    cachedConfig = {
      name: envConfig.name || 'v11labs',
      description: envConfig.description || '',
      instagram: envConfig.instagram || '',
      x: envConfig.x || '',
      linkedin: envConfig.linkedin || '',
      email: envConfig.email || '',
    }
    return cachedConfig
  }

  // Otherwise, try to read from config file (local development)
  let configText: string | null = null
  const config: Partial<SiteConfig> = {}

  try {
    // Only try to read file in Node.js environment (server-side)
    if (typeof window === 'undefined' && typeof process !== 'undefined' && typeof fs !== 'undefined' && fs.existsSync) {
      try {
        const configPath = path.join(process.cwd(), 'configs', 'text')
        if (fs.existsSync(configPath)) {
          configText = fs.readFileSync(configPath, 'utf-8')
        }
      } catch (fileError) {
        // Silently ignore file read errors
      }
    }
  } catch (error) {
    // Silently ignore all errors
  }

  if (configText) {
    try {
      const lines = configText.split('\n').filter(line => line.trim())

      for (const line of lines) {
        try {
          const [key, ...valueParts] = line.split(':')
          const value = valueParts.join(':').trim()

          switch (key.trim().toLowerCase()) {
            case 'name':
              config.name = value
              break
            case 'description':
              config.description = value
              break
            case 'instagram':
              config.instagram = value
              break
            case 'x':
              config.x = value
              break
            case 'linkedin':
              config.linkedin = value
              break
            case 'email':
              config.email = value
              break
          }
        } catch (lineError) {
          // Ignore parsing errors for individual lines
        }
      }
    } catch (parseError) {
      // Ignore parsing errors
    }
  }

  // Final fallback with defaults - this should never throw
  try {
    cachedConfig = {
      name: config.name || process.env.SITE_NAME || 'v11labs',
      description: config.description || process.env.SITE_DESCRIPTION || '',
      instagram: config.instagram || process.env.INSTAGRAM || '',
      x: config.x || process.env.X_HANDLE || '',
      linkedin: config.linkedin || process.env.LINKEDIN || '',
      email: config.email || process.env.EMAIL || '',
    }
  } catch (error) {
    // Ultimate fallback - return hardcoded defaults
    cachedConfig = {
      name: 'v11labs',
      description: '',
      instagram: '',
      x: '',
      linkedin: '',
      email: '',
    }
  }

  return cachedConfig
}

export function getSocialLinks() {
  const config = getSiteConfig()

  return {
    instagram: config.instagram ? `https://instagram.com/${config.instagram.replace('@', '')}` : undefined,
    twitter: config.x ? `https://twitter.com/${config.x.replace('@', '')}` : undefined,
    linkedin: config.linkedin ? `https://linkedin.com/in/${config.linkedin.replace('@', '')}` : undefined,
    email: config.email ? `mailto:${config.email}` : undefined,
  }
}
