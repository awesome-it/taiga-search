import {Issue, Project, Status, Task, User, UserStory} from '../../types/taiga.ts'
import useAuth from '../auth/authWrapper.ts'

const useApi = () => {
  const auth = useAuth()
  const {token} = auth

  if (!token) {
    // If no access_token is present at this point it seems like there was a problem with the token refresh
    // to silently resolve this remove the user from the auth object. This triggers reauthentication.
    auth.invalidateToken()
  }
  async function useFetchWithPath(path: string) {
    const response = await fetch(`${import.meta.env.VITE_TAIGA_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-disable-pagination': 'true',
      },
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.detail)
    }
    return response.json()
  }

  return {
    getUserData: async (): Promise<User> => useFetchWithPath('/users/me'),
    getAllUserStories: async (): Promise<UserStory[]> =>
      useFetchWithPath('/userstories?status__is_archived=false&status__is_closed=false'),
    getAllTasks: async (): Promise<Task[]> => useFetchWithPath('/tasks?status__is_closed=false'),
    getAllIssues: async (): Promise<Issue[]> => useFetchWithPath('/issues?status__is_closed=false'),
    getAllProjects: async (): Promise<Project[]> => useFetchWithPath('/projects'),
    getAllUsers: async (): Promise<User[]> => useFetchWithPath('/users'),
    getIssueStatuses: async (): Promise<Status[]> => useFetchWithPath('/issue-statuses'),
    getTaskStatuses: async (): Promise<Status[]> => useFetchWithPath('/task-statuses'),
    getUserStoryStatuses: async (): Promise<Status[]> => useFetchWithPath('/userstory-statuses'),
    searchIssues: async (searchTerm: string): Promise<Issue[]> => useFetchWithPath(`/issues?q=${searchTerm}`),
    searchProjects: async (searchTerm: string): Promise<Project[]> => useFetchWithPath(`/projects?q=${searchTerm}`),
    searchTasks: async (searchTerm: string): Promise<Task[]> => useFetchWithPath(`/tasks?q=${searchTerm}`),
    searchUserStories: async (searchTerm: string): Promise<UserStory[]> =>
      useFetchWithPath(`/userstories?q=${searchTerm}`),
  }
}

export default useApi
