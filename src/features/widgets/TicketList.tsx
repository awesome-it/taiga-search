import {Avatar, Card, CardActionArea, CardActions, CardHeader, Chip, Divider, Typography, useTheme} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {green, lime, orange, teal} from '@mui/material/colors'
import {Issue, Project, Task, UserStory} from '../../types/taiga.ts'

function TicketList({tickets}: {tickets: (UserStory | Issue | Task | Project)[]}) {
  const theme = useTheme()
  if (tickets.length === 0) {
    return <Typography sx={{p: 2}}>Currently no tickets</Typography>
  }

  const isProject = (element: UserStory | Issue | Task | Project): element is Project => {
    return (element as Project).isProject
  }

  const ticketColors = {
    issue: lime[50],
    project: teal[50],
    task: green[50],
    us: orange[50],
  } as {[key: string]: string}

  return (
    <Grid container flexDirection="column">
      {tickets.map(ticket => {
        if (isProject(ticket)) {
          return (
            <Grid xs={12} key={ticket.path}>
              <Card elevation={0} sx={{backgroundColor: ticketColors.project}}>
                <CardActionArea
                  component="a"
                  sx={{[theme.breakpoints.up('sm')]: {justifyContent: 'space-between', display: 'flex'}}}
                  href={ticket.path}
                >
                  <CardHeader
                    avatar={<Avatar src={ticket.logo_small_url}>{ticket.name[0]}</Avatar>}
                    title="Project"
                    titleTypographyProps={{
                      color: 'text.secondary',
                      variant: 'caption',
                    }}
                    subheader={ticket.name}
                    subheaderTypographyProps={{
                      color: 'text.primary',
                      variant: 'body1',
                    }}
                  />
                </CardActionArea>
              </Card>
              <Divider />
            </Grid>
          )
        }
        return (
          <Grid xs={12} key={ticket.path}>
            <Card elevation={0}>
              <CardActionArea
                component="a"
                sx={{
                  backgroundColor: ticketColors[ticket.ticketType],
                  [theme.breakpoints.up('sm')]: {justifyContent: 'space-between', display: 'flex'},
                }}
                href={ticket.path}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: ticket.status_extra_info.color,
                        color: theme.palette.getContrastText(ticket.status_extra_info.color),
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
                    variant: 'overline',
                  }}
                  subheader={ticket.subject}
                  subheaderTypographyProps={{
                    color: 'text.primary',
                    variant: 'body1',
                  }}
                />
                <CardActions disableSpacing sx={{justifyContent: 'end', flexWrap: 'wrap'}}>
                  {ticket.due_date && (
                    <Chip
                      label={`Due: ${ticket.due_date}`}
                      color={new Date(ticket.due_date) < new Date() ? 'error' : 'default'}
                      sx={{
                        mb: 1,
                      }}
                    />
                  )}
                  {ticket.assigned_to_extra_info?.full_name_display && (
                    <Chip
                      label={`Assigned to: ${ticket.assigned_to_extra_info?.full_name_display}`}
                      sx={{
                        mb: 1,
                        ml: 2,
                      }}
                    />
                  )}
                  <Chip
                    label={`${ticket.status_extra_info.name}`}
                    sx={{
                      ml: 2,
                      mb: 1,
                      bgcolor: ticket.status_extra_info.color,
                      color: theme.palette.getContrastText(ticket.status_extra_info.color),
                    }}
                  />
                </CardActions>
              </CardActionArea>
            </Card>
            <Divider />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default TicketList
