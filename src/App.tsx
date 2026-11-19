import './App.css'
import {useParams} from 'react-router'
import {Box, Stack} from '@mui/material'
import Grid from '@mui/material/Grid2'
import SearchForm from './features/search/SearchForm.tsx'
import SearchResults from './features/search/SearchResults.tsx'
import FilterProvider from './features/filter/FilterProvider.tsx'
import DashboardView from './features/widgets/DashboardView.tsx'
import QuickLinks, {QuickLinksToggle} from './features/widgets/QuickLinks.tsx'
import Filters from './features/filter/Filters.tsx'

function App() {
  const {searchTerm} = useParams()

  return (
    <FilterProvider>
      <Box display="flex" flexDirection="column" gap={2} flexGrow={1} m={2} sx={{minHeight: '0px'}}>
        {!searchTerm && <QuickLinks />}
        <Grid container spacing={2}>
          <Grid size={{xs: 12, sm: 9, md: 10}}>
            <SearchForm searchTerm={searchTerm} />
          </Grid>
          <Grid size={{xs: 12, sm: 3, md: 2}} alignItems="stretch" style={{display: 'flex'}}>
            <Stack direction="row" spacing={1} alignItems="stretch" sx={{flexGrow: 1}}>
              <Box sx={{display: 'flex', flexGrow: 1}}>
                <Filters />
              </Box>
              <QuickLinksToggle />
            </Stack>
          </Grid>
        </Grid>
        {searchTerm ? <SearchResults searchTerm={searchTerm} /> : <DashboardView />}
      </Box>
    </FilterProvider>
  )
}

export default App
