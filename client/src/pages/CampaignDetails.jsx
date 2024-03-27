import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Update from '@/components/campaignUpdates/Update';


const CampaignDetails = () => {
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, currentCampaign } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  useEffect(() => {
    if(!currentCampaign || Object.keys(currentCampaign).length === 0) return navigate('/')
  }, [])


  const remainingDays = daysLeft(currentCampaign.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(currentCampaign.pId);

    setDonators(data);
  }


  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address])

  const handleDonate = async () => {
    // add in try catch
    if(!amount) return alert("Please enter a valid amount to donate");
    if(currentCampaign.deadline*1000 < Date.now()) return alert("Deadline has passed. You can't donate to this campaign now.")
    if(currentCampaign.owner === address) return alert("You can't donate to your own campaign.");
    if(currentCampaign.amountCollected + amount > currentCampaign.target) return alert("You can't donate more than the target amount.");
    setIsLoading(true);

    await donate(currentCampaign.pId, amount);

    navigate('/')
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={currentCampaign.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(currentCampaign.target, currentCampaign.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays >= 0 ? remainingDays : "Ended"} />
          <CountBox title={`Raised of ${currentCampaign.target}`} value={currentCampaign.amountCollected} />
          <CountBox title="Total Donors" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-white dark:bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] dark:text-white break-all">{currentCampaign.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about" className="">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{currentCampaign.description}</p>
            </div>
            </TabsContent>
            <TabsContent value="updates">
              <div className='flex-col justify-center  w-full'>
                {currentCampaign?.updates && currentCampaign.updates.map((update, index) => (
                    <Update 
                      key={index} 
                      updateId={update.toNumber()} 
                      isLastestUpdate = {index === currentCampaign.updates.length-1} 
                    />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* <div>
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">Story</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{currentCampaign.description}</p>
            </div>
          </div> */}

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">Donators</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? donators.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] dark:text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                  <p className="font-epilogue font-normal text-[16px] dark:text-[#808191] leading-[26px] break-ll">{item.donation}</p>
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

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails