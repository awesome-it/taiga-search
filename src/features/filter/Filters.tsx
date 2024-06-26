import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useTheme,
} from '@mui/material'
import {SyntheticEvent, useCallback, useMemo, useState} from 'react'
import {FilterList} from '@mui/icons-material'
import useTaigaQueries from '../queries/queries.ts'
import {useFilters, useFiltersDispatch, useTemporaryFilters, useTemporaryFiltersDispatch} from './FilterProvider.tsx'
import {Project, Status, User} from '../../types/taiga.ts'
import MultiSelectFilter from './MultiSelectFilter.tsx'

function ProjectsFilter() {
  const taigaQueries = useTaigaQueries()
  const {data: allProjects} = taigaQueries.useProjectQuery()

  return (
    <MultiSelectFilter<Project> data={allProjects ?? []} filterKey="projects" label="Projects" optionAttribute="name" />
  )
}

function StatusesFilter() {
  const taigaQueries = useTaigaQueries()
  const {data: allStatuses} = taigaQueries.useAllStatusesQuery()

  return (
    <MultiSelectFilter<Status>
      data={allStatuses ?? []}
      filterKey="statuses"
      label="Statuses"
      optionAttribute="name"
      valueAttribute="name"
    />
  )
}

function AssigneesFilter() {
  const taigaQueries = useTaigaQueries()
  const {data: allUsers} = taigaQueries.useAllUsersQuery()

  return (
    <MultiSelectFilter<User>
      data={allUsers ?? []}
      filterKey="assignees"
      label="Assignees"
      optionAttribute="full_name"
    />
  )
}

function DoneTicketsCheckbox() {
  const filters = useTemporaryFilters()
  const setFilters = useTemporaryFiltersDispatch()

  const handleChange = (_event: SyntheticEvent, checked: boolean) => {
    setFilters(oldFilters => {
      return {
        ...oldFilters,
        doneTickets: checked,
      }
    })
  }

  return (
    <FormControlLabel
      control={
        <Checkbox checked={filters.doneTickets} onChange={handleChange} inputProps={{'aria-label': 'done tickets'}} />
      }
      label="Show Resolved Tickets"
    />
  )
}

function PowerSearchHint() {
  return (
    <Typography component="span" style={{whiteSpace: 'nowrap'}}>
      <strong>Power search</strong> allows you to search for tickets using the following syntax:
      <ul>
        <li>
          project:<code>project_name</code>
        </li>
        <li>
          status:<code>status</code>
        </li>
        <li>
          status<code>!status</code>
        </li>
        <li>
          assignee:<code>assignee_name</code>
        </li>
        <li>
          assignee:<code>!assignee_name</code>
        </li>
      </ul>
      <span style={{whiteSpace: 'nowrap'}}>
        For example: <code>project:MyProject my search text</code>
      </span>
      <br />
      The position of the searchterm in relation to the powersearch options does not matter.
    </Typography>
  )
}

const TooltipImpl = styled(({className, ...props}: TooltipProps) => (
  <Tooltip {...props} classes={{popper: className}} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
})

function FilterDialog({isOpen, setOpen}: {isOpen: boolean; setOpen: (value: boolean) => void}) {
  const setTemporaryFilters = useTemporaryFiltersDispatch()
  const setFilters = useFiltersDispatch()
  const filters = useFilters()
  const temporaryFilters = useTemporaryFilters()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleAbort = useCallback(() => {
    setTemporaryFilters(filters)
    handleClose()
  }, [filters, handleClose, setTemporaryFilters])

  const handleApply = useCallback(() => {
    setFilters(temporaryFilters)
    localStorage.setItem('filterData', JSON.stringify({...temporaryFilters}))
    handleClose()
  }, [handleClose, setFilters, temporaryFilters])

  const handleClear = useCallback(() => {
    setFilters({})
    handleClose()
  }, [setFilters, handleClose])

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Filter by:</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          These filters will be persisted in the browser. If you want a non-persistent filter try the{' '}
          <TooltipImpl title={<PowerSearchHint />}>
            <Typography sx={{textDecoration: 'underline', cursor: 'pointer'}} component="span">
              power search
            </Typography>
          </TooltipImpl>
          .
        </DialogContentText>
        <ProjectsFilter />
        <AssigneesFilter />
        <StatusesFilter />
        <DoneTicketsCheckbox />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleApply} variant="contained" color="primary">
          Apply
        </Button>
        <Button onClick={handleClear} variant="outlined" color="secondary">
          Clear All
        </Button>
        <Button onClick={handleAbort} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Filters() {
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()
  const filters = useFilters()
  const setTemporaryFilters = useTemporaryFiltersDispatch()

  const filtersCount = useMemo(() => {
    let count = 0
    Object.keys(filters).forEach(key => {
      if (filters[key] && (filters[key] === true || filters[key].length > 0)) {
        count += 1
      }
    })
    return count
  }, [filters])

  return (
    <>
      <FilterDialog isOpen={isOpen} setOpen={setIsOpen} />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<FilterList />}
        endIcon={
          filtersCount !== 0 ? (
            <Avatar sx={{bgcolor: theme.palette.warning.main, width: 24, height: 24}}>{filtersCount}</Avatar>
          ) : null
        }
        onClick={() => {
          setTemporaryFilters(filters)
          setIsOpen(true)
        }}
      >
        Filter
      </Button>
    </>
  )
}

export default Filters
