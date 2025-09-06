import { defineEventHandler, getHeader } from 'h3'
import { verifyJWT, getAuthCookie } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Check authentication
  const cookieHeader = getHeader(event, 'cookie')
  const token = getAuthCookie(cookieHeader)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  const payload = verifyJWT(token, config.jwtSecret)
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  
  return {
    success: true,
    authenticated: true
  }
})