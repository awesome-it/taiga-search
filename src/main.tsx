import React from 'react'
import {createRoot} from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {AuthProvider} from 'react-oidc-context'
import {WebStorageStateStore} from 'oidc-client-ts'
import SignIn from './features/signin/SignIn.tsx'
import TaigaUserManager from './features/helpers/TaigaUserManager.tsx'
import {ApiSignIn} from './features/signin/ApiSignIn.tsx'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: import.meta.env.VITE_TAIGA_API_LOGIN ? <ApiSignIn /> : <SignIn />,
    },
    {
      path: '/:searchTerm',
      element: import.meta.env.VITE_TAIGA_API_LOGIN ? <ApiSignIn /> : <SignIn />,
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
