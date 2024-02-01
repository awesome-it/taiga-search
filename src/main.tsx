import React from 'react'
import {createRoot} from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {AuthProvider} from 'react-oidc-context'
import {User, UserManager, WebStorageStateStore} from 'oidc-client-ts'
import {User as TaigaUser} from './types/taiga.ts'
import SignIn from './features/signin/SignIn.tsx'

class TaigaUserManager extends UserManager {
  protected async _signinEnd(url: string, verifySub?: string): Promise<User> {
    const logger = this._logger.create('_signinEnd')
    const login = async (keycloakToken: string): Promise<TaigaUser> => {
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
    const {response} = await this._client.readSigninResponseState(url, true)

    if (code) {
      try {
        const result = await login(code)
        response.access_token = result.auth_token
        response.refresh_token = result.refresh
      } catch (e) {
        logger.debug('Error on taiga login', e)
      }
    }

    return this._buildUser(response, verifySub)
  }
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SignIn />,
    },
    {
      path: '/:searchTerm',
      element: <SignIn />,
    },
  ],
  {
    basename: '/search',
  },
)
const queryClient = new QueryClient()

const userStoreProp = new WebStorageStateStore({store: window.localStorage})

const signInCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname)
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider
      authority={`${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`}
      client_id={import.meta.env.VITE_KEYCLOAK_CLIENTID}
      redirect_uri={window.location.origin + window.location.pathname}
      userStore={userStoreProp}
      scope="openid email"
      implementation={TaigaUserManager}
      disablePKCE
      onSigninCallback={signInCallback}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
)
