import {EpicSearchResult, IssueSearchResult, TaskSearchResult, UserStorySearchResult} from './taiga.ts'

export type SearchResult = {
  epics: EpicSearchResult[]
  userstories: UserStorySearchResult[]
  issues: IssueSearchResult[]
  tasks: TaskSearchResult[]
}

export const SearchResultMap = new Map<string, string>([
  ['userstories', 'UserStory'],
  ['epics', 'Epic'],
  ['issues', 'Issue'],
  ['tasks', 'Task'],
])
