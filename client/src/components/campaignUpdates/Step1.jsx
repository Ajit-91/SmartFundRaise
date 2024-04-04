import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const Step1 = ({isLastestUpdate}) => {
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Campaign Started !!</CardTitle>
                <CardDescription>Campaign is just started. Donors can donate as much as they want</CardDescription>
            </CardHeader>
            {/* If donor and deadline reached and amountCollected < target then show Claim refund butto in CardFooter */}
            {/* <CardFooter>
            </CardFooter> */}
        </Card>
        {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
        </>
    )
}

export default Step1