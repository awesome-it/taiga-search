import Keycloak from 'keycloak-js'
import {Issue, Project, SearchResults, Task, User, UserStory} from '../../types/taiga.ts'

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
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID,
})
keycloak
  .init({
    onLoad: 'login-required',
    flow: 'implicit',
    scope: 'openid email',
  })
  .then(async authenticated => {
    console.log('Keycloak login', {authenticated, keycloak})
    const result = await login(keycloak.token!)
    console.log({result})
  })
  .catch(error => {
    console.warn('Keycloak init', {error})
  })

async function fetchWithPath(path: string) {
  const response = await fetch(`${import.meta.env.VITE_TAIGA_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
    },
  })
  if (!response.ok) {
    const result = await response.json()
    throw new Error(result.message)
  }
  return response.json()
}

export async function getUserData(): Promise<User> {
  return fetchWithPath('/users/me')
}

export async function getAllUserStories(): Promise<UserStory[]> {
  return fetchWithPath('/userstories')
}

export async function getAllTasks(): Promise<Task[]> {
  return fetchWithPath('/tasks')
}

export async function getAllIssues(): Promise<Issue[]> {
  return fetchWithPath('/issues')
}

export async function getAllProjects(): Promise<Project[]> {
  return fetchWithPath('/projects')
}

export async function searchProject(id: number, searchTerm: string = ''): Promise<SearchResults> {
  return fetchWithPath(`/search?project=${id}&text=${searchTerm}`)
}
