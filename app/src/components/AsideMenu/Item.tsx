import React, {useState} from 'react'
import {mdiMinus, mdiPlus} from '@mdi/js'
import Icon from '../Icon'
import Link from 'next/link'
import {getButtonColor} from '../../colors'
import AsideMenuList from './List'
import {MenuAsideItem} from '../../interfaces'

type Props = {
  item: MenuAsideItem
  isDropdownList?: boolean
  key?: unknown
  onClick?: () => void
}

const AsideMenuItem = ({item, isDropdownList = false, onClick}: Props) => {
  const [isLinkActive, setIsLinkActive] = useState(false)
  const [isDropdownActive, setIsDropdownActive] = useState(false)

  const activeClassAddon = !item.color && isLinkActive ? 'aside-menu-item-active font-bold' : ''

  const asideMenuItemInnerContents = (
    <>
      {item.icon && (
        <Icon path={item.icon} className={`flex-none ${activeClassAddon}`} w="w-16" size="18" />
      )}
      <span
        className={`grow text-ellipsis line-clamp-1 ${item.menu ? '' : 'pr-12'
          } ${activeClassAddon}`}
      >
        {item.label}
      </span>
      {item.menu && (
        <Icon
          path={isDropdownActive ? mdiMinus : mdiPlus}
          className={`flex-none ${activeClassAddon}`}
          w="w-12"
        />
      )}
    </>
  )

  const componentClass = [
    'flex cursor-pointer',
    isDropdownList ? 'py-3 px-6 text-sm' : 'py-3',
    item.color
      ? getButtonColor(item.color, false, true)
      : `aside-menu-item dark:text-slate-300 dark:hover:text-white`,
  ].join(' ')

  return (
    <li onClick={onClick}>
      {item.href && (
        <Link href={item.href} target={item.target} className={componentClass}>
          {asideMenuItemInnerContents}
        </Link>
      )}
      {!item.href && (
        <div className={componentClass} onClick={() => setIsDropdownActive(!isDropdownActive)}>
          {asideMenuItemInnerContents}
        </div>
      )}
      {item.menu && (
        <AsideMenuList
          menu={item.menu}
          className={`aside-menu-dropdown ${isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden'
            }`}
          isDropdownList
        />
      )}
    </li>
  )
}

export default AsideMenuItem
