import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {useCallback, useState} from 'react'
import useTaigaQueries, {QuickLink} from '../queries/queries.ts'

type DraftLink = QuickLink & {id: number}

let draftIdCounter = 0
const takeDraftId = () => {
  draftIdCounter += 1
  return draftIdCounter
}

const isQuickLinkValid = (link: QuickLink) => {
  try {
    const parsedUrl = new URL(link.url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

const isDraftPartiallyFilled = (link: QuickLink) => !!link.text.trim() || !!link.url.trim()

const isDraftInvalid = (link: QuickLink) =>
  isDraftPartiallyFilled(link) && (!link.text.trim() || !isQuickLinkValid(link))

// The helper space is always reserved (nbsp) so that a shown error message never changes the row height or alignment
const EMPTY_HELPER = '\u00A0'

function QuickLinks() {
  const taigaQueries = useTaigaQueries()
  const {quickLinks, isLoading} = taigaQueries.useQuickLinks()

  if (isLoading || quickLinks.length === 0) {
    return null
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
      {quickLinks.map(link => (
        <Button
          key={`${link.text}::${link.url}`}
          size="small"
          variant="outlined"
          onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
        >
          {link.text}
        </Button>
      ))}
    </Stack>
  )
}

export function QuickLinksToggle() {
  const taigaQueries = useTaigaQueries()
  const {quickLinks, saveQuickLinks} = taigaQueries.useQuickLinks()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<DraftLink[]>([])
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  const openEditor = useCallback(() => {
    const rows = quickLinks.map(link => ({...link, id: takeDraftId()}))
    setDraft(rows)
    setShowValidationErrors(false)
    setIsEditing(true)
  }, [quickLinks])

  const closeEditor = useCallback(() => setIsEditing(false), [])

  const handleAddLink = useCallback(() => {
    const id = takeDraftId()
    setDraft(current => [...current, {id, text: '', url: ''}])
  }, [])

  const handleChangeLink = useCallback((id: number, field: keyof QuickLink, value: string) => {
    setDraft(current => current.map(link => (link.id === id ? {...link, [field]: value} : link)))
  }, [])

  const handleRemoveLink = useCallback((id: number) => {
    setDraft(current => current.filter(link => link.id !== id))
  }, [])

  const hasInvalidDraft = draft.some(isDraftInvalid)

  const handleSave = useCallback(() => {
    if (hasInvalidDraft) {
      setShowValidationErrors(true)
      return
    }
    const seen = new Set<string>()
    const links = draft
      .filter(link => isDraftPartiallyFilled(link))
      .map(link => ({text: link.text.trim(), url: link.url.trim()}))
      .filter(link => {
        const key = `${link.text}::${link.url}`
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })
    saveQuickLinks.mutate(links, {onSuccess: closeEditor})
  }, [closeEditor, draft, hasInvalidDraft, saveQuickLinks])

  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Tooltip title="Manage quick links">
        <IconButton aria-label="Manage quick links" onClick={openEditor}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={isEditing} onClose={closeEditor} fullWidth maxWidth="sm">
        <DialogTitle>Quick links</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5}>
            {draft.map((link, index) => {
              const partiallyFilled = isDraftPartiallyFilled(link)
              // An empty URL is only an error after a save attempt; a filled but invalid URL is an error as soon as it is typed
              const textInvalid = showValidationErrors && partiallyFilled && !link.text.trim()
              const urlInvalid =
                (!!link.url.trim() && !isQuickLinkValid(link)) ||
                (showValidationErrors && partiallyFilled && !isQuickLinkValid(link))
              // flex-start on sm+ so the delete icon aligns with the inputs, not the reserved helper space
              return (
                <Stack
                  key={link.id}
                  direction={{xs: 'column', sm: 'row'}}
                  spacing={1}
                  alignItems={{xs: 'center', sm: 'flex-start'}}
                  sx={{pt: 1}}
                >
                  <TextField
                    label="Text"
                    size="small"
                    value={link.text}
                    onChange={e => handleChangeLink(link.id, 'text', e.target.value)}
                    error={textInvalid}
                    helperText={textInvalid ? 'Text is required' : EMPTY_HELPER}
                  />
                  <TextField
                    label="URL"
                    size="small"
                    value={link.url}
                    onChange={e => handleChangeLink(link.id, 'url', e.target.value)}
                    error={urlInvalid}
                    helperText={urlInvalid ? 'A valid http(s) URL is required' : EMPTY_HELPER}
                    sx={{flexGrow: 1}}
                  />
                  <IconButton aria-label={`Remove quick link ${index + 1}`} onClick={() => handleRemoveLink(link.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )
            })}
            <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAddLink}>
              Add link
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          {saveQuickLinks.isError && (
            <Typography color="error" sx={{mr: 'auto'}}>
              {saveQuickLinks.error instanceof Error ? saveQuickLinks.error.message : 'Failed to save quick links'}
            </Typography>
          )}
          <Button onClick={closeEditor}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saveQuickLinks.isPending}>
            {saveQuickLinks.isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default QuickLinks
