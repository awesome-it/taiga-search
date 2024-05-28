import {SyntheticEvent, useEffect, useState} from 'react'
import {CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material'
import {Autocomplete, Checkbox, TextField} from '@mui/material'
import {useFilters, useFiltersDispatch} from './FilterProvider.tsx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MultiSelectFilter<Type extends Record<string, any>>({
  data,
  filterKey,
  label,
  optionAttribute,
  valueAttribute,
}: {
  data: Type[]
  filterKey: string
  label: string
  optionAttribute: string
  valueAttribute?: string
}) {
  const [filter, setFilter] = useState<Type[]>([])
  const filters = useFilters()
  const setFilters = useFiltersDispatch()

  const icon = <CheckBoxOutlineBlank fontSize="small" />
  const checkedIcon = <CheckBox fontSize="small" />
  const handleChange = (_event: SyntheticEvent, value: Type[]) => {
    setFilter(value)
    setFilters(oldFilters => {
      return {
        ...oldFilters,
        [filterKey]: value.map(option => {
          return option[valueAttribute ?? 'id']
        }),
      }
    })
    localStorage.setItem('filterData', JSON.stringify({...filters, [filterKey]: value}))
  }

  useEffect(() => {
    const filterValue = filters[filterKey]
    if (filterValue && data) {
      setFilter(data.filter(element => filterValue.includes(element[valueAttribute ?? 'id'])))
    }
    return () => {
      setFilter([])
    }
  }, [filters, filterKey, data, valueAttribute])

  const equalityCheck = (option: Type, value: Type) => {
    return option.id === value.id
  }
  return (
    <Autocomplete
      multiple
      fullWidth
      options={data}
      limitTags={1}
      value={filter}
      disableCloseOnSelect
      onChange={handleChange}
      isOptionEqualToValue={equalityCheck}
      getOptionLabel={option => option[optionAttribute]}
      renderOption={(props, option, {selected}) => (
        <li {...props}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} sx={{mr: 1}} checked={selected} />
          {option[optionAttribute]}
        </li>
      )}
      renderInput={params => <TextField {...params} margin="normal" label={label} />}
    />
  )
}

export default MultiSelectFilter
