export const useAuth = () => {
  const router = useRouter()
  
  const checkAuth = async () => {
    try {
      // Try to make an authenticated request to verify token
      await $fetch('/api/auth/verify')
      return true
    } catch (error) {
      // If auth fails, redirect to login
      await router.push('/login')
      return false
    }
  }
  
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      // Even if logout fails, redirect to login
      console.error('Logout error:', error)
    } finally {
      await router.push('/login')
    }
  }
  
  return {
    checkAuth,
    logout
  }
}