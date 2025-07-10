import React, {ReactNode} from 'react'

type Props = {
  children: ReactNode
}

export const SectionFullScreen: React.FunctionComponent<Props> = ({children}) => {
  return (
    <div className="flex items-center justify-center content-center w-full min-h-screen">
      {children}
    </div>
  )
}

export default SectionFullScreen
