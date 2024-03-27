import React from 'react'

const CustomButton = ({ btnType, title, handleClick, styles, ...rest }) => {
  return (
    <button
      {...rest}
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles} disabled:bg-[#b2b3bd] disabled:cursor-not-allowed disabled:opacity-80`}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton