import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../../api'
import {UserLoginBody, UserRegistrationBody} from '../../schemas/users'

type UserState = {
  user: UserRegistrationBody
  token: string
  hours: Record<string, number>
  loading: boolean
  error: string
}

const INIT_USER_STATE: UserState = {
  user: null,
  token: '',
  loading: false,
  hours: {},
  error: '',
}

export const onLoginUser = createAsyncThunk(
  'users/login',
  async (loginBody: UserLoginBody, {rejectWithValue}) => {
    try {
      const response = await api.post<{token: string; user: UserRegistrationBody}>(
        '/users/login',
        loginBody
      )
      api.setToken(response.data.token) // Save token for future requests
      return response.data
    } catch (error: {response: {data: {message: string}}}) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const onLogout = createAsyncThunk('users/logout', async ({rejectWithValue}) => {
  try {
    const response = await api.post<{token: string; user: UserRegistrationBody}>('/users/logout')
    api.setToken(response.data.token) // Save token for future requests
    return response.data
  } catch (error: {response: {data: {message: string}}}) {
    return rejectWithValue(error.response.data.message)
  }
})

export const onRegisterUser = createAsyncThunk(
  'users/register',
  async (register: UserRegistrationBody, {rejectWithValue}) => {
    try {
      const response = await api.post<UserRegistrationBody>('/users/register', register)
      return response.data
    } catch (error: {response: {data: {message: string}}}) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const onModifyUser = createAsyncThunk(
  'users/modify',
  async (register: UserRegistrationBody, {rejectWithValue}) => {
    try {
      const response = await api.post<UserRegistrationBody>('/users/modify/user', register)
      return response.data
    } catch (error: {response: {data: {message: string}}}) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const onGetProfile = createAsyncThunk('users/profile', async ({rejectWithValue}) => {
  try {
    const response = await api.get<{user: UserRegistrationBody}>('/users/profile', register)
    return response.data
  } catch (error: {response: {data: {message: string}}}) {
    return rejectWithValue(error.response.data.message)
  }
})

export const onGetHours = createAsyncThunk('users/hours', async ({rejectWithValue}) => {
  try {
    const response = await api.get<Record<string, number>>('/users/hours')
    return response.data
  } catch (error: {response: {data: {message: string}}}) {
    return rejectWithValue(error.response.data.message)
  }
})

const userSlice = createSlice({
  name: 'users',
  initialState: INIT_USER_STATE,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = ''
      state.loading = false
      state.error = null
    },
  },
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
      .addCase(onRegisterUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(onLogout.fulfilled, (state) => {
        state.user = null
        state.token = ''
        state.loading = false
        state.error = null
      })
      .addCase(onGetProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(onGetProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(onGetProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(onGetHours.pending, (state) => {
        state.loading = true
      })
      .addCase(onGetHours.fulfilled, (state, action) => {
        state.loading = false
        state.hours = action.payload
      })
      .addCase(onGetHours.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(onModifyUser.pending, (state) => {
        state.loading = true
      })
      .addCase(onModifyUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(onModifyUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default userSlice.reducer
