import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../../api'
import {Program} from '../../schemas/programs'

type ProgramState = {
  programs: Program[]
  loading: boolean
  error: string
}

const INIT_PROGRAM_STATE: ProgramState = {
  programs: [],
  loading: false,
  error: '',
}

export const onGetPrograms = createAsyncThunk('programs/all', async ({rejectWithValue}) => {
  try {
    const response = await api.post<{programs: Program[]}>('/programs/all')
    return response.data
  } catch (error: {response: {data: {message: string}}}) {
    return rejectWithValue(error.response.data.message)
  }
})

const programSlice = createSlice({
  name: 'programs',
  initialState: INIT_PROGRAM_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onGetPrograms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(onGetPrograms.fulfilled, (state, action) => {
        state.loading = false
        state.programs = action.payload.programs
      })
      .addCase(onGetPrograms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default programSlice.reducer
