import { defineEventHandler, readBody, setCookie } from 'h3'
import { signJWT } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  if (!body.passkey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Passkey is required'
    })
  }
  
  // Validate passkey against server configuration
  if (body.passkey !== config.passkey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid passkey'
    })
  }
  
  // Generate JWT token
  const token = signJWT(config.jwtSecret)
  
  // Set secure HTTP-only cookie
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  
  return {
    success: true,
    message: 'Authenticated successfully'
  }
})