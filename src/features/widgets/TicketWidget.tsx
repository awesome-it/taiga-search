import {Card, CardContent, CardHeader} from '@mui/material'
import {Issue, Task, UserStory} from '../../types/taiga.ts'
import TicketList from './TicketList.tsx'

function TicketWidget({
  tickets,
  title,
  showDueDate = false,
  style,
}: {
  tickets: (UserStory | Issue | Task)[]
  title?: string
  showDueDate?: boolean
  style?: object
}) {
  return (
    <Card variant="outlined">
      {title && (
        <CardHeader
          title={title}
          titleTypographyProps={{fontSize: '1rem', color: 'text.secondary'}}
          sx={{
            py: 0,
            px: 1,
            position: 'absolute',
            top: 0,
            left: '1rem',
            backgroundColor: 'white',
            transform: 'scale(0.75)',
          }}
        />
      )}
      <CardContent
        sx={{
          overflow: 'auto',
          px: 0,
          ...style,
        }}
      >
        <TicketList tickets={tickets} showDueDate={showDueDate} />
      </CardContent>
    </Card>
  )
}

export default TicketWidget
