import {hasAuthParams, useAuth} from 'react-oidc-context'
import {useEffect, useState} from 'react'
import App from '../../App.tsx'

function Signin() {
  const auth = useAuth()

  const [hasTriedSignin, setHasTriedSignin] = useState(false)
  useEffect(() => {
    if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading && !hasTriedSignin) {
      auth.signinRedirect()
      setHasTriedSignin(true)
    }
  }, [auth, hasTriedSignin])

  useEffect(() => {
    const login = async (keycloakToken: string) => {
      const response = await fetch(`${import.meta.env.VITE_TAIGA_BASE_URL}/auth`, {
        headers: {
          'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          type: 'openid',
          code: keycloakToken,
          url: document.location.origin + document.location.pathname,
        }),
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message)
      }
      return response.json()
    }
    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get('code')

    if (code) {
      login(code)
        .then(result => {
          console.log('Result', {result})
          console.log('User', auth.user)
          window.localStorage.setItem('auth-token', result.auth_token)
          window.localStorage.setItem('refresh-token', result.refresh)
          auth.isAuthenticated = true
        })
        .catch(error => {
          console.log('Error', {error})
        })
        .finally(() => {
          window.history.replaceState({}, document.title, window.location.pathname)
        })
    }
  }, [auth])

  console.log('Auth', {auth})
  console.log('Authenticated', auth.isAuthenticated)

  if (auth.isLoading) {
    return <div>Loading...</div>
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>
  }

  if (auth.isAuthenticated) {
    return <App />
  }
}

export default Signin
