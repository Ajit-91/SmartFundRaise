import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useStateContext } from '@/context'
import { Button } from '../ui/button';

const Step1 = ({isLastestUpdate}) => {
    const { isDonor, currentCampaign, claimRefund } = useStateContext();

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Campaign Started !!</CardTitle>
                <CardDescription>Campaign is just started. Donors can donate as much as they want</CardDescription>
            </CardHeader>
            {/* If donor and deadline reached and amountCollected < target then show Claim refund butto in CardFooter */}
            {(isDonor() && currentCampaign.deadline*1000 < Date.now() && currentCampaign.amountCollected < currentCampaign.target) && (
            <CardFooter>
                <Button
                    className="bg-custom-primary hover:bg-custom-primary-dark text-white w-full"
                    onClick={claimRefund}
                >
                    Claim Refund
                </Button>
            </CardFooter>
            )}
        </Card>
        {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
        </>
    )
}

export default Step1