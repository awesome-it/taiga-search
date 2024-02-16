import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {useMemo} from 'react'
import {Issue, Project, Task, UserStory} from '../../types/taiga.ts'

const ticketColors = {
  issue: '#DC143C',
  project: '#191970',
  task: '#228B22',
  us: '#DAA520',
} as {[key: string]: string}

const isProject = (element: UserStory | Issue | Task | Project): element is Project => {
  return (element as Project).isProject
}

function TicketList({tickets: givenTickets}: {tickets: (UserStory | Issue | Task | Project)[]}) {
  const theme = useTheme()

  const [tickets, projects] = useMemo(() => {
    const curTickets = [] as (UserStory | Issue | Task)[]
    const curProjects = [] as Project[]
    givenTickets.forEach(ticket => {
      if (isProject(ticket)) {
        curProjects.push(ticket)
      } else {
        curTickets.push(ticket)
      }
    })
    return [curTickets, curProjects]
  }, [givenTickets])

  return projects.length < 1 && tickets.length < 1 ? (
    <Stack flexGrow={1} justifyContent="center" alignItems="center" sx={{height: '100%'}}>
      <Typography variant="body2" color="text.secondary">
        No Tickets
      </Typography>
    </Stack>
  ) : (
    <Grid container flexDirection="column">
      {projects.map(project => (
        <Grid xs={12} key={project.path}>
          <Card elevation={0} square sx={{borderLeft: `5px solid ${ticketColors[project.ticketType]}`}}>
            <CardActionArea
              component="a"
              sx={{[theme.breakpoints.up('sm')]: {justifyContent: 'space-between', display: 'flex'}}}
              href={project.path}
            >
              <CardHeader
                avatar={<Avatar src={project.logo_small_url}>{project.name[0]}</Avatar>}
                title="Project"
                titleTypographyProps={{
                  color: 'text.secondary',
                  variant: 'caption',
                }}
                subheader={project.name}
                subheaderTypographyProps={{
                  color: 'text.primary',
                  variant: 'body1',
                }}
              />
            </CardActionArea>
          </Card>
          <Divider />
        </Grid>
      ))}
      {tickets.map(ticket => (
        <Grid xs={12} key={ticket.path}>
          <Card elevation={0} square sx={{borderLeft: `5px solid ${ticketColors[ticket.ticketType]}`}}>
            <CardActionArea
              component="a"
              sx={{
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
      ))}
    </Grid>
  )
}

export default TicketList
