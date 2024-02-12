import {Box, IconButton, InputAdornment, TextField} from '@mui/material'
import {ChangeEvent, FormEventHandler, useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {useFiltersDispatch} from '../filter/FilterProvider.tsx'

function SearchForm({searchTerm = ''}: {searchTerm: string}) {
  const [searchInput, setSearchInput] = useState(searchTerm)
  const navigate = useNavigate()
  const setFilters = useFiltersDispatch()

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = useCallback(
    e => {
      e.preventDefault()
      navigate(`/${searchInput}`)
    },
    [navigate, searchInput],
  )

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value), [])

  const onClearHandler = useCallback(() => {
    setSearchInput('')
    setFilters(JSON.parse(localStorage.getItem('filterData') ?? '{}'))
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
