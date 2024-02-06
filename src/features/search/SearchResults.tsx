import {Link, Typography} from '@mui/material'
import {Link as RouterLink, useParams} from 'react-router-dom'
import useTaigaQueries from '../queries/queries.ts'
import TicketWidget from '../widgets/TicketWidget.tsx'

function SearchResults() {
  const {searchTerm} = useParams()

  const taigaQueries = useTaigaQueries()
  const {data: allTickets, isLoading} = taigaQueries.useSearchAllTicketsQueries(searchTerm!)

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
  return <TicketWidget tickets={allTickets} title={`Results for ${searchTerm}`} style={{height: '82vh'}} />
}

export default SearchResults
