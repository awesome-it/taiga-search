import {Box, Chip, Paper, Theme, Tooltip, Typography, useTheme} from '@mui/material'
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
  isLoading = false,
  givenTicketCount,
  previousTicketCount,
  sx,
  children,
}: React.PropsWithChildren<{
  tickets: (UserStory | Issue | Task | Project)[]
  isLoading?: boolean
  givenTicketCount?: number
  previousTicketCount?: number
  title?: string
  sx?: SxProps<Theme>
}>) {
  const filters = useFilters()
  const taigaQueries = useTaigaQueries()
  const {data: allProjects, ...projectQuery} = taigaQueries.useProjectQuery()
  const theme = useTheme()
  const {searchTerm} = useParams()

  const filteredTickets = useMemo(() => {
    let tempFilters = {} as {
      projects?: {exclude: boolean; projects: number[]}
      status?: {exclude: boolean; name: string}
      assignee?: {exclude: boolean; name: string}
    }

    if (searchTerm) {
      const projectRe = /project:(!?)(\S+)/g
      const statusRe = /status:(!?)(".+"|\S+)/g
      const assigneeRe = /assignee:(!?)(".+"|\S+)/g
      const result = projectRe.exec(searchTerm)
      if (result) {
        // Powersearch that filters for a project
        if (allProjects) {
          const negation = result[1] === '!'
          const project = allProjects.find(pro => {
            return result[2].trim().toLowerCase() === pro.name.toLowerCase()
          })
          if (project) {
            tempFilters = {...tempFilters, projects: {exclude: negation, projects: [project!.id]}}
          }
        }
      }
      const statusResult = statusRe.exec(searchTerm)
      if (statusResult) {
        // Powersearch on status done or not done
        const negation = statusResult[1] === '!'
        const status = statusResult[2].toLowerCase().replace(/"/g, '')
        if (status !== 'done') {
          tempFilters = {...tempFilters, status: {exclude: negation, name: status}}
        }
      }
      const assigneeResult = assigneeRe.exec(searchTerm)
      if (assigneeResult) {
        // Powersearch on assignee
        const negation = assigneeResult[1] === '!'
        const assignee = assigneeResult[2].toLowerCase().replace(/"/g, '')
        tempFilters = {...tempFilters, assignee: {exclude: negation, name: assignee}}
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
        if (filters.projectsExclude) {
          isFiltered = !isFiltered
        }
      }
      if (isFiltered && filters && filters.assignees && filters.assignees.length > 0) {
        if (!ticket.isProject) {
          isFiltered = filters.assignees.includes(ticket.assigned_to)
        }
      }
      if (isFiltered && filters && filters.statuses && filters.statuses.length > 0) {
        if (!ticket.isProject) {
          isFiltered = filters.statuses.includes(ticket.status_extra_info.name)
        }
      }
      if (isFiltered && filters && !filters.doneTickets) {
        if (!ticket.isProject) {
          isFiltered = !ticket.status_extra_info.is_closed
        }
      }
      if (isFiltered && tempFilters && tempFilters.projects) {
        if (ticket.isProject) {
          isFiltered = tempFilters.projects.projects.includes(ticket.id)
        } else {
          isFiltered = tempFilters.projects.projects.includes(ticket.project)
        }
        if (tempFilters.projects.exclude) {
          isFiltered = !isFiltered
        }
      }
      if (isFiltered && tempFilters && tempFilters.status) {
        if (!ticket.isProject) {
          isFiltered = tempFilters.status.exclude
            ? ticket.status_extra_info.name.toLowerCase() !== tempFilters.status.name
            : ticket.status_extra_info.name.toLowerCase() === tempFilters.status.name
        }
      }
      if (isFiltered && tempFilters && tempFilters.assignee) {
        if (!ticket.isProject) {
          isFiltered = tempFilters.assignee.exclude
            ? !ticket.assigned_to_extra_info ||
              ticket.assigned_to_extra_info.full_name_display.toLowerCase() !== tempFilters.assignee.name
            : ticket.assigned_to_extra_info?.full_name_display.toLowerCase() === tempFilters.assignee.name
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
            top: theme.spacing(-1.5),
            p: 0,
            py: 0,
            px: 0.5,
            margin: 0,
            backgroundColor: 'white',
            zIndex: theme.zIndex.appBar,

            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {title}
          {!givenTicketCount ? (
            <Chip sx={{ml: 1}} color="primary" label={filteredTickets.length} size="small" />
          ) : (
            <Tooltip
              title={
                filteredTickets.length !== givenTicketCount &&
                `Filter matches ${filteredTickets.length} of ${givenTicketCount} tickets`
              }
            >
              <Chip
                sx={{ml: 1}}
                color="primary"
                label={`${filteredTickets.length !== givenTicketCount ? `${filteredTickets.length} / ` : ''}${givenTicketCount}`}
                size="small"
              />
            </Tooltip>
          )}
          {givenTicketCount && previousTicketCount && (
            <Tooltip
              title={
                givenTicketCount !== previousTicketCount
                  ? givenTicketCount < previousTicketCount
                    ? `${previousTicketCount - givenTicketCount} tickets less than at last visit`
                    : `${givenTicketCount - previousTicketCount} tickets more than at last visit`
                  : 'Same amount of tickets as on last visit'
              }
            >
              <Chip
                sx={{ml: 1}}
                color={
                  givenTicketCount !== previousTicketCount
                    ? givenTicketCount < previousTicketCount
                      ? 'success'
                      : 'error'
                    : 'warning'
                }
                label={
                  givenTicketCount === previousTicketCount
                    ? '0'
                    : `${givenTicketCount - previousTicketCount > 0 ? '+' : ''}${givenTicketCount - previousTicketCount}`
                }
                size="small"
              />
            </Tooltip>
          )}
        </Typography>
      )}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          fontSize: '25px',
        }}
      >
        <TicketList isLoading={projectQuery.isLoading || isLoading} tickets={filteredTickets}>
          {children}
        </TicketList>
      </Box>
    </Paper>
  )
}

export default TicketWidget
