import {useInfiniteQuery, useQueries, useQuery, UseQueryResult} from '@tanstack/react-query'
import {useCallback} from 'react'
import useApi from '../api/api.ts'
import {Issue, Project, SearchResults, Task, UserStory} from '../../types/taiga.ts'
import {SearchResult} from '../../types/search.ts'

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

export const useAllTicketsQueriesPaginated = () => {
  const {getAllUserStoriesPaginated} = useApi()
  return useInfiniteQuery({
    queryKey: ['userstories'],
    queryFn: getAllUserStoriesPaginated,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.nextPage
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

export const useSearchQueries = (projects: Project[] | undefined, searchTerm: string | undefined) => {
  const {searchProject} = useApi()
  const searchProjects = useCallback(
    (projectId: number): Promise<SearchResults> => searchProject(projectId, searchTerm),
    [searchProject, searchTerm],
  )
  return useQueries({
    queries:
      projects && searchTerm
        ? projects.map(project => {
            return {
              queryKey: ['project', project.id, searchTerm],
              queryFn: () => searchProjects(project.id),
              select: (data: SearchResults) => {
                data.epics.map(epic => {
                  epic.path = `/project/${project.slug}/epic/${epic.id}`
                  epic.projectId = project.id
                  return epic
                })
                data.userstories.map(userstory => {
                  userstory.path = `/project/${project.slug}/us/${userstory.id}`
                  userstory.projectId = project.id
                  return userstory
                })
                data.issues.map(issue => {
                  issue.path = `/project/${project.slug}/issue/${issue.id}`
                  issue.projectId = project.id
                  return issue
                })
                data.tasks.map(task => {
                  task.path = `/project/${project.slug}/task/${task.id}`
                  task.projectId = project.id
                  return task
                })
                return data
              },
            }
          })
        : [],
    combine: (results: UseQueryResult<SearchResults, Error>[]) => {
      if (results.every(result => result.isSuccess)) {
        return {
          data: results.reduce(
            (a, b) => {
              a.epics.push(...b.data!.epics)
              a.userstories.push(...b.data!.userstories)
              a.issues.push(...b.data!.issues)
              a.tasks.push(...b.data!.tasks)
              return a
            },
            {
              epics: [],
              userstories: [],
              issues: [],
              tasks: [],
            } as SearchResult,
          ),
          pending: false,
        }
      }
      if (results.some(result => result.isSuccess)) {
        return {
          pending: 'partial',
          data: results.reduce(
            (a, b) => {
              if (b.data) {
                a.epics.push(...b.data.epics)
                a.userstories.push(...b.data.userstories)
                a.issues.push(...b.data.issues)
                a.tasks.push(...b.data.tasks)
              }
              return a
            },
            {
              epics: [],
              userstories: [],
              issues: [],
              tasks: [],
            } as SearchResult,
          ),
        }
      }

      return {
        pending: true,
      }
    },
  })
}

const useTaigaQueries = () => {
  return {
    useUserQuery,
    useProjectQuery,
    useAllTicketsQueries,
    useAllTicketsQueriesPaginated,
    useSearchQueries,
  }
}

export default useTaigaQueries
