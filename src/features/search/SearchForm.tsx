import {Box, InputAdornment, TextField} from '@mui/material'
import {ChangeEvent, FormEventHandler, useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'

function SearchForm({searchTerm = ''}: {searchTerm: string}) {
  const [searchInput, setSearchInput] = useState(searchTerm)
  const navigate = useNavigate()

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = useCallback(
    e => {
      e.preventDefault()
      navigate(`/${searchInput}`)
    },
    [navigate, searchInput],
  )

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value), [])

  return (
    <Box component="form" onSubmit={onSubmitHandler}>
      <TextField
        name="searchTerm"
        fullWidth
        value={searchInput}
        label="Search"
        onChange={onChangeHandler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}

export default SearchForm
