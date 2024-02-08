import {Card, CardContent, CardHeader} from '@mui/material'
import {useCallback} from 'react'
import {Issue, Project, Task, UserStory} from '../../types/taiga.ts'
import TicketList from './TicketList.tsx'
import {useFilters} from '../filter/FilterProvider.tsx'

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

  const filteredTickets = useCallback(() => {
    return tickets.filter(ticket => {
      if (filters && filters.projects && filters.projects.length > 0) {
        if (ticket.isProject) {
          return filters.projects.includes(ticket.id)
        }
        return filters.projects.includes(ticket.project)
      }
      return true
    })
  }, [filters, tickets])
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
