import {Box, IconButton, InputAdornment, TextField} from '@mui/material'
import {ChangeEvent, FormEventHandler, useCallback, useEffect, useRef, useState} from 'react'
import {useLocation, useNavigate} from 'react-router'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {useFiltersDispatch} from '../filter/FilterProvider.tsx'

function SearchForm({searchTerm = ''}: {searchTerm?: string}) {
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

  // Run clear handler on location change
  const location = useLocation()
  const inputField = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (location.pathname === '/') {
      setSearchInput('')
      inputField.current?.focus()
    }
  }, [location])

  return (
    <Box component="form" onSubmit={onSubmitHandler}>
      <TextField
        name="searchTerm"
        inputRef={inputField}
        fullWidth
        autoFocus
        value={searchInput}
        label="Search"
        onChange={onChangeHandler}
        slotProps={{
          input: {
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
          },
        }}
      />
    </Box>
  )
}

export default SearchForm
