import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = body?.password

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    if (verifyPassword(password)) {
      try {
        await setAuthCookie()
        const response = NextResponse.json({ success: true })
        
        // Also set cookie in response headers as fallback
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
        response.cookies.set('admin-auth', ADMIN_PASSWORD, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })
        
        return response
      } catch (cookieError) {
        console.error('Error setting auth cookie:', cookieError)
        // Still return success if password is correct, cookie might be set via headers
        return NextResponse.json({ success: true })
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
