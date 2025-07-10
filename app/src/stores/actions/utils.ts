import {AxiosError} from 'axios'

export const handleAPIError = (error: unknown, rejectWithValue: (msg: string) => void): any => {
  const err = error as AxiosError

  if (Number(err.status) == 401) return rejectWithValue('No autorizado para esta accion')
  if (Number(err.status) >= 500)
    return rejectWithValue('Hubo un error en el servidor, contacte a soporte')
  if (Number(err.status) >= 400) return rejectWithValue('Error al realizar accion')

  return rejectWithValue(err.message)
}
