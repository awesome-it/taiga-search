import {useQueries, useQuery} from '@tanstack/react-query'
import {useCallback} from 'react'
import useApi from '../api/api.ts'
import {Issue, Project, Task, UserStory} from '../../types/taiga.ts'

export const useUserQuery = () => {
  const {getUserData} = useApi()
  return useQuery({
    queryKey: ['user'],
    queryFn: getUserData,
  })
}
export const useProjectQuery = () => {
  const {getAllProjects} = useApi()
  return useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  })
}

export const useSearchAllTicketsQueries = (searchTerm: string) => {
  const {searchIssues, searchProjects, searchTasks, searchUserStories} = useApi()
  const doSearchIssues = useCallback((): Promise<Issue[]> => searchIssues(searchTerm), [searchIssues, searchTerm])
  const doSearchProjects = useCallback(
    (): Promise<Project[]> => searchProjects(searchTerm),
    [searchProjects, searchTerm],
  )
  const doSearchTasks = useCallback((): Promise<Task[]> => searchTasks(searchTerm), [searchTasks, searchTerm])
  const doSearchUserStories = useCallback(
    (): Promise<UserStory[]> => searchUserStories(searchTerm),
    [searchTerm, searchUserStories],
  )
  return useQueries({
    queries: [
      {
        queryKey: ['issues', searchTerm],
        queryFn: doSearchIssues,
        select: (data: Issue[]) => {
          return data.map(ticket => {
            ticket.ticketType = 'issue'
            ticket.isProject = false
            ticket.path = `/project/${ticket.project_extra_info.slug}/issue/${ticket.ref}`
            return ticket
          })
        },
      },
      {
        queryKey: ['projects', searchTerm],
        queryFn: doSearchProjects,
        select: (data: Project[]) => {
          return data.map(ticket => {
            ticket.ticketType = 'project'
            ticket.isProject = true
            ticket.path = `/project/${ticket.slug}`
            return ticket
          })
        },
      },
      {
        queryKey: ['tasks', searchTerm],
        queryFn: doSearchTasks,
        select: (data: Task[]) => {
          return data.map(ticket => {
            ticket.ticketType = 'task'
            ticket.isProject = false
            ticket.path = `/project/${ticket.project_extra_info.slug}/task/${ticket.ref}`
            return ticket
          })
        },
      },
      {
        queryKey: ['userstories', searchTerm],
        queryFn: doSearchUserStories,
        select: (data: UserStory[]) => {
          return data.map(ticket => {
            ticket.ticketType = 'us'
            ticket.isProject = false
            ticket.path = `/project/${ticket.project_extra_info.slug}/us/${ticket.ref}`
            return ticket
          })
        },
      },
    ],
    combine: results => {
      return {
        data: results
          .map(result => result.data)
          .reduce(
            (a, b) => {
              if (b) {
                a.push(...b)
              }
              return a
            },
            [] as (UserStory | Task | Issue | Project)[],
          ),
        isLoading: results.some(result => result.isLoading),
        isError: results.some(result => result.isError),
        isSuccess: results.every(result => result.isSuccess),
      }
    },
  })
}

export const useAllTicketsQueries = () => {
  const {getAllUserStories, getAllTasks, getAllIssues} = useApi()
  return useQueries({
    queries: [
      {
        queryKey: ['userstories'],
        queryFn: getAllUserStories,
        select: (data: UserStory[]) => {
          return data.map(ticket => {
            ticket.ticketType = 'us'
            ticket.isProject = false
            ticket.path = `/project/${ticket.project_extra_info.slug}/us/${ticket.ref}`
            return ticket
          })
        },
      },
      {
        queryKey: ['tasks'],
        queryFn: getAllTasks,
        select: (data: Task[]) => {
          return data.map(ticket => {
            ticket.ticketType = 'task'
            ticket.isProject = false
            ticket.path = `/project/${ticket.project_extra_info.slug}/task/${ticket.ref}`
            return ticket
          })
        },
      },
      {
        queryKey: ['issues'],
        queryFn: getAllIssues,
        select: (data: Issue[]) => {
          return data.map(ticket => {
            ticket.ticketType = 'issue'
            ticket.isProject = false
            ticket.path = `/project/${ticket.project_extra_info.slug}/issue/${ticket.ref}`
            return ticket
          })
        },
      },
    ],
    combine: results => {
      return {
        data: results
          .map(result => result.data)
          .reduce(
            (a, b) => {
              if (b) {
                a.push(...b)
              }
              return a
            },
            [] as (UserStory | Task | Issue)[],
          ),
        isLoading: results.some(result => result.isLoading),
        isError: results.some(result => result.isError),
        isSuccess: results.every(result => result.isSuccess),
      }
    },
  })
}

const useTaigaQueries = () => {
  return {
    useUserQuery,
    useProjectQuery,
    useAllTicketsQueries,
    useSearchAllTicketsQueries,
  }
}

export default useTaigaQueries
