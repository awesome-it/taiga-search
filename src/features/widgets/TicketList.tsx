import {Avatar, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from '@mui/material'
import {Fragment} from 'react'
import {Issue, Task, UserStory} from '../../types/taiga.ts'

function TicketList({tickets, showDueDate = false}: {tickets: (UserStory | Issue | Task)[]; showDueDate?: boolean}) {
  return (
    <List
      disablePadding
      sx={{
        maxHeight: '90%',
      }}
    >
      {tickets.map(ticket => (
        <Fragment key={ticket.path}>
          <ListItem disablePadding alignItems="flex-start">
            <ListItemButton component="a" href={ticket.path} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{bgcolor: ticket.status_extra_info.color}} src={ticket.assigned_to_extra_info?.photo}>
                  {ticket.status_extra_info.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <span>
                      {ticket.project_extra_info.name} / {ticket.ticketType} / {ticket.subject}
                    </span>
                    {showDueDate && (
                      <>
                        <br />
                        <span>Due: {ticket.due_date}</span>
                      </>
                    )}
                  </>
                }
                secondary={
                  <>
                    <span>{ticket.status_extra_info.name}</span>
                    <br />
                    <span>
                      {ticket.assigned_to_extra_info?.full_name_display
                        ? `Assigned to: ${ticket.assigned_to_extra_info?.full_name_display}`
                        : 'Unassigned'}
                    </span>
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  )
}

export default TicketList
