import {Divider, List, ListItem, ListItemButton, ListItemText} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {SearchResult, SearchResultMap} from '../../types/search.ts'
import {Project} from '../../types/taiga.ts'

function SearchResults({results}: {results: SearchResult}) {
  const queryClient = useQueryClient()
  const projects: Project[] | undefined = queryClient.getQueryData(['projects'])
  return (
    <List>
      {(Object.keys(results) as Array<keyof SearchResult>).map(key =>
        results[key].map(
          item =>
            projects &&
            projects.find(project => project.id === item.projectId) && (
              <>
                <ListItem disablePadding key={item.path}>
                  <ListItemButton component="a" href={item.path}>
                    {/* <ListItemAvatar>{item.status}</ListItemAvatar> */}
                    <ListItemText
                      primary={`${projects.find(project => project.id === item.projectId)!.name} / ${SearchResultMap.get(key)} / ${item.id}`}
                      secondary={item.subject}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            ),
        ),
      )}
    </List>
  )
}

export default SearchResults
