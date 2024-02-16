import {Link, Typography} from '@mui/material'
import {Link as RouterLink, useParams} from 'react-router-dom'
import {useMemo} from 'react'
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

function SearchResults() {
  const {searchTerm} = useParams()
  const taigaQueries = useTaigaQueries()

  if (!searchTerm) {
    return (
      <Typography>
        Sorry, an error occured.
        <br />
        <Link component={RouterLink} to="/" reloadDocument>
          Return to dashboard
        </Link>
      </Typography>
    )
  }

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

  const {data: allTickets, isLoading} = taigaQueries.useSearchAllTicketsQueries(cleanedSearchTerm)
  const sortedTickets = useMemo(() => allTickets.sort(sortByProject), [allTickets])

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (allTickets && allTickets.length === 0) {
    return (
      <Typography>
        Sorry! There are no results for &quot;{searchTerm}&quot; <br />
        <Link component={RouterLink} to="/" reloadDocument>
          Return to dashboard
        </Link>
      </Typography>
    )
  }
  return <TicketWidget tickets={sortedTickets} title={`Results for "${searchTerm}"`} />
}

export default SearchResults
