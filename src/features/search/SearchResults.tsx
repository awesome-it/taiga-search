import {Button, Typography} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {useCallback, useEffect, useMemo, useState} from 'react'
import useTaigaQueries from '../queries/queries.ts'
import TicketWidget from '../widgets/TicketWidget.tsx'
import {Issue, UserStory, Task, Project} from '../../types/taiga.ts'
import {useFilters} from '../filter/FilterProvider.tsx'

const sortByProject = (a: Issue | UserStory | Task | Project, b: Issue | UserStory | Task | Project) => {
  if (a.ticketType === 'project' && b.ticketType !== 'project') {
    return -1
  }
  if (a.ticketType !== 'project' && b.ticketType === 'project') {
    return 1
  }
  return 0
}

const ReturnToDashboardLink = () => {
  const navigate = useNavigate()
  const handleClick = useCallback(() => navigate('/'), [navigate])

  return (
    <Button variant="text" onClick={handleClick}>
      Return to dashboard
    </Button>
  )
}

function SearchResults({searchTerm}: {searchTerm: string}) {
  const taigaQueries = useTaigaQueries()
  const filters = useFilters()

  const cleanedSearchTerm = useMemo(() => {
    const projectRe = /project:(\S+)/g
    const statusRe = /status:(!?)(".+"|\S+)/g
    const assigneeRe = /assignee:(!?)(".+"|\S+)/g
    const result = projectRe.exec(searchTerm)
    let search = searchTerm
    if (result) {
      // Powersearch that filters for a project
      search = searchTerm.replace(result[0], '').trim()
    }
    const statusResult = statusRe.exec(search)
    if (statusResult) {
      // Powersearch on status done or not done
      search = search.replace(statusResult[0], '').trim()
      const negation = statusResult[1] === '!'
      const status = statusResult[2]
      if (status === 'done') {
        search = `${search}&status__is_closed=${!negation}`
      }
    }
    const assigneeResult = assigneeRe.exec(search)
    if (assigneeResult) {
      // Powersearch on assignee
      search = search.replace(assigneeResult[0], '').trim()
    }
    if (filters.doneTickets) {
      if (!search.includes('status__is_closed')) {
        search = `${search}&status__is_closed=false`
      }
    }
    return search
  }, [filters, searchTerm])

  const {data: allTickets, ...searchQuery} = taigaQueries.useSearchAllTicketsQueries({searchTerm: cleanedSearchTerm})
  const sortedTickets = useMemo(() => allTickets.sort(sortByProject), [allTickets])

  // Handle loading state which is true on loading.
  const [isLoading, setLoading] = useState<boolean>(true)
  useEffect(() => setLoading(searchQuery.isLoading), [searchQuery.isLoading])

  return (
    <TicketWidget isLoading={isLoading} tickets={sortedTickets} title={`Results for "${searchTerm}"`}>
      <Typography>Sorry! There are no results for &quot;{searchTerm}&quot;</Typography>
      <ReturnToDashboardLink />
    </TicketWidget>
  )
}

export default SearchResults
