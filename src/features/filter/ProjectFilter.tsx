import {Autocomplete, Checkbox, TextField} from '@mui/material'
import {SyntheticEvent, useEffect, useState} from 'react'
import {CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material'
import useTaigaQueries from '../queries/queries.ts'
import {Project} from '../../types/taiga.ts'
import {useFilters, useFiltersDispatch} from './FilterProvider.tsx'

function ProjectFilter() {
  const taigaQueries = useTaigaQueries()
  const [projectsFilter, setProjectsFilter] = useState<Project[]>([])
  const {data: allProjects} = taigaQueries.useProjectQuery()
  const filters = useFilters()
  const setFilters = useFiltersDispatch()

  const icon = <CheckBoxOutlineBlank fontSize="small" />
  const checkedIcon = <CheckBox fontSize="small" />
  const handleChange = (_event: SyntheticEvent, value: Project[]) => {
    setProjectsFilter(value)
    setFilters({projects: value.map(project => project.id)})
    localStorage.setItem('filterData', JSON.stringify({projects: value.map(project => project.id)}))
  }

  useEffect(() => {
    const {projects} = filters
    if (projects && allProjects) {
      setProjectsFilter(allProjects.filter(project => projects.includes(project.id)))
    }
    return () => {
      setProjectsFilter([])
    }
  }, [filters, allProjects])

  const equalityCheck = (option: Project, value: Project) => {
    return option.id === value.id
  }
  return (
    <Autocomplete
      multiple
      fullWidth
      id="projecs-filter"
      options={allProjects ?? []}
      limitTags={1}
      value={projectsFilter}
      disableCloseOnSelect
      onChange={handleChange}
      isOptionEqualToValue={equalityCheck}
      getOptionLabel={option => option.name}
      renderOption={(props, option, {selected}) => (
        <li {...props}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} style={{marginRight: 8}} checked={selected} />
          {option.name}
        </li>
      )}
      renderInput={params => <TextField {...params} label="Projects Filter" />}
    />
  )
}

export default ProjectFilter
