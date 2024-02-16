import './App.css'
import {useParams} from 'react-router-dom'
import {Box} from '@mui/material'
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
        <Box display="flex" flexDirection="row" gap={2}>
          <Box flexGrow={3}>
            <SearchForm searchTerm={searchTerm} />
          </Box>
          <Box flexGrow={1}>
            <ProjectFilter />
          </Box>
        </Box>
        {searchTerm ? <SearchResults /> : <DashboardView />}
      </Box>
    </FilterProvider>
  )
}

export default App
