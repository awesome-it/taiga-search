import {Button, Typography} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {useCallback, useEffect, useMemo, useState} from 'react'
import useTaigaQueries from '../queries/queries.ts'
import TicketWidget from '../widgets/TicketWidget.tsx'
import {Issue, UserStory, Task, Project} from '../../types/taiga.ts'

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

  const cleanedSearchTerm = useMemo(() => {
    const re = /project:(\S+)/g
    const result = re.exec(searchTerm)
    if (result) {
      // Powersearch that filters for a project
      const search = searchTerm.replace(result[0], '').trim()
      return search.trim()
    }
    return searchTerm
  }, [searchTerm])

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
