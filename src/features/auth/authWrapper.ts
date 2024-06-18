import {useAuth as useOidcAuth} from 'react-oidc-context'

const checkExpired = (token: string) => {
  const [, payload] = token.split('.')
  const {exp} = JSON.parse(atob(payload))
  return Date.now() > exp * 1000
}
const useAuth = () => {
  if (import.meta.env.VITE_TAIGA_API_LOGIN) {
    const accessToken = window.localStorage.getItem('token')
    if (accessToken && checkExpired(accessToken)) {
      const refreshToken = window.localStorage.getItem('refresh')
      if (refreshToken) {
        if (checkExpired(refreshToken)) {
          // Remove tokens from localStorage and reload to trigger login
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('refresh')
          window.location.reload()
        } else {
          // Try to refresh token
          fetch(`${import.meta.env.VITE_TAIGA_BASE_URL}/auth/refresh`, {
            headers: {
              'Content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              refresh: refreshToken,
            }),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Error refreshing token')
              }
              return response.json()
            })
            .then(data => {
              window.localStorage.setItem('token', JSON.stringify(data.auth_token))
              window.localStorage.setItem('refresh', JSON.stringify(data.refresh))
            })
            .catch(() => {
              window.localStorage.removeItem('token')
              window.localStorage.removeItem('refresh')
            })
        }
      }
    }
    return {
      token: window.localStorage.getItem('token') ? JSON.parse(window.localStorage.getItem('token')!) : undefined,
      invalidateToken: () => window.localStorage.removeItem('token'),
    }
  }

  const oidcAuth = useOidcAuth()
  return {
    token: oidcAuth.user?.access_token,
    invalidateToken: () => oidcAuth.removeUser(),
  }
}

export default useAuth
