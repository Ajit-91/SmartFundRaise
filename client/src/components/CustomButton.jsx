import React from 'react'
import { Button } from './ui/button'

const CustomButton = ({ children, styles, ...rest }) => {
  return (
    <Button
      {...rest}
      className={`font-semibold text-[16px] text-white p-3 rounded-lg ${styles} `}
    >
      {children}
    </Button>
  )
}

export default CustomButton