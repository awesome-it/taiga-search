import './App.css'
import {useQuery} from '@tanstack/react-query'
import {useParams} from 'react-router-dom'
import {Card, CardContent, CardHeader, Container} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
// import {hasAuthParams, useAuth} from 'react-oidc-context'
// import {useEffect, useState} from 'react'
import {projectQuery, useAllTicketsQueries, userQuery, useSearchQueries} from './features/queries/queries.ts'
import SearchForm from './features/search/SearchForm.tsx'
import SearchResults from './features/search/SearchResults.tsx'
import TicketList from './features/widgets/TicketList.tsx'

function App() {
  // const auth = useAuth()
  const {searchTerm} = useParams()
  // const [hasTriedSignin, setHasTriedSignin] = useState(false)

  // useEffect(() => {
  //   if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading && !hasTriedSignin) {
  //     auth.signinRedirect()
  //     setHasTriedSignin(true)
  //   }
  // }, [auth, hasTriedSignin])
  //
  // if (auth.isLoading) {
  //   return <div>Loading...</div>
  // }
  //
  // if (auth.error) {
  //   return <div>Oops... {auth.error.message}</div>
  // }
  //
  // if (auth.isAuthenticated) {
  const {data: user} = useQuery(userQuery)
  const {data: projects} = useQuery(projectQuery)
  const {data: searchResult} = useSearchQueries(projects, searchTerm)
  const {data: allTickets} = useAllTicketsQueries()

  return (
    <Container
      sx={{
        width: {
          xs: '90vw',
          sm: '75vw',
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={12}>
          <SearchForm searchTerm={searchTerm ?? ''} />
        </Grid>

        {searchResult && searchTerm && (
          <Grid xs={12}>
            <SearchResults results={searchResult} />
          </Grid>
        )}

        {user && allTickets && !searchTerm && (
          <>
            <Grid xs={12} md={6} lg={3}>
              <Card>
                <CardHeader title="My Tickets" />
                <CardContent>
                  <TicketList tickets={allTickets.filter(ticket => ticket.assigned_to === user.id)} />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={6} lg={3}>
              <Card>
                <CardHeader title="Watched Tickets" />
                <CardContent>
                  <TicketList tickets={allTickets.filter(ticket => ticket.is_watcher)} />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={6} lg={3}>
              <Card>
                <CardHeader title="Unassigned Tickets" />
                <CardContent>
                  <TicketList tickets={allTickets.filter(ticket => !ticket.assigned_to)} />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={6} lg={3}>
              <Card>
                <CardHeader title="Tickets w/ Deadline" />
                <CardContent>
                  <TicketList
                    showDueDate
                    tickets={allTickets
                      .filter(ticket => ticket.due_date)
                      .sort((a, b) => (a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0))}
                  />
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  )
  // }
}

export default App
