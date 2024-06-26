import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { useStateContext } from '../context';
import { Loader } from '.';
// import { Loader } from './Loader';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const { setCurrentCampaign } = useStateContext();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`)
    setCurrentCampaign(campaign);
  }

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px]  black:text-white text-left">{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <div className='p-5 flex justify-center items-center w-full'>
            <Loader variant="inline" />
          </div>
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => <FundCard
          key={uuidv4()}
          {...campaign}
          handleClick={() => handleNavigate(campaign)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns