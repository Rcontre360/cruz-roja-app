import React, {ReactNode} from 'react'

type Props = {
  custom?: boolean
  first?: boolean
  last?: boolean
  children: ReactNode
}

const SectionTitle: React.FunctionComponent<Props> = ({
  custom = false,
  first = false,
  last = false,
  children,
}) => {
  let classAddon = '-my-6'

  if (first) {
    classAddon = '-mb-6'
  } else if (last) {
    classAddon = '-mt-6'
  }

  return (
    <section className={`pt-24 pb-12 w-100 text-left ${classAddon}`}>
      {custom && children}
      {!custom && <h1 className="text-2xl text-gray-800 dark:text-slate-400">{children}</h1>}
    </section>
  )
}

export default SectionTitle
