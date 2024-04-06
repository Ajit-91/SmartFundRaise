import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../context';
import { CountBox } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { metamask } from '../assets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Update from '@/components/campaignUpdates/Update';
import { Button } from '@/components/ui/button';
import { HandCoins } from 'lucide-react';
import DisplayComments from '@/components/Comments/DisplayComments';
import { useToast } from "@/components/ui/use-toast"
import CountdownTimer from '@/components/CountdownTimer';

const CampaignDetails = () => {
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, currentCampaign } = useStateContext();
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const { toast } = useToast()

  useEffect(() => {
    if(!currentCampaign || Object.keys(currentCampaign).length === 0) return navigate('/')
  }, [currentCampaign])


  const remainingDays = daysLeft(currentCampaign.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(currentCampaign.id);

    setDonators(data);
  }


  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address, currentCampaign])

  const handleDonate = async () => {
    if(!amount){
      return toast({
        variant: "destructive", 
        title: "Validation Error",
        description: "Please enter the amount to donate.",
      })
    }
    await donate(currentCampaign.id, amount);
  }

  return (
    <div>
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={currentCampaign.image} alt="campaign" className="w-full h-[410px] md:h-[520px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-custom-primary" style={{ width: `${calculateBarPercentage(currentCampaign.target, currentCampaign.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays >= 0 ? remainingDays : "Ended"} />
          <CountBox title={`Raised of ${currentCampaign.target}`} value={currentCampaign.amountCollected} />
          <CountBox title={`Claimed of ${currentCampaign.target}`} value={currentCampaign.amountClaimed} />
          <CountBox title="Total Donors" value={donators.length} />
        </div>
      </div>

      <div className="mt-10" >
        <CountdownTimer deadline={currentCampaign.deadline} />
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center  gap-[14px]">
              <div className="max-w-[52px] max-h-[52px] min-w-[52px] min-h-[52px]  flex items-center justify-center rounded-full bg-white dark:bg-[#2c2f32] cursor-pointer">
                <img src={metamask} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] dark:text-white break-all">{currentCampaign.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">Owner</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about" className="">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{currentCampaign.description}</p>
            </div>
            </TabsContent>
            <TabsContent value="updates">
              <div className='flex flex-col justify-center w-full'>
                {currentCampaign?.updates && currentCampaign.updates.map((update, index) => (
                    <Update 
                      key={index} 
                      updateId={update.toNumber()} 
                      isLastestUpdate = {index === currentCampaign.updates.length-1} 
                    />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="comments">
              <div className='flex flex-col justify-center w-full'>
                <DisplayComments />
              </div>
            </TabsContent>
          </Tabs>


          <div>
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">Donators</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? donators.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex flex-row justify-between items-center gap-4">
                  <p className="break-all font-epilogue font-normal text-[16px] dark:text-[#b2b3bd] ">{index + 1}. {item.donator}</p>
                  <p className="font-epilogue font-normal text-[16px] dark:text-[#808191] ">{item.donation} ETH</p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">Fund</h4>

          <div className="mt-[20px] flex flex-col p-4 bg-white dark:bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] dark:border-[#3a3a43] bg-transparent font-epilogue dark:text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#f0f2f5] dark:bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] dark:text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <Button
                className="w-full bg-custom-primary hover:bg-custom-primary-dark min-h-[52px] text-[16px] text-white"
                onClick={handleDonate}
              >
                <HandCoins size={25} className='mr-3' />
                Fund Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails