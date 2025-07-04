import React from 'react'
import {mdiLogout, mdiClose} from '@mdi/js'
import Icon from '../Icon'
import AsideMenuItem from './Item'
import AsideMenuList from './List'
import {MenuAsideItem} from '../../interfaces'
import {useAppDispatch} from '../../stores/hooks'
import {useRouter} from 'next/navigation'
import {onLogout} from '../../stores/actions/users'

type Props = {
  menu: MenuAsideItem[]
  className?: string
  onAsideLgCloseClick: () => void
  key?: unknown
}

export default function AsideMenuLayer({menu, className = '', ...props}: Props) {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const logoutItem: MenuAsideItem = {
    label: 'Logout',
    icon: mdiLogout,
    color: 'info',
    isLogout: true,
  }

  const handleAsideLgCloseClick = (e: React.MouseEvent) => {
    e.preventDefault()
    props.onAsideLgCloseClick()
  }

  const handleLogout = async () => {
    await dispatch(onLogout())
    router.push('/')
  }

  return (
    <aside
      className={`${className} zzz lg:py-2 lg:pl-2 w-80 fixed flex z-40 top-0 h-screen transition-position overflow-hidden`}
    >
      <div
        className={`aside lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900`}
      >
        <div
          className={`aside-brand flex flex-row h-14 items-center justify-between dark:bg-slate-900`}
        >
          <div className="text-center flex-1 lg:text-left lg:pl-6 xl:text-center xl:pl-0">
            <b className="font-black">One</b>
          </div>
          <button
            className="hidden lg:inline-block xl:hidden p-3"
            onClick={handleAsideLgCloseClick}
          >
            <Icon path={mdiClose} />
          </button>
        </div>
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden  aside-scrollbars-[slate]'
            }`}
        >
          <AsideMenuList menu={menu} />
        </div>
        <ul>
          <AsideMenuItem item={logoutItem} onClick={handleLogout} />
        </ul>
      </div>
    </aside>
  )
}
