export type Project = {
  anon_permissions: string[]
  blocked_code: null
  created_date: string
  creation_template: number
  default_epic_status: number
  default_issue_status: number
  default_issue_type: number
  default_points: number
  default_priority: number
  default_severity: number
  default_task_status: number
  default_us_status: number
  description: string
  i_am_admin: boolean
  i_am_member: boolean
  i_am_owner: boolean
  id: number
  is_backlog_activated: boolean
  is_contact_activated: boolean
  is_epics_activated: boolean
  is_fan: boolean
  is_featured: boolean
  is_issues_activated: boolean
  is_kanban_activated: boolean
  is_looking_for_people: boolean
  is_private: boolean
  is_watcher: boolean
  is_wiki_activated: boolean
  logo_big_url: string | null
  logo_small_url: string | null
  looking_for_people_note: string
  members: number[]
  modified_date: string
  my_homepage: boolean
  my_permissions: string[]
  name: string
  notify_level: number
  owner: {
    big_photo: string | null
    full_name_display: string
    gravatar_id: string
    id: number
    is_active: boolean
    photo: string | null
    username: string
  }
  public_permissions: string[]
  slug: string
  tags: []
  tags_colors: object
  total_activity: number
  total_activity_last_month: number
  total_activity_last_week: number
  total_activity_last_year: number
  total_closed_milestones: number
  total_fans: number
  total_fans_last_month: number
  total_fans_last_week: number
  total_fans_last_year: number
  total_milestones: number | null
  total_story_points: number | null
  total_watchers: number
  totals_updated_datetime: string
  videoconferences: null
  videoconferences_extra_data: null
}

type BaseSearchResult = {
  id: number
  projectId: number
  path: string
  ref: number
  status: number
  subject: string
}

export type IssueSearchResult = BaseSearchResult & {
  assigned_to: number
}

export type TaskSearchResult = BaseSearchResult & {
  assigned_to: number
}

export type UserStorySearchResult = BaseSearchResult & {
  milestone_name: string | null
  milestone_slug: string | null
  total_points: number
}

export type EpicSearchResult = BaseSearchResult & {
  assigned_to: number
}

type Ticket = {
  ticketType: string // Custom Property
  path: string // Custom Property
  assigned_to: number
  assigned_to_extra_info: {
    big_photo: string
    full_name_display: string
    gravatar_id: string
    id: number
    is_active: boolean
    photo: string
    username: string
  }
  attachments: []
  blocked_note: string
  created_date: string
  due_date: string
  due_date_reason: string
  due_date_status: string
  external_reference: null
  finished_date: string
  id: number
  is_blocked: boolean
  is_closed: boolean
  is_voter: boolean
  is_watcher: boolean
  milestone: number
  modified_date: string
  owner: number
  owner_extra_info: {
    big_photo: string
    full_name_display: string
    gravatar_id: string
    id: number
    is_active: boolean
    photo: string
    username: string
  }
  project: number
  project_extra_info: {
    id: number
    logo_small_url: string
    name: string
    slug: string
  }
  ref: number
  status: number
  status_extra_info: {
    color: string
    is_closed: boolean
    name: string
  }
  subject: string
  tags: []
  total_voters: number
  total_watchers: number
  version: number
  watchers: number[]
}

export type Issue = Ticket & {
  priority: number
  severity: number
  type: number
}

export type Task = Ticket & {
  is_iocaine: boolean
  milestone_slug: string
  taskboard_order: number
  total_comments: number
  us_order: number
  user_story: number
  user_story_extra_info: {
    epics: [
      {
        color: string
        id: number
        project: {
          id: number
          name: string
          slug: string
        }
        ref: number
        subject: string
      },
    ]
    id: number
    ref: number
    subject: string
  }
}

export type UserStory = Ticket & {
  projectId: number
  path: string
  assigned_users: []
  backlog_order: number
  client_requirement: boolean
  comment: string
  epic_order: null
  epics: null
  generated_from_issue: null
  generated_from_task: null
  kanban_order: number
  milestone_name: null
  milestone_slug: null
  origin_issue: null
  origin_task: null
  points: object
  sprint_order: number
  tasks: []
  team_requirement: boolean
  total_attachments: number
  total_comments: number
  total_points: number
  tribe_gig: null
}

export type WikiPage = {
  id: number
  projectId: number
  slug: string
}

export type SearchResults = {
  count: number
  projectId: number
  projectSlug: string
  epics: EpicSearchResult[]
  issues: IssueSearchResult[]
  tasks: TaskSearchResult[]
  userstories: UserStorySearchResult[]
  wikipages: WikiPage[]
}

export type User = {
  accepted_terms: boolean
  auth_token: string
  big_photo: null
  bio: string
  color: string
  date_joined: string
  email: string
  full_name: string
  full_name_display: string
  gravatar_id: string
  id: number
  is_active: boolean
  lang: string
  max_memberships_private_projects: null
  max_memberships_public_projects: null
  max_private_projects: null
  max_public_projects: null
  photo: null
  read_new_terms: boolean
  refresh: string
  roles: string[]
  theme: string
  timezone: string
  total_private_projects: number
  total_public_projects: number
  username: string
  uuid: string
}
