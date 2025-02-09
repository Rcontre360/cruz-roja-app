import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import ApiClient from '../../api'
import {UserLoginBody, UserRegistrationBody} from '../../schemas/users'

type UserState = {
  user: UserRegistrationBody
  token: string
  loading: boolean
  error: string
}

const INIT_USER_STATE: UserState = {
  user: null,
  token: '',
  loading: false,
  error: '',
}

// Initialize API Client
const api = new ApiClient()

// Async Thunk for Login
export const onLoginUser = createAsyncThunk(
  'users/login',
  async (loginBody: UserLoginBody, {rejectWithValue}) => {
    try {
      const response = await api.post<{token: string; user: UserRegistrationBody}>(
        '/auth/login',
        loginBody
      )
      api.setToken(response.data.token) // Save token for future requests
      return response.data
    } catch (error: {message: string}) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

// Async Thunk for Registration
export const onRegisterUser = createAsyncThunk(
  'users/register',
  async (register: UserRegistrationBody, {rejectWithValue}) => {
    try {
      const response = await api.post<UserRegistrationBody>('/users/register', register)
      console.log('RESPONSE', response)
      return response.data
    } catch (error: {message: string}) {
      console.log('ERRRPR', error)
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState: INIT_USER_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(onLoginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(onLoginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(onLoginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(onRegisterUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(onRegisterUser.fulfilled, (state) => {
        state.loading = false
      })
  },
})

export const {logout} = userSlice.actions
export default userSlice.reducer
