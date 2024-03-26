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

const Step5 = () => {
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Withdraw Success !!</CardTitle>
                <CardDescription>Amount specified in withdrawl request has been withdrawn successfully</CardDescription>
            </CardHeader>
            <CardContent>
                <CustomButton title="Create Withdrawl Request" styles="bg-[#4acd8d] w-full" />
            </CardContent>
        </Card>
        <div className="h-10 w-1 bg-gray-300 mx-auto"></div>
        </>
    )
}

export default Step5