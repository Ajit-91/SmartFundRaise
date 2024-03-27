import React, { useContext, createContext, useState, useEffect } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(import.meta.env.VITE_CONTRACT_ADDRESS);
  console.log({contract})
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const [theme, setTheme] = useState('light');
  const [currentCampaign, setCurrentCampaign] = useState({});

  console.log({currentCampaign})

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    if(theme === "dark"){
      document.documentElement.classList.add("dark");
    }else{
      document.documentElement.classList.remove("dark");
    }
  }, [theme])

  const publishCampaign = async (form) => {
    try {
      console.log({form})
      const data = await createCampaign({
				args: [
					address, // owner
					form.title, // title
					form.description, // description
					form.target,
					parseInt(new Date(form.deadline).getTime()/1000), // deadline,
					form.image,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const donate = async (pId, amount) => {
    if(!amount) return alert("Please enter a valid amount to donate");
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }


  const createWithdrawRequest = async (amount, description, dockLink) => {
    try {
       await contract.call('createWithdrawRequest', [
        currentCampaign.pId,
        ethers.utils.parseUnits(amount, 18),
        // description,
        dockLink
      ]);
      
    } catch (error) {
      console.log("createWithdrawRequest failure", error)
      throw error;
    }
  }

  const voteYes = async (wrId) => {
    try {
      await contract.call('voteYes', [currentCampaign.pId, wrId]);
    } catch (error) {
      console.log("voteYes failure", error)
      alert("Failed to vote")
    }
  }

  const voteNo = async (wrId) => {
    try {
      await contract.call('voteNo', [currentCampaign.pId, wrId]);
    } catch (error) {
      console.log("voteNo failure", error)
      alert("Failed to vote")
    }
  }

  const withdraw = async () => {
    try {
      await contract.call('withdraw', [currentCampaign.pId]);
    } catch (error) {
      console.log("withdraw failure", error)
      throw error;
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');
    console.log({campaigns})
    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      updates: campaign.updates,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }



  const getDonations = async (pId) => {
    const donations = await contract.call('getDonorsAndDonations', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const isOwner = () => address === currentCampaign.owner;

  const isDonor = async () => {
    try {
      let data =  await contract.call("donations", [currentCampaign.pId, address]);
      data = ethers.BigNumber.from(data); // Convert to BigNumber
      console.log({isDonor: data})
      return !data.isZero(); // Check if data is not zero
    } catch (error) {
      console.log("isDonor failure", error)
      throw error
    }
  }

  const getWithdrawRequest = async (wrId) => {
    try {
      const data = await contract.call("withdrawRequests", [currentCampaign.pId, wrId]);
      console.log({wrData : data})
      const yes = data.yesVotes.toNumber();
      const no = data.noVotes.toNumber();
      const total = yes + no;
      return {
        amount: ethers.utils.formatEther(data.amount.toString()),
        description: data.description,
        docLink: data.docLink,
        yesVotes: yes,
        noVotes: no,
        totalVotes: total,
      }
    } catch (error) {
      console.log("getWithdrawRequest failure", error)
      throw error;
    }
  }

  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        isOwner,
        isDonor,
        donate,
        getDonations,
        theme,
        toggleTheme,
        currentCampaign,
        setCurrentCampaign,
        createWithdrawRequest,
        voteYes,
        voteNo,
        withdraw,
        getWithdrawRequest,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);