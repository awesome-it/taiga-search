import {Card, CardContent, CardHeader} from '@mui/material'
import {useCallback} from 'react'
import {useParams} from 'react-router-dom'
import {Issue, Project, Task, UserStory} from '../../types/taiga.ts'
import TicketList from './TicketList.tsx'
import {useFilters} from '../filter/FilterProvider.tsx'
import useTaigaQueries from '../queries/queries.ts'

function TicketWidget({
  tickets,
  title,
  style,
}: {
  tickets: (UserStory | Issue | Task | Project)[]
  title?: string
  style?: object
}) {
  const filters = useFilters()
  const taigaQueries = useTaigaQueries()
  const {data: allProjects} = taigaQueries.useProjectQuery()

  const filteredTickets = useCallback(() => {
    const {searchTerm} = useParams()
    let tempFilters = {} as {projects: number[]}

    if (searchTerm) {
      const re = /project:(\S+)/g
      const result = re.exec(searchTerm)
      if (result) {
        // Powersearch that filters for a project
        if (allProjects) {
          const project = allProjects.find(pro => {
            return result[1].trim().toLowerCase() === pro.name.toLowerCase()
          })
          if (project) {
            tempFilters = {...tempFilters, projects: [project!.id]}
          }
        }
      }
    }
    return tickets.filter(ticket => {
      let isFiltered = true
      if (filters && filters.projects && filters.projects.length > 0) {
        if (ticket.isProject) {
          isFiltered = filters.projects.includes(ticket.id)
        } else {
          isFiltered = filters.projects.includes(ticket.project)
        }
      }
      if (tempFilters && tempFilters.projects && tempFilters.projects.length > 0) {
        if (ticket.isProject) {
          isFiltered = tempFilters.projects.includes(ticket.id)
        } else {
          isFiltered = tempFilters.projects.includes(ticket.project)
        }
      }
      return isFiltered
    })
  }, [allProjects, filters, tickets])
  return (
    <Card variant="outlined">
      {title && (
        <CardHeader
          title={title}
          titleTypographyProps={{fontSize: '1rem', color: 'text.secondary'}}
          sx={{
            transformOrigin: 'top left',
            py: 0,
            px: 1,
            position: 'absolute',
            top: 0,
            left: '1rem',
            backgroundColor: 'white',
            transform: 'scale(0.75)',
          }}
        />
      )}
      <CardContent
        sx={{
          overflow: 'auto',
          px: 0,
          ...style,
        }}
      >
        <TicketList tickets={filteredTickets()} />
      </CardContent>
    </Card>
  )
}

export default TicketWidget
