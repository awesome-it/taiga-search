import {Divider, Link, List, ListItem, ListItemButton, ListItemText, Typography} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {Link as RouterLink, useParams} from 'react-router-dom'
import {Fragment} from 'react'
import {SearchResult, SearchResultMap} from '../../types/search.ts'
import {Project} from '../../types/taiga.ts'

function SearchResults({results}: {results: SearchResult}) {
  const {searchTerm} = useParams()
  const queryClient = useQueryClient()
  const projects: Project[] | undefined = queryClient.getQueryData(['projects'])

  if ((Object.keys(results) as Array<keyof SearchResult>).every(key => results[key].length === 0)) {
    return (
      <Typography>
        Sorry! There are no results for &quot;{searchTerm}&quot; <br />
        <Link component={RouterLink} to="/" reloadDocument>
          Return to dashboard
        </Link>
      </Typography>
    )
  }
  return (
    <List>
      {(Object.keys(results) as Array<keyof SearchResult>).map(key =>
        results[key].map(
          item =>
            projects &&
            projects.find(project => project.id === item.projectId) && (
              <Fragment key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton component="a" href={item.path}>
                    {/* <ListItemAvatar>{item.status}</ListItemAvatar> */}
                    <ListItemText
                      primary={`${projects.find(project => project.id === item.projectId)!.name} / ${SearchResultMap.get(key)} / ${item.ref}`}
                      secondary={item.subject}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </Fragment>
            ),
        ),
      )}
      <ListItem key="dashboardBacklink" disablePadding>
        <ListItemButton component={RouterLink} to="/" reloadDocument>
          <ListItemText primary="Return to dashboard" />
        </ListItemButton>
      </ListItem>
    </List>
  )
}

export default SearchResults
