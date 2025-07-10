import React from 'react'

type Props = {
  type: 'checkbox' | 'radio' | 'switch'
  label?: string
  className?: string
}

const FormCheckRadio: React.FunctionComponent<React.PropsWithChildren<Props>> = (props) => {
  return (
    <label className={`${props.type} ${props.className}`}>
      {props.children}
      <span className="check" />
      <span className="pl-2">{props.label}</span>
    </label>
  )
}

export default FormCheckRadio
