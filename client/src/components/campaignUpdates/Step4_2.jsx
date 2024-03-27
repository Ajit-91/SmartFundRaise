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

const Step4_1 = ({isLastestUpdate}) => {
    const { isOwner } = useStateContext();

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>OOPS !!</CardTitle>
                <CardDescription>More than 50% of donors voted for no. Owner cannot withdraw the amount specified in withdrawl request.
                  However, owner can create a new withdrawl request
                </CardDescription>
            </CardHeader>
            {isOwner() && (
                <CardContent>
                    <CustomButton disabled={!isLastestUpdate} title="Create Withdrawl Request" styles="bg-[#4acd8d] w-full" />
                </CardContent>
            )}
        </Card>
        {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
        </>
    )
}

export default Step4_1