import React from 'react'

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange, inputProps, required = true }) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] dark:text-white text-[#383941] mb-[5px]">{labelName}</span>
      )}
      {isTextArea ? (
        <textarea 
          required={required}
          value={value}
          onChange={handleChange}
          rows={5}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-custom-primary-darker bg-transparent font-epilogue dark:text-white text-[14px] placeholder:text-[#191b20] placeholder:dark:text-white text-[#383941] rounded-[10px] sm:min-w-[300px]"
        />
      ) : (
        <input 
        {...inputProps}  
        required={required}
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-custom-primary-darker bg-transparent font-epilogue dark:text-white text-[14px] placeholder:text-[#191b20] placeholder:dark:text-white rounded-[10px] sm:min-w-[300px]"
        />
      )}
    </label>
  )
}

export default FormField