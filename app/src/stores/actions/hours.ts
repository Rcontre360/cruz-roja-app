import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'
import { Hour } from '../../schemas/hours'
import { handleAPIError } from './utils'

type HourState = {
  hours: Hour[]
  loading: boolean
  loaded: boolean
  error: string
}

const INIT_STATE: HourState = {
  hours: [],
  loading: false,
  loaded: false,
  error: '',
}

export const onGetHours = createAsyncThunk('hours/all', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<{ hours: Hour[] }>('/hours/all')
    return res.data.hours
  } catch (err) {
    return handleAPIError(err, rejectWithValue)
  }
})

export const onDeleteHour = createAsyncThunk(
  'hours/delete',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await api.delete(`/hours/remove/${id}`)
      return { id }
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)

export const onCreateHour = createAsyncThunk(
  'hours/create',
  async (
    data: {
      activityId: string
      startDate: number
      endDate: number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/hours/create', data)
      return res.data
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)

export const onUpdateHour = createAsyncThunk(
  'hours/update',
  async (
    data: {
      id: string
      activityId: string
      description: string
      startDate: number
      endDate: number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/hours/update/${data.id}`, data)
      return res.data
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)

export const hoursSlice = createSlice({
  name: 'hours',
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onGetHours.pending, (state) => {
        state.loading = true
      })
      .addCase(onGetHours.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.hours = (action.payload ?? []).map(hour => {
          const diffMs = new Date(hour.endDate).getTime() - new Date(hour.startDate).getTime()
          const hours = diffMs / (1000 * 60 * 60)
          return { ...hour, hours }
        })
      })
      .addCase(onGetHours.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(onDeleteHour.fulfilled, (state, action) => {
        const id = (action.payload as { id: string }).id
        state.hours = state.hours.filter((h) => h.id !== id)
      })
      .addCase(onUpdateHour.fulfilled, (state, action) => {
        const updatedHour = action.payload as Hour
        const diffMs = new Date(updatedHour.endDate).getTime() - new Date(updatedHour.startDate).getTime()
        const hours = diffMs / (1000 * 60 * 60)

        const index = state.hours.findIndex((h) => h.id === updatedHour.id)
        if (index !== -1) {
          state.hours[index] = { ...updatedHour, hours }
        }
      })
  },
})


export default hoursSlice.reducer
