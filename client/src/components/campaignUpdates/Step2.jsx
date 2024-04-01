import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CustomButton } from '..'
import { useStateContext } from '@/context';
import { WithdrawRequest } from './WithdrawRequest';

const Step2 = ({isLastestUpdate}) => {
    const { isOwner } = useStateContext();
    const [open, setOpen] = useState(false)

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Target Reached !!</CardTitle>
                <CardDescription>Target amount is collected. Owner can initiate withdrawl process by creating withdrawl request</CardDescription>
            </CardHeader>
          {isOwner() && (
          <CardContent>
                {/* <CustomButton 
                    disabled={!isLastestUpdate} 
                    title="Create Withdrawl Request" 
                    styles="bg-[#4acd8d] w-full" 
                    handleClick={() => setOpen(true)}
                /> */}
                <WithdrawRequest open={open} setOpen={setOpen} isLastestUpdate={isLastestUpdate} />
            </CardContent>
            )}
        </Card>
        {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
        </>
    )
}

export default Step2