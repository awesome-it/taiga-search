import Keycloak from 'keycloak-js'
import {Issue, Project, SearchResults, Task, User, UserStory} from '../../types/taiga.ts'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID,
})
keycloak
  .init({
    onLoad: 'login-required',
  })
  .catch(error => {
    console.warn(error)
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
