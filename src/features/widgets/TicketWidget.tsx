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
    <Card>
      {title && <CardHeader title={title} />}
      <CardContent
        sx={{
          overflow: 'auto',
          ...style,
        }}
      >
        <TicketList tickets={tickets} showDueDate={showDueDate} />
      </CardContent>
    </Card>
  )
}

export default TicketWidget
