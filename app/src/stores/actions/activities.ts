import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../api'
import {Activity, CreateActivitySchema} from '../../schemas/activities'
import {handleAPIError} from './utils'

type ActivityState = {
  activities: Activity[]
  loading: boolean
  loaded: boolean
  error: string
}

const INIT_STATE: ActivityState = {
  activities: [],
  loading: false,
  loaded: false,
  error: '',
}

export const onGetActivities = createAsyncThunk('activities/all', async (_, {rejectWithValue}) => {
  try {
    const res = await api.get<{activities: Activity[]}>('/activities/all')
    return res.data.activities
  } catch (err) {
    return handleAPIError(err, rejectWithValue)
  }
})

export const onDeleteActivity = createAsyncThunk(
  'activities/delete',
  async ({id}: {id: string}, {rejectWithValue}) => {
    try {
      await api.delete(`/activities/remove/${id}`)
      return {id}
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)

export const onCreateActivity = createAsyncThunk(
  'activities/create',
  async (
    data: {
      name: string
      description: string
      camp: number
      startDate: number
      endDate: number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/activities/create', data)
      return res.data
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)

export const onUpdateActivity = createAsyncThunk(
  'activities/update',
  async (
    data: {
      id: string
      name: string
      description: string
      camp: number
      startDate: number
      endDate: number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/activities/update/${data.id}`, data)
      return res.data
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)


export const activitiesSlice = createSlice({
  name: 'activities',
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onGetActivities.pending, (state) => {
        state.loading = true
      })
      .addCase(onGetActivities.fulfilled, (state, action) => {
        state.loaded = true
        state.loading = false
      })
      .addCase(onGetActivities.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(onDeleteActivity.fulfilled, (state, action) => {
        if (action.payload && typeof (action.payload as { id: string }).id === 'string') {
          state.activities = state.activities.filter((a) => a.id !== (action.payload as { id: string }).id)
        }
      })
      .addCase(onUpdateActivity.fulfilled, (state, action) => {
      const updatedActivity = action.payload as Activity
      const index = state.activities.findIndex((a) => a.id === updatedActivity.id)
      if (index !== -1) {
        state.activities[index] = updatedActivity
      }
    })
  },
})

export default activitiesSlice.reducer
