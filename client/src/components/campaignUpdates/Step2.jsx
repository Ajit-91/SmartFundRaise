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

const Step2 = () => {
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Target Reached !!</CardTitle>
                <CardDescription>Target amount is collected. Owner can initiate withdrawl process by creating withdrawl request</CardDescription>
            </CardHeader>
            <CardContent>
                Tip for owner : Often high amount withdrawl requests are rejected. Believe in partial fund withdraw. Start from small amount
                <CustomButton title="Create Withdrawl Request" styles="bg-[#4acd8d] w-full" />
            </CardContent>
        </Card>
        <div className="h-10 w-1 bg-gray-300 mx-auto"></div>
        </>
    )
}

export default Step2