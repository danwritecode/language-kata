import jwt from 'jsonwebtoken'

export interface AuthPayload {
  authenticated: true
  iat: number
  exp: number
}

export function signJWT(secret: string): string {
  const payload: Omit<AuthPayload, 'iat' | 'exp'> = {
    authenticated: true
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: '7d' // Token expires in 7 days
  })
}

export function verifyJWT(token: string, secret: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as AuthPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function getAuthCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  
  return cookies['auth-token'] || null
}