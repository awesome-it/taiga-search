import './App.css'
import {useParams} from 'react-router-dom'
import {Container, Tab, useMediaQuery, useTheme} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {SyntheticEvent, useState} from 'react'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import useTaigaQueries from './features/queries/queries.ts'
import SearchForm from './features/search/SearchForm.tsx'
import SearchResults from './features/search/SearchResults.tsx'
import TicketWidget from './features/widgets/TicketWidget.tsx'
import ProjectFilter from './features/filter/ProjectFilter.tsx'
import FilterProvider from './features/filter/FilterProvider.tsx'

function App() {
  const {searchTerm} = useParams()
  const taigaQueries = useTaigaQueries()
  const theme = useTheme()
  const smallView = useMediaQuery(theme.breakpoints.down('md'))

  const {data: user} = taigaQueries.useUserQuery()
  const {data: allTickets} = taigaQueries.useAllTicketsQueries()

  const [currentTab, setCurrentTab] = useState('1')

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }

  return (
    <FilterProvider>
      <Container
        sx={{
          maxWidth: {
            xs: '100vw',
            sm: '100vw',
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={7} md={8}>
            <SearchForm searchTerm={searchTerm ?? ''} />
          </Grid>
          <Grid xs={12} sm={5} md={4}>
            <ProjectFilter />
          </Grid>

          {searchTerm && (
            <Grid xs={12} sx={{position: 'relative'}}>
              <SearchResults />
            </Grid>
          )}

          {user && allTickets && !searchTerm && !smallView && (
            <>
              <Grid xs={12} md={6} sx={{position: 'relative'}}>
                <TicketWidget
                  tickets={allTickets.filter(ticket => ticket.assigned_to === user.id)}
                  title="My Tickets"
                  style={{height: '38vh'}}
                />
              </Grid>
              <Grid xs={12} md={6} sx={{position: 'relative'}}>
                <TicketWidget
                  tickets={allTickets.filter(ticket => ticket.is_watcher)}
                  title="Watched Tickets"
                  style={{height: '38vh'}}
                />
              </Grid>
              <Grid xs={12} md={6} sx={{position: 'relative'}}>
                <TicketWidget
                  tickets={allTickets.filter(ticket => !ticket.assigned_to)}
                  title="Unassigned Tickets"
                  style={{maxHeight: '38vh'}}
                />
              </Grid>
              <Grid xs={12} md={6} sx={{position: 'relative'}}>
                <TicketWidget
                  tickets={allTickets
                    .filter(ticket => ticket.due_date)
                    .sort((a, b) => (a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0))}
                  title="Tickets w/ Deadline"
                  style={{maxHeight: '38vh'}}
                />
              </Grid>
            </>
          )}
          {user && allTickets && !searchTerm && smallView && (
            <TabContext value={currentTab}>
              <TabList onChange={handleTabChange} variant="scrollable" allowScrollButtonsMobile>
                <Tab label="My Tickets" value="1" />
                <Tab label="Watched Tickets" value="2" />
                <Tab label="Unassigned Tickets" value="3" />
                <Tab label="Tickets w/ Deadline" value="4" />
              </TabList>
              <TabPanel value="1" sx={{p: 0, width: '100%', maxHeight: '75vh', overflow: 'auto'}}>
                <TicketWidget tickets={allTickets.filter(ticket => ticket.assigned_to === user.id)} />
              </TabPanel>
              <TabPanel value="2" sx={{p: 0, width: '100%', maxHeight: '75vh', overflow: 'auto'}}>
                <TicketWidget tickets={allTickets.filter(ticket => ticket.is_watcher)} />
              </TabPanel>
              <TabPanel value="3" sx={{p: 0, width: '100%', maxHeight: '75vh', overflow: 'auto'}}>
                <TicketWidget tickets={allTickets.filter(ticket => !ticket.assigned_to)} />
              </TabPanel>
              <TabPanel value="4" sx={{p: 0, width: '100%', maxHeight: '75vh', overflow: 'auto'}}>
                <TicketWidget
                  tickets={allTickets
                    .filter(ticket => ticket.due_date)
                    .sort((a, b) => (a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0))}
                />
              </TabPanel>
            </TabContext>
          )}
        </Grid>
      </Container>
    </FilterProvider>
  )
}

export default App
