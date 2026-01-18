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

  // Try to read from config file, fallback to environment variables
  let configText: string | null = null
  
  try {
    const configPath = path.join(process.cwd(), 'configs', 'text')
    configText = fs.readFileSync(configPath, 'utf-8')
  } catch (error) {
    // If file doesn't exist (e.g., in Vercel), try to read from env vars
    console.log('Config file not found, using environment variables')
  }
  
  const config: Partial<SiteConfig> = {}
  
  if (configText) {
    const lines = configText.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
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
    }
  }
  
  // Fallback to environment variables if config file not available
  cachedConfig = {
    name: config.name || process.env.SITE_NAME || 'Tech Blog',
    description: config.description || process.env.SITE_DESCRIPTION || '',
    instagram: config.instagram || process.env.INSTAGRAM || '',
    x: config.x || process.env.X_HANDLE || '',
    linkedin: config.linkedin || process.env.LINKEDIN || '',
    email: config.email || process.env.EMAIL || '',
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
