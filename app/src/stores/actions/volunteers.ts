import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../api'
import {UserRegistrationBody} from '../../schemas/users'
import {handleAPIError} from './utils'

type VolunteersState = {
  volunteers: UserRegistrationBody[]
  loading: boolean
  loaded: boolean
  error: string
}

const INIT_VOLUNTEER_STATE: VolunteersState = {
  volunteers: [],
  loading: false,
  loaded: false,
  error: '',
}

export const onGetVolunteers = createAsyncThunk('users/all', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get<{users: UserRegistrationBody[]}>('/users/all')
    return {volunteers: response.data.users}
  } catch (error) {
    return handleAPIError(error, rejectWithValue)
  }
})

export const onDeleteVolunteer = createAsyncThunk(
  'volunteer/delete',
  async ({id}: {id: string}, {rejectWithValue}) => {
    try {
      await api.delete<object>(`/users/delete/${id}`)

      return {id}
    } catch (error) {
      return handleAPIError(error, rejectWithValue)
    }
  }
)

const volunteerSlice = createSlice({
  name: 'volunteers',
  initialState: INIT_VOLUNTEER_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(onGetVolunteers.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true

        if (!action.payload) return

        state.volunteers = action.payload.volunteers
      })

      .addCase(onDeleteVolunteer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(onDeleteVolunteer.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true

        state.volunteers = state.volunteers.filter(({id}) => id != (action.payload as any)?.id)
      })
      .addCase(onDeleteVolunteer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default volunteerSlice.reducer
