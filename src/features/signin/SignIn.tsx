import {hasAuthParams, useAuth} from 'react-oidc-context'
import {useEffect, useState} from 'react'
import App from '../../App.tsx'

function SignIn() {
  const auth = useAuth()

  const [hasTriedSignIn, setHasTriedSignIn] = useState(false)

  useEffect(() => {
    return auth.events.addAccessTokenExpiring(() => {
      auth.signinSilent()
    })
  }, [auth])

  useEffect(() => {
    return auth.events.addAccessTokenExpired(() => {
      auth.signinSilent()
    })
  }, [auth])

  useEffect(() => {
    if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading && !hasTriedSignIn) {
      auth.signinRedirect()
      setHasTriedSignIn(true)
    }
  }, [auth, hasTriedSignIn])

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

export default SignIn
