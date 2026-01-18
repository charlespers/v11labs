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

  const configPath = path.join(process.cwd(), 'configs', 'text')
  
  try {
    const configText = fs.readFileSync(configPath, 'utf-8')
    const config: Partial<SiteConfig> = {}
    
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
    
    cachedConfig = {
      name: config.name || 'Tech Blog',
      description: config.description || '',
      instagram: config.instagram || '',
      x: config.x || '',
      linkedin: config.linkedin || '',
      email: config.email || '',
    }
    
    return cachedConfig
  } catch (error) {
    console.error('Error reading config:', error)
    return {
      name: 'Tech Blog',
      description: '',
      instagram: '',
      x: '',
      linkedin: '',
    }
  }
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
