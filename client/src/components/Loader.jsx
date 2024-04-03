import React from 'react'
import { Loader as Loading } from 'lucide-react';

const Loader = ({ variant = "centered", size = 40 }) => {
  return (
    <>
      {variant === "inline" ? (
        <Loading size={size} className={`animate-spin-slow object-contain text-custom-primary`} />
      ) : (
        <div className="fixed inset-0 z-[100] h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
          <Loading size={80} className={`animate-spin-slow object-contain text-custom-primary`} />
          <p className="mt-[20px] font-epilogue font-bold text-[20px] text-white text-center">
            Transaction is in progress <br /> Please wait...
          </p>
        </div>
      )}
    </>
  )
}

export default Loader