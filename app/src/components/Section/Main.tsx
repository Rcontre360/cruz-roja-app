import React from 'react'
import {containerMaxW} from '../../config'

export const SectionMain: React.FC = ({children}) => {
  return <section className={`p-6 ${containerMaxW}`}>{children}</section>
}

export default SectionMain
