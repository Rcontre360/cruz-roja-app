import {useRouter} from 'next/navigation'
import React from 'react'
import {onGetProfile} from '../stores/actions/users'
import {useAppDispatch, useAppSelector} from '../stores/hooks'

export default function LayoutGuest({children}: React.PropsWithChildren<unknown>) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {user, token, loaded} = useAppSelector((state) => state.user)

  React.useEffect(() => {
    if (loaded && (user.email || token)) router.push('/dashboard')
  }, [user, token, loaded, router])

  React.useEffect(() => {
    dispatch(onGetProfile())
  }, [dispatch])

  return (
    <div className="bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
      {loaded && !user.email ? children : null}
    </div>
  )
}
