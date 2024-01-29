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
          url: document.location.href,
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
        })
        .catch(error => {
          console.log('Error', {error})
        })
      // TODO: when ready re-add finally
      // .finally(() => {
      //   window.history.replaceState({}, document.title, window.location.pathname)
      // })
    }
  }, [])

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
