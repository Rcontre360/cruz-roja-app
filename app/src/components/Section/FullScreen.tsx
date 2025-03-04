import React, {ReactNode} from 'react'
import {BgKey} from '../../interfaces'

type Props = {
  bg: BgKey
  children: ReactNode
}

export default function SectionFullScreen({bg, children}: Props) {
  return (
    <div className="flex items-center justify-center content-center w-full h-screen">
      {children}
    </div>
  );
}
