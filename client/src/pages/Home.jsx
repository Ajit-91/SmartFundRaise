import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();

    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <>
      <div className="bg-custom-primary rounded-xl mb-5 py-12 px-4 text-center text-white">
        <h1 className="text-4xl font-semibold mb-4">Discover Inspiring Campaigns</h1>
        <p className="text-lg mb-8">
          Explore a world of possibilities and make a difference. 
          Here, you can find a wide range of inspiring campaigns created by users just like you.
        </p>
      </div>

      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </>
  )
}

export default Home