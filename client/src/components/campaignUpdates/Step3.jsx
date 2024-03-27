import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CustomButton } from '..'

const Step3 = ({isLastestUpdate}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Withdrawl Request Created !!</CardTitle>
          <CardDescription>Request created to withdraw 5 ETH </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Description for request</p>
          <a href="#" className="text-[#4acd8d]">Doc link</a>
          <CardDescription className="text-center mt-2">Total votes: 1,023,321</CardDescription>
          <div className="flex items-center gap-4">
            <div className="w-1/2">Yes</div>
            <div className="w-1/2 text-right">732,123</div>
          </div>
          <Progress className="w-full h-2" value={72} />
          <div className="flex items-center gap-4">
            <div className="w-1/2">No</div>
            <div className="w-1/2 text-right">291,198</div>
          </div>
          <Progress className="w-full h-2" value={28} />
        </CardContent>
        <CardFooter className="flex gap-4">
          {/* <Button>Vote Yes</Button>
        <Button>Vote No</Button> */}
          <CustomButton disabled={!isLastestUpdate} title="Vote Yes" styles="bg-[#4acd8d] w-full" />
          <CustomButton disabled={!isLastestUpdate} title="Vote No" styles="bg-[#4acd8d] w-full" />

        </CardFooter>
      </Card>
      {!isLastestUpdate && <div className="h-10 w-1 bg-gray-300 mx-auto"></div>}
    </>
  )
}

export default Step3