import React from 'react'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4_1 from './Step4_1'
import Step4_2 from './Step4_2'
import Step5 from './Step5'
import Step6 from './Step6'

const Update = ({updateId}) => {
  console.log({updateId})
  return (
    <div className='w-[50%]'>
        {updateId === 1 ? <Step1 /> :
        updateId === 2 ? <Step2 /> :
        updateId === 41 ? <Step4_1 /> :
        updateId === 42 ? <Step4_2 /> :
        updateId === 5 ? <Step5 /> :
        updateId === 6 ? <Step6 /> : 
        <Step3 />}
    </div>
  )
}

export default Update