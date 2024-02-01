import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  // List,
  // ListItem,
  // ListItemAvatar,
  // ListItemButton,
  // ListItemText,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
// import {Fragment} from 'react'
import {Issue, Task, UserStory} from '../../types/taiga.ts'

function TicketList({tickets, showDueDate = false}: {tickets: (UserStory | Issue | Task)[]; showDueDate?: boolean}) {
  if (tickets.length === 0) {
    return <Typography>Currently no tickets</Typography>
  }

  return (
    <Grid container flexDirection="column">
      {tickets.map(ticket => (
        <Grid xs={12} key={ticket.path}>
          <Card variant="outlined">
            <CardActionArea component="a" href={ticket.path}>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: ticket.status_extra_info.color,
                    }}
                  >
                    {ticket.status_extra_info.name[0]}
                  </Avatar>
                }
                title={
                  <>
                    {ticket.project_extra_info.name} / {ticket.ticketType} / {ticket.ref}
                  </>
                }
                titleTypographyProps={{
                  color: 'text.secondary',
                  variant: 'caption',
                }}
                subheader={ticket.subject}
                subheaderTypographyProps={{
                  color: 'text.primary',
                  variant: 'body1',
                }}
              />
              {showDueDate && <CardContent>Due: {ticket.due_date}</CardContent>}
              <CardActions disableSpacing>
                <Chip
                  label={`${ticket.status_extra_info.name}`}
                  sx={{
                    bgcolor: ticket.status_extra_info.color,
                  }}
                />
                {ticket.assigned_to_extra_info?.full_name_display && (
                  <Chip
                    label={`Assigned to: ${ticket.assigned_to_extra_info?.full_name_display}`}
                    sx={{
                      marginLeft: 'auto',
                    }}
                  />
                )}
              </CardActions>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  // return (
  //   <List
  //     disablePadding
  //     sx={{
  //       maxHeight: '90%',
  //     }}
  //   >
  //     {tickets.map((ticket, index) => (
  //       <Fragment key={ticket.path}>
  //         <ListItem disablePadding alignItems="flex-start">
  //           <ListItemButton component="a" href={ticket.path} alignItems="flex-start">
  //             <ListItemAvatar>
  //               <Avatar sx={{bgcolor: ticket.status_extra_info.color}} src={ticket.assigned_to_extra_info?.photo}>
  //                 {ticket.status_extra_info.name[0]}
  //               </Avatar>
  //             </ListItemAvatar>
  //             <ListItemText
  //               primary={
  //                 <>
  //                   <span>
  //                     {ticket.project_extra_info.name} / {ticket.ticketType} / {ticket.ref}
  //                   </span>
  //                   <br />
  //                   <span>{ticket.subject}</span>
  //                   {showDueDate && (
  //                     <>
  //                       <br />
  //                       <span>Due: {ticket.due_date}</span>
  //                     </>
  //                   )}
  //                 </>
  //               }
  //               secondary={
  //                 <>
  //                   <span>{ticket.status_extra_info.name}</span>
  //                   <br />
  //                   <span>
  //                     {ticket.assigned_to_extra_info?.full_name_display &&
  //                       `Assigned to: ${ticket.assigned_to_extra_info?.full_name_display}`}
  //                   </span>
  //                 </>
  //               }
  //             />
  //           </ListItemButton>
  //         </ListItem>
  //         {index + 1 < tickets.length && <Divider />}
  //       </Fragment>
  //     ))}
  //   </List>
  // )
}

export default TicketList
