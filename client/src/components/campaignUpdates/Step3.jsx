import React, { useEffect, useState } from 'react'
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
import { useStateContext } from '@/context'

const Step3 = ({isLastestUpdate, updateId}) => {
  const { isDonor, getWithdrawRequest, voteYes, voteNo } = useStateContext();
  const [ifDonor, setIfDonor] = useState(false)
  const [data, setData] = useState({});
  console.log({step3D : data})
  useEffect(() => {
    (async () => {
      if(updateId) {
        getWithdrawRequest(updateId).then((res) => setData(res));
        const res = await isDonor()
        setIfDonor(res)
        }
    })()
  }, [updateId, getWithdrawRequest])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Withdrawl Request Created !!</CardTitle>
          <CardDescription>Request created to withdraw {data.amount} ETH </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Description for request</p>
          <a href={data.docLink} target='_blank' className="text-[#4acd8d]">Doc link</a>
          <CardDescription className="text-center mt-2">Total votes: {data.totalVotes}</CardDescription>
          <div className="flex items-center gap-4">
            <div className="w-1/2">Yes</div>
            <div className="w-1/2 text-right">{data.yesVotes}</div>
          </div>
          <Progress className="w-full h-2" value={(data.yesVotes * 100)/data.totalVotes} />
          <div className="flex items-center gap-4">
            <div className="w-1/2">No</div>
            <div className="w-1/2 text-right">{data.noVotes}</div>
          </div>
          <Progress className="w-full h-2" value={(data.noVotes * 100)/data.totalVotes} />
        </CardContent>
        {ifDonor && (
          <>
          {/* <CardDescription>Tip for donors: Always check the request details before voting</CardDescription> */}
        <CardFooter className="flex gap-4">
          <CustomButton handleClick={() => voteYes(updateId)} disabled={!isLastestUpdate} title="Vote Yes" styles="bg-[#4acd8d] w-full" />
          <CustomButton handleClick={() => voteNo(updateId)} disabled={!isLastestUpdate} title="Vote No" styles="bg-[#4acd8d] w-full" />
        </CardFooter>
          </>
        )}
      </Card>
      {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
    </>
  )
}

export default Step3