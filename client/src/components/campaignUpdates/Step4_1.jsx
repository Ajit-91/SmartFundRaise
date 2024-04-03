import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useStateContext } from '@/context';
import { Button } from '../ui/button';

const Step4_1 = ({ isLastestUpdate }) => {
    const { isOwner, withdraw } = useStateContext();

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Victory !!</CardTitle>
                    <CardDescription>More than 50% of donors voted for yes. Owner can withdraw the amount specified in withdrawl request</CardDescription>
                </CardHeader>
                {isOwner() && (
                    <CardContent>
                        <Button
                            onClick={withdraw}
                            disabled={!isLastestUpdate}
                            className="bg-custom-primary hover:bg-custom-primary-dark w-full text-white" >
                            Withdraw
                        </Button>
                    </CardContent>
                )}
            </Card>
            {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
        </>
    )
}

export default Step4_1