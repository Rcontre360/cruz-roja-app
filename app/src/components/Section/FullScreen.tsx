import React, {ReactNode} from 'react'

type Props = {
  children: ReactNode
}

export default function SectionFullScreen({children}: Props) {
  return (
    <div className="flex items-center justify-center content-center w-full min-h-screen">
      {children}
    </div>
  )
}
