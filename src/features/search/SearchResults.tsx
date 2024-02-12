import {Link, Typography} from '@mui/material'
import {Link as RouterLink, useParams} from 'react-router-dom'
import {useCallback} from 'react'
import useTaigaQueries from '../queries/queries.ts'
import TicketWidget from '../widgets/TicketWidget.tsx'

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
  const cleanSearchTerm = useCallback((searchTermToParse: string) => {
    const re = /project:(\w+)/g
    const result = re.exec(searchTermToParse)
    if (result) {
      // Powersearch that filters for a project
      const search = searchTermToParse.replace(result[0], '').trim()

      return search.trim()
    }
    return searchTermToParse
  }, [])

  const {data: allTickets, isLoading} = taigaQueries.useSearchAllTicketsQueries(cleanSearchTerm(searchTerm))

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
  return (
    <TicketWidget
      tickets={allTickets.sort((a, b) => {
        if (a.ticketType === 'project' && b.ticketType !== 'project') {
          return -1
        }
        if (a.ticketType !== 'project' && b.ticketType === 'project') {
          return 1
        }
        return 0
      })}
      title={`Results for ${searchTerm}`}
      style={{height: '82vh'}}
    />
  )
}

export default SearchResults
