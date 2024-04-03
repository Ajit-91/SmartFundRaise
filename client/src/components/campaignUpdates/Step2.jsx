import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
                <WithdrawRequest open={open} setOpen={setOpen} isLastestUpdate={isLastestUpdate} />
            </CardContent>
            )}
        </Card>
        {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
        </>
    )
}

export default Step2