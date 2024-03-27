import React from 'react'
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

const Step5 = ({isLastestUpdate}) => {
    const { isOwner } = useStateContext();

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Withdraw Success !!</CardTitle>
                <CardDescription>Amount specified in withdrawl request has been withdrawn successfully</CardDescription>
                <CardDescription>New withdrawl request can be created to withdraw the remaining amount</CardDescription>
            </CardHeader>
            {isOwner() && (
                <CardContent>
                    <WithdrawRequest isLastestUpdate={isLastestUpdate} />
                </CardContent>
            )}
        </Card>
        {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
        </>
    )
}

export default Step5