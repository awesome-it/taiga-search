import './App.css'
import {useParams} from 'react-router-dom'
import {Box} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SearchForm from './features/search/SearchForm.tsx'
import SearchResults from './features/search/SearchResults.tsx'
import ProjectFilter from './features/filter/ProjectFilter.tsx'
import FilterProvider from './features/filter/FilterProvider.tsx'
import DashboardView from './features/widgets/DashboardView.tsx'

function App() {
  const {searchTerm} = useParams()

  return (
    <FilterProvider>
      <Box display="flex" flexDirection="column" gap={2} flexGrow={1} m={2} sx={{minHeight: '0px'}}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={7} md={8}>
            <SearchForm searchTerm={searchTerm} />
          </Grid>
          <Grid xs={12} sm={5} md={4}>
            <ProjectFilter />
          </Grid>
        </Grid>
        {searchTerm ? <SearchResults searchTerm={searchTerm} /> : <DashboardView />}
      </Box>
    </FilterProvider>
  )
}

export default App
