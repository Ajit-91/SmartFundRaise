import React from 'react'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4_1 from './Step4_1'
import Step4_2 from './Step4_2'
import Step5 from './Step5'
import Step6 from './Step6'

const Update = ({updateId, isLastestUpdate}) => {
  console.log({updateId})
  return (
    <div className='w-[100%] lg:w-[70%]'>
        {updateId === 1 ? <Step1 isLastestUpdate={isLastestUpdate} /> :
        updateId === 2 ? <Step2 isLastestUpdate={isLastestUpdate} /> :
        updateId === 41 ? <Step4_1 isLastestUpdate={isLastestUpdate} /> :
        updateId === 42 ? <Step4_2 isLastestUpdate={isLastestUpdate} /> :
        updateId === 5 ? <Step5  isLastestUpdate={isLastestUpdate} /> :
        updateId === 6 ? <Step6 isLastestUpdate={isLastestUpdate} /> : 
        <Step3 updateId={updateId} isLastestUpdate={isLastestUpdate} />}
    </div>
  )
}

export default Update