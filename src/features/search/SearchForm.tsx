import {Box, IconButton, InputAdornment, TextField} from '@mui/material'
import {ChangeEvent, FormEventHandler, useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import useTaigaQueries from '../queries/queries.ts'
import {useFiltersDispatch} from '../filter/FilterProvider.tsx'

function SearchForm({searchTerm = ''}: {searchTerm: string}) {
  const [searchInput, setSearchInput] = useState(searchTerm)
  const navigate = useNavigate()
  const taigaQueries = useTaigaQueries()
  const {data: allProjects} = taigaQueries.useProjectQuery()
  const setFilters = useFiltersDispatch()

  const parseFilters = useCallback(
    (searchTermToParse: string) => {
      const re = /project:(\w+)/g
      const result = re.exec(searchTermToParse)
      if (result) {
        // Powersearch that filters for a project
        const search = searchTermToParse.replace(result[0], '').trim()

        if (allProjects) {
          const project = allProjects.find(pro => {
            return result[1].trim().toLowerCase() === pro.name.toLowerCase()
          })
          if (project) {
            setFilters(filters => {
              const newProjects =
                !filters.projects || filters.projects.length === 0
                  ? [project!.id]
                  : filters.projects && filters.projects.length > 0 && !filters.projects.includes(project!.id)
                    ? [...filters.projects, project!.id]
                    : filters.projects

              return {...filters, projects: newProjects}
            })
          }
          return search.trim()
        }
      }
      return searchTermToParse
    },
    [setFilters, allProjects],
  )

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = useCallback(
    e => {
      e.preventDefault()
      const parsedSearch = parseFilters(searchInput)
      setSearchInput(parsedSearch)
      navigate(`/${parsedSearch}`)
    },
    [navigate, searchInput, parseFilters],
  )

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value), [])

  const onClearHandler = useCallback(() => {
    setSearchInput('')
    setFilters(JSON.parse(sessionStorage.getItem('filterData') ?? '{}'))
    navigate('/')
  }, [setFilters, navigate])

  return (
    <Box component="form" onSubmit={onSubmitHandler}>
      <TextField
        name="searchTerm"
        fullWidth
        autoFocus
        value={searchInput}
        label="Search"
        onChange={onChangeHandler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton aria-label="Clear search" onClick={onClearHandler}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}

export default SearchForm
