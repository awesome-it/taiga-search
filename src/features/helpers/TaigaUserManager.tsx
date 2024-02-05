import {RefreshState, SigninResponse, User, UserManager} from 'oidc-client-ts'
import {User as TaigaUser} from '../../types/taiga.ts'

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
        const [, payload] = result.auth_token.split('.')
        response.expires_at = JSON.parse(atob(payload)).exp
      } catch (e) {
        logger.debug('Error on taiga login', e)
      }
    }

    return this._buildUser(response, verifySub)
  }

  protected async _useRefreshToken(state: RefreshState): Promise<User> {
    const logger = this._logger.create('_useRefreshToken')
    const refreshAuthToken = async (refresh_token: string): Promise<{auth_token: string; refresh: string}> => {
      const response = await fetch(`${import.meta.env.VITE_TAIGA_BASE_URL}/auth/refresh`, {
        headers: {
          'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          refresh: refresh_token,
        }),
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message)
      }
      return response.json()
    }

    const {refresh_token} = state
    const response = new SigninResponse(new URLSearchParams())

    try {
      const result = await refreshAuthToken(refresh_token)
      response.access_token = result.auth_token
      response.refresh_token = result.refresh
      const [, payload] = result.auth_token.split('.')
      response.expires_at = JSON.parse(atob(payload)).exp
    } catch (e) {
      logger.debug('Error on taiga token refresh', e)
    }

    const user = new User({...state, ...response})

    await this.storeUser(user)
    this._events.load(user)
    return user
  }
}

export default TaigaUserManager
