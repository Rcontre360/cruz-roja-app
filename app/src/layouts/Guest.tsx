import {useRouter} from 'next/router'
import React, {ReactNode} from 'react'
import {onGetProfile} from '../stores/actions/users'
import {useAppDispatch, useAppSelector} from '../stores/hooks'

type Props = {
  children: ReactNode
}

export default function LayoutGuest({children}: Props) {
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
