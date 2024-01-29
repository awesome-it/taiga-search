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
