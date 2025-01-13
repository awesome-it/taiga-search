import './App.css'
import {useParams} from 'react-router-dom'
import {Box} from '@mui/material'
import Grid from '@mui/material/Grid2'
import SearchForm from './features/search/SearchForm.tsx'
import SearchResults from './features/search/SearchResults.tsx'
import FilterProvider from './features/filter/FilterProvider.tsx'
import DashboardView from './features/widgets/DashboardView.tsx'
import Filters from './features/filter/Filters.tsx'

function App() {
  const {searchTerm} = useParams()

  return (
    <FilterProvider>
      <Box display="flex" flexDirection="column" gap={2} flexGrow={1} m={2} sx={{minHeight: '0px'}}>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, sm: 9, md: 10}}>
            <SearchForm searchTerm={searchTerm} />
          </Grid>
          <Grid size={{xs: 12, sm: 3, md: 2}} alignItems="stretch" style={{display: 'flex'}}>
            <Filters />
          </Grid>
        </Grid>
        {searchTerm ? <SearchResults searchTerm={searchTerm} /> : <DashboardView />}
      </Box>
    </FilterProvider>
  )
}

export default App
