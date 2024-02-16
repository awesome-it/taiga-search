import {Box, Paper, Theme, Typography, useTheme} from '@mui/material'
import {useMemo} from 'react'
import {useParams} from 'react-router-dom'
import {SxProps} from '@mui/system'
import {Issue, Project, Task, UserStory} from '../../types/taiga.ts'
import TicketList from './TicketList.tsx'
import {useFilters} from '../filter/FilterProvider.tsx'
import useTaigaQueries from '../queries/queries.ts'

function TicketWidget({
  tickets,
  title,
  sx,
}: {
  tickets: (UserStory | Issue | Task | Project)[]
  title?: string
  sx?: SxProps<Theme>
}) {
  const filters = useFilters()
  const taigaQueries = useTaigaQueries()
  const {data: allProjects} = taigaQueries.useProjectQuery()
  const theme = useTheme()
  const {searchTerm} = useParams()

  const filteredTickets = useMemo(() => {
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
  }, [allProjects, filters, searchTerm, tickets])

  return (
    <Paper
      variant="outlined"
      sx={{flexGrow: '1', display: 'flex', flexDirection: 'column', minHeight: '0px', position: 'relative', ...sx}}
    >
      {title && (
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            position: 'absolute',
            left: theme.spacing(1),
            top: theme.spacing(-1),
            p: 0,
            py: 0,
            px: 0.5,
            margin: 0,
            backgroundColor: 'white',
            zIndex: theme.zIndex.appBar,
          }}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          fontSize: '25px',
        }}
      >
        <TicketList tickets={filteredTickets} />
      </Box>
    </Paper>
  )
}

export default TicketWidget
