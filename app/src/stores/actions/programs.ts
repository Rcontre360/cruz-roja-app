import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../api'
import {Program} from '../../schemas/programs'
import {handleAPIERror} from './utils'

type ProgramState = {
  programs: Program[]
  loading: boolean
  loaded: boolean
  error: string
}

const INIT_PROGRAM_STATE: ProgramState = {
  programs: [],
  loading: false,
  loaded: false,
  error: '',
}

export const onGetPrograms = createAsyncThunk('programs/all', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get<{programs: Program[]}>('/programs/all')

    return response.data
  } catch (error) {
    return handleAPIERror(error, rejectWithValue)
  }
})

export const onEditProgram = createAsyncThunk(
  'programs/edit',
  async (
    {programId, fields}: {programId: string; fields: Partial<Program>},
    {rejectWithValue}
  ) => {
    try {
      const response = await api.put<{program: Program}>(`/programs/edit/${programId}`, fields)

      return {programId, program: response.data}
    } catch (error) {
      return handleAPIERror(error, rejectWithValue)
    }
  }
)

export const onDeleteProgram = createAsyncThunk(
  'programs/delete',
  async ({programId}: {programId: string}, {rejectWithValue}) => {
    try {
      await api.delete<object>(`/programs/remove/${programId}`)

      return {programId}
    } catch (error) {
      return handleAPIERror(error, rejectWithValue)
    }
  }
)

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
        state.loaded = true
        if (action.payload) state.programs = action.payload.programs
      })
      .addCase(onGetPrograms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(onEditProgram.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(onEditProgram.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true

        if (action.payload)
          for (let i = 0; i < state.programs.length; i++)
            if (state.programs[i].id == Number(action.payload.programId))
              state.programs[i] = action.payload.program.program
      })
      .addCase(onEditProgram.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(onDeleteProgram.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(onDeleteProgram.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true

        state.programs = state.programs.filter(({id}) => id != Number(action.payload?.programId))
      })
      .addCase(onDeleteProgram.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default programSlice.reducer
