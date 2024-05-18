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
import { useStateContext } from '@/context'
import { Button } from '../ui/button'
import RenderLargeText from '../RenderLargeText'
import { Loader } from '..'
import { ipfsToHttp } from '@/utils'

const Step3 = ({ isLastestUpdate, updateId }) => {
  const { isDonor, getWithdrawRequest, voteYes, voteNo } = useStateContext();
  const [data, setData] = useState();


  console.log({ step3D: data })
  useEffect(() => {
    (async () => {
      if (updateId) {
        getWithdrawRequest(updateId).then((res) => setData(res));
      }
    })()
  }, [updateId, getWithdrawRequest])

  return (
    <>
      <Card>
        {!data ? (
          <div className='p-5 flex justify-center items-center w-full'>
            <Loader variant="inline" />
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Withdrawl Request Created !!</CardTitle>
              <CardDescription>Request created to withdraw {data.amount} ETH </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Description for request</p>
              <CardDescription>
                <RenderLargeText text={data.description} />
              </CardDescription>
              {data.docLink && <a href={ipfsToHttp(data.docLink)} target='_blank' className="text-custom-primary">Doc link</a>}
              <CardDescription className="text-center mt-2">Total votes: {data.totalVotes}</CardDescription>
              <div className="flex items-center gap-4">
                <div className="w-1/2">Yes</div>
                <div className="w-1/2 text-right">{data.yesVotes}</div>
              </div>
              <Progress className="w-full h-2 mt-1 border border-primary-foreground" value={(data.yesVotes * 100) / data.totalVotes} />
              <div className="flex items-center gap-4 mt-3">
                <div className="w-1/2">No</div>
                <div className="w-1/2 text-right">{data.noVotes}</div>
              </div>
              <Progress className="w-full h-2 mt-1 border border-primary-foreground" value={(data.noVotes * 100) / data.totalVotes} />
            </CardContent>
            {isDonor() && (
              <>
                {/* <CardDescription>Tip for donors: Always check the request details before voting</CardDescription> */}
                <CardFooter className="flex gap-4">
                  <Button
                    onClick={() => voteYes(updateId)}
                    disabled={!isLastestUpdate}
                    className="bg-custom-primary hover:bg-custom-primary-dark text-white w-full"
                  >
                    Vote Yes
                  </Button>

                  <Button
                    onClick={() => voteNo(updateId)}
                    disabled={!isLastestUpdate}
                    className="bg-custom-primary hover:bg-custom-primary-dark text-white w-full"
                  >
                    Vote No
                  </Button>
                </CardFooter>
              </>
            )}
          </>
        )}
      </Card>
      {!isLastestUpdate && <div className="h-10 w-0.5 bg-gray-300 mx-auto"></div>}
    </>
  )
}

export default Step3