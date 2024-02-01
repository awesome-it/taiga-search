import {useAuth} from 'react-oidc-context'
import {Issue, Project, SearchResults, Task, User, UserStory} from '../../types/taiga.ts'

const useApi = () => {
  const auth = useAuth()
  const token = auth.user?.access_token
  async function useFetchWithPath(path: string) {
    const response = await fetch(`${import.meta.env.VITE_TAIGA_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-disable-pagination': 'true',
      },
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.message)
    }
    return response.json()
  }

  async function useFetchWithPathPaginated(path: string, page = 1) {
    const response = await fetch(`${import.meta.env.VITE_TAIGA_BASE_URL}${path}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.message)
    }

    let nextPage = -1
    if (!!response.headers.get('X-Pagination-Next') && response.headers.get('X-Pagination-Current') != null) {
      nextPage = parseInt(response.headers.get('X-Pagination-Current')!, 10) + 1
    }
    console.log('Next pagination', response.headers.get('X-Pagination-Next'))
    console.log('Next page', nextPage)
    const data = await response.json()
    return {data, nextPage} as {data: UserStory[]; nextPage: number}
  }

  return {
    getUserData: async (): Promise<User> => useFetchWithPath('/users/me'),
    getAllUserStories: async (): Promise<UserStory[]> =>
      useFetchWithPath('/userstories?status__is_archived=false&status__is_closed=false'),
    getAllUserStoriesPaginated: async ({
      pageParam,
    }: {
      pageParam: number
    }): Promise<{data: UserStory[]; nextPage: number}> => useFetchWithPathPaginated('/userstories', pageParam),
    getAllTasks: async (): Promise<Task[]> => useFetchWithPath('/tasks?status__is_closed=false'),
    getAllIssues: async (): Promise<Issue[]> => useFetchWithPath('/issues?status__is_closed=false'),
    getAllProjects: async (): Promise<Project[]> => useFetchWithPath('/projects'),
    searchProject: async (id: number, searchTerm: string = ''): Promise<SearchResults> =>
      useFetchWithPath(`/search?project=${id}&text=${searchTerm}`),
  }
}

export default useApi
