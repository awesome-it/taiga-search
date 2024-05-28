import {Stack, Tab, useMediaQuery, useTheme} from '@mui/material'
import {TabContext, TabList, TabPanel, TabPanelProps} from '@mui/lab'
import {SyntheticEvent, useCallback, useMemo, useState} from 'react'
import {useParams} from 'react-router-dom'
import TicketWidget from './TicketWidget.tsx'
import useTaigaQueries from '../queries/queries.ts'
import {useFilters} from '../filter/FilterProvider.tsx'

const CustomTabPanel = ({children, value, currentValue, ...props}: {currentValue?: string} & TabPanelProps) => (
  <TabPanel
    value={value}
    {...props}
    sx={
      value === currentValue
        ? {flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '0px', p: 0}
        : undefined
    }
  >
    {children}
  </TabPanel>
)

export default function DashboardView() {
  const taigaQueries = useTaigaQueries()
  const theme = useTheme()
  const smallView = useMediaQuery(theme.breakpoints.down('md'))
  const {searchTerm} = useParams()
  const filters = useFilters()
  let search = searchTerm ?? ''

  if (filters.doneTickets) {
    search = `${search}&status__is_closed=false`
  }

  const {data: user} = taigaQueries.useUserQuery()
  const {data: allTickets, isLoading} = taigaQueries.useSearchAllTicketsQueries({searchTerm: search})

  const widgets = useMemo(
    () => ({
      assignedTo: {
        label: 'My Tickets',
        tickets: allTickets.filter(ticket => !!user && !ticket.isProject && ticket.assigned_to === user.id),
      },
      watched: {
        label: 'Watched Tickets',
        tickets: allTickets.filter(ticket => !ticket.isProject && ticket.is_watcher),
      },
      unassigned: {
        label: 'Unassigned Tickets',
        tickets: allTickets.filter(ticket => !ticket.isProject && !ticket.assigned_to),
      },
      withDeadline: {
        label: 'Tickets with Deadline',
        tickets: allTickets
          .filter(ticket => !ticket.isProject && ticket.due_date)
          .sort((a, b) =>
            !a.isProject && !b.isProject ? (a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) : 0,
          ),
      },
    }),
    [allTickets, user],
  )

  const [currentTab, setCurrentTab] = useState('assignedTo')
  const handleTabChange = useCallback((_event: SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }, [])

  return smallView ? (
    <Stack sx={{minHeight: 0, height: '100%'}}>
      <TabContext value={currentTab}>
        <TabList onChange={handleTabChange} variant="scrollable" allowScrollButtonsMobile>
          {Object.entries(widgets).map(([key, value]) => (
            <Tab key={key} label={value.label} value={key} />
          ))}
        </TabList>
        {Object.entries(widgets).map(([key, value]) => (
          <CustomTabPanel key={key} value={key} currentValue={currentTab}>
            <TicketWidget isLoading={isLoading} tickets={value.tickets} />
          </CustomTabPanel>
        ))}
      </TabContext>
    </Stack>
  ) : (
    <Stack sx={{minHeight: 0, height: '100%'}} gap={2}>
      <Stack direction="row" sx={{minHeight: 0, height: '50%'}} gap={2}>
        <TicketWidget
          isLoading={isLoading}
          tickets={widgets.assignedTo.tickets}
          title={widgets.assignedTo.label}
          sx={{width: '50%'}}
        />
        <TicketWidget
          isLoading={isLoading}
          tickets={widgets.watched.tickets}
          title={widgets.watched.label}
          sx={{width: '50%'}}
        />
      </Stack>
      <Stack direction="row" sx={{minHeight: 0, height: '50%'}} gap={2}>
        <TicketWidget
          isLoading={isLoading}
          tickets={widgets.unassigned.tickets}
          title={widgets.unassigned.label}
          sx={{width: '50%'}}
        />
        <TicketWidget
          isLoading={isLoading}
          tickets={widgets.withDeadline.tickets}
          title={widgets.withDeadline.label}
          sx={{width: '50%'}}
        />
      </Stack>
    </Stack>
  )
}
