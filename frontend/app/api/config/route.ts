import { getSiteConfig, getSocialLinks } from '@/lib/config'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const config = getSiteConfig()
        const socialLinks = getSocialLinks()

        return NextResponse.json({
            config: {
                name: config.name,
                description: config.description,
            },
            socialLinks,
        })
    } catch (error) {
        // Return defaults if config loading fails
        return NextResponse.json({
            config: {
                name: process.env.SITE_NAME || 'v11labs',
                description: process.env.SITE_DESCRIPTION || 'Tech breakdowns related to robotics and hardware software codesign',
            },
            socialLinks: {
                instagram: process.env.INSTAGRAM ? `https://instagram.com/${process.env.INSTAGRAM.replace('@', '')}` : undefined,
                twitter: process.env.X_HANDLE ? `https://twitter.com/${process.env.X_HANDLE.replace('@', '')}` : undefined,
                linkedin: process.env.LINKEDIN ? `https://linkedin.com/in/${process.env.LINKEDIN.replace('@', '')}` : undefined,
                email: process.env.EMAIL ? `mailto:${process.env.EMAIL}` : undefined,
            },
        })
    }
}
