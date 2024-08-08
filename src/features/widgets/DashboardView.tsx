import {Stack, Tab, useMediaQuery, useTheme} from '@mui/material'
import {TabContext, TabList, TabPanel, TabPanelProps} from '@mui/lab'
import {SyntheticEvent, useCallback, useEffect, useMemo, useState} from 'react'
import {useParams} from 'react-router-dom'
import TicketWidget from './TicketWidget.tsx'
import useTaigaQueries from '../queries/queries.ts'

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

type TicketData = {
  previous?: {
    date: string
    assignedTo: number
    watched: number
    unassigned: number
    withDeadline: number
  }
  current?: {
    date: string
    assignedTo: number
    watched: number
    unassigned: number
    withDeadline: number
  }
}

export default function DashboardView() {
  const ticketData = JSON.parse(localStorage.getItem('ticketData') ?? '{}') as TicketData
  const taigaQueries = useTaigaQueries()
  const theme = useTheme()
  const smallView = useMediaQuery(theme.breakpoints.down('md'))
  const {searchTerm} = useParams()
  const search = searchTerm ?? ''

  const {data: user} = taigaQueries.useUserQuery()
  const {data: allTickets, isLoading} = taigaQueries.useSearchAllTicketsQueries({searchTerm: search})

  useEffect(() => {
    if (!isLoading && allTickets && user && ticketData.current?.date !== new Date().toDateString()) {
      localStorage.setItem(
        'ticketData',
        JSON.stringify({
          previous: ticketData.current,
          current: {
            date: new Date().toDateString(),
            assignedTo: allTickets.filter(ticket => !!user && !ticket.isProject && ticket.assigned_to === user.id)
              .length,
            watched: allTickets.filter(ticket => !ticket.isProject && ticket.is_watcher).length,
            unassigned: allTickets.filter(ticket => !ticket.isProject && !ticket.assigned_to).length,
            withDeadline: allTickets.filter(ticket => !ticket.isProject && ticket.due_date).length,
          },
        }),
      )
    }
  }, [allTickets, isLoading, ticketData, user])

  const widgets = useMemo(
    () => ({
      assignedTo: {
        label: 'My Tickets',
        tickets: allTickets.filter(ticket => !!user && !ticket.isProject && ticket.assigned_to === user.id),
        previousCount: ticketData.previous?.date !== new Date().toDateString() ? ticketData.previous?.assignedTo : 0,
      },
      watched: {
        label: 'Watched Tickets',
        tickets: allTickets.filter(ticket => !ticket.isProject && ticket.is_watcher),
        previousCount: ticketData.previous?.date !== new Date().toDateString() ? ticketData.previous?.watched : 0,
      },
      unassigned: {
        label: 'Unassigned Tickets',
        tickets: allTickets.filter(ticket => !ticket.isProject && !ticket.assigned_to),
        previousCount: ticketData.previous?.date !== new Date().toDateString() ? ticketData.previous?.unassigned : 0,
      },
      withDeadline: {
        label: 'Tickets with Deadline',
        tickets: allTickets
          .filter(ticket => !ticket.isProject && ticket.due_date)
          .sort((a, b) =>
            !a.isProject && !b.isProject ? (a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) : 0,
          ),
        previousCount: ticketData.previous?.date !== new Date().toDateString() ? ticketData.previous?.withDeadline : 0,
      },
    }),
    [allTickets, ticketData, user],
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
          givenTicketCount={widgets.assignedTo.tickets.length}
          previousTicketCount={widgets.assignedTo.previousCount}
        />
        <TicketWidget
          isLoading={isLoading}
          tickets={widgets.watched.tickets}
          title={widgets.watched.label}
          sx={{width: '50%'}}
          givenTicketCount={widgets.watched.tickets.length}
          previousTicketCount={widgets.watched.previousCount}
        />
      </Stack>
      <Stack direction="row" sx={{minHeight: 0, height: '50%'}} gap={2}>
        <TicketWidget
          isLoading={isLoading}
          tickets={widgets.unassigned.tickets}
          title={widgets.unassigned.label}
          sx={{width: '50%'}}
          givenTicketCount={widgets.unassigned.tickets.length}
          previousTicketCount={widgets.unassigned.previousCount}
        />
        <TicketWidget
          isLoading={isLoading}
          tickets={widgets.withDeadline.tickets}
          title={widgets.withDeadline.label}
          sx={{width: '50%'}}
          givenTicketCount={widgets.withDeadline.tickets.length}
          previousTicketCount={widgets.withDeadline.previousCount}
        />
      </Stack>
    </Stack>
  )
}
