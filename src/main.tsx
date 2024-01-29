import React from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {AuthProvider} from 'react-oidc-context'
import {User, WebStorageStateStore} from 'oidc-client-ts'
// import App from './App.tsx'
import Signin from './features/signin/Signin.tsx'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Signin />,
    },
    {
      path: '/:searchTerm',
      element: <Signin />,
    },
  ],
  {
    basename: '/search',
  },
)
const queryClient = new QueryClient()

const signinCallback = async (_user: User | void): Promise<void> => {
  async function login(keycloakToken: string) {
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
  const code = searchParams.get('code')!
  console.log('code', {code})
  window.history.replaceState({}, document.title, window.location.pathname)
  const user = await login(code)
    .then(result => {
      console.log('Result', {result})
    })
    .catch(error => {
      console.log('Error', {error})
    })

  console.log('LoggedIn', {user})

  console.log('User', {_user})
}

const userStoreProp = new WebStorageStateStore({store: window.localStorage})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider
      authority={`${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`}
      client_id={import.meta.env.VITE_KEYCLOAK_CLIENTID}
      redirect_uri={window.location.href}
      onSigninCallback={signinCallback}
      userStore={userStoreProp}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
)
