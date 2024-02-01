import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {Issue, Task, UserStory} from '../../types/taiga.ts'

function TicketList({tickets, showDueDate = false}: {tickets: (UserStory | Issue | Task)[]; showDueDate?: boolean}) {
  const theme = useTheme()
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
                    src={ticket.project_extra_info.logo_small_url}
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
                    color: theme.palette.getContrastText(ticket.status_extra_info.color),
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
}

export default TicketList
