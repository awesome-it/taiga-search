import {FormEventHandler, useState} from 'react'
import Alert from '@mui/material/Alert'
import {Box, Dialog, DialogContent, TextField, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {User} from '../../types/taiga.ts'
import useAuth from '../auth/authWrapper.ts'
import App from '../../App.tsx'

export function ApiSignIn() {
  const {token} = useAuth()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const login = async (username: string, pass: string): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_TAIGA_BASE_URL}/auth`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        username,
        password: pass,
        type: 'normal',
      }),
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.detail)
    }
    return response.json()
  }

  const submitHandler: FormEventHandler<HTMLFormElement> = form => {
    form.preventDefault()
    const formData = new FormData(form.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    setLoading(true)
    login(username, password)
      .then(user => {
        window.localStorage.setItem('token', JSON.stringify(user.auth_token))
        window.localStorage.setItem('refresh', JSON.stringify(user.refresh))
        window.location.reload()
      })
      .catch(e => {
        setLoginError(e.message)
        setLoading(false)
      })
  }

  return token ? (
    <App />
  ) : (
    <Dialog open={!token} fullWidth maxWidth="sm">
      <DialogContent>
        <Box
          component="form"
          onSubmit={submitHandler}
          display="flex"
          flexDirection="column"
          flexGrow={1}
          gap={2}
          p={5}
          sx={{minHeight: '0px'}}
          alignItems="stretch"
          justifyContent="center"
        >
          <Typography align="center" variant="h4" component="h1">
            Login to Taiga
          </Typography>
          {loginError && <Alert color="error">{loginError}</Alert>}
          <TextField name="username" label="Username" />
          <TextField name="password" label="Password" type="password" />
          <LoadingButton type="submit" fullWidth loading={isLoading} variant="contained">
            Sign In
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
