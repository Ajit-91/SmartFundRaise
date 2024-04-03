import React, { useContext, createContext, useState, useEffect } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, TransactionError } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast"

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(import.meta.env.VITE_CONTRACT_ADDRESS);
  const address = useAddress();
  const connect = useMetamask();
  const { toast } = useToast()
  
  const [theme, setTheme] = useState(localStorage.getItem('Theme') || 'light');
  const [currentCampaign, setCurrentCampaign] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  console.log({ contract })
  console.log({ address })

  const toggleTheme = () => {
    const themeToSet = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('Theme', themeToSet);
    setTheme(themeToSet)
  }

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme])

  const handleError = (fun) => async () => {
    try {
      setIsLoading(true);
      await fun();
    } catch (error) {
      console.log("Transaction failed : ", error)
      toast({
        variant: "destructive", 
        title: "Transaction failed",
        description: error?.reason || "Something went wrong",
      })
    } finally {
      setIsLoading(false);
    }
  }
  // const publishCampaign = async (form) => {
  //   try {
  //     console.log({ form })
  //     setIsLoading(true);
  //     const data = await createCampaign({
  //       args: [
  //         address, // owner
  //         form.title, // title
  //         form.description, // description
  //         form.target,
  //         parseInt(new Date(form.deadline).getTime() / 1000), // deadline,
  //         form.image,
  //       ],
  //     });
  //     console.log("contract call success", data)
  //   } catch (error) {
  //     console.log("contract call failure", error)
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const publishCampaign = async (form) => handleError(async () => {
    await contract.call('createCampaign', [
      address, // owner
      form.title, // title
      form.description, // description
      form.target,
      parseInt(new Date(form.deadline).getTime() / 1000), // deadline,
      form.image,
    ]);
    toast({
      title: "Campaign created successfully",
      description: "Your campaign has been created successfully",
    })
  })()


  // const donate = async (pId, amount) => {
  //   try {
  //     if (!amount) return alert("Please enter a valid amount to donate");
  //     setIsLoading(true);
  //     await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });
  //   } catch (error) {
  //     const errorReason = error?.reason;
  //     console.log("donate failure", error)
  //     alert("Failed to donate : "+ errorReason)
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const donate = async (pId, amount) => handleError(async () => {
    await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });
    toast({
      title: "Donation successful",
      description: "Your donation has been made successfully",
    })
  })();

  // const createWithdrawRequest = async (amount, description, dockLink) => {
  //   try {
  //     setIsLoading(true);
  //     await contract.call('createWithdrawRequest', [
  //       currentCampaign.pId,
  //       ethers.utils.parseUnits(amount, 18),
  //       description,
  //       dockLink
  //     ]);

  //   } catch (error) {
  //     console.log("createWithdrawRequest failure", error)
  //     console.log({ msg: error.message })
  //     alert("Failed to create withdraw request")
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const createWithdrawRequest = async (amount, description, dockLink) => handleError(async () => {
    await contract.call('createWithdrawRequest', [
      currentCampaign.pId,
      ethers.utils.parseUnits(amount, 18),
      description,
      dockLink
    ]);
    toast({
      title: "Withdraw request created",
      description: "Your withdraw request has been created successfully",
    })
  })()


  // const voteYes = async (wrId) => {
  //   try {
  //     setIsLoading(true);
  //     await contract.call('voteYes', [currentCampaign.pId, wrId]);
  //   } catch (error) {
  //     console.log("voteYes failure", error)
  //     alert("Failed to vote")
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const voteYes = async (wrId) => handleError(async () => {
    await contract.call('voteYes', [currentCampaign.pId, wrId]);
    toast({
      title: "Vote successful",
      description: "Your vote has been recorded successfully",
    })
  })()


  // const voteNo = async (wrId) => {
  //   try {
  //     setIsLoading(true);
  //     await contract.call('voteNo', [currentCampaign.pId, wrId]);
  //   } catch (error) {
  //     console.log("voteNo failure", error)
  //     alert("Failed to vote")
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const voteNo = async (wrId) => handleError(async () => {
    await contract.call('voteNo', [currentCampaign.pId, wrId]);
    toast({
      title: "Vote successful",
      description: "Your vote has been recorded successfully",
    })
  })()

  // const withdraw = async () => {
  //   try {
  //     setIsLoading(true);
  //     await contract.call('withdraw', [currentCampaign.pId]);
  //   } catch (error) {
  //     console.log("withdraw failure", error)
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const withdraw = async () => handleError(async () => {
    await contract.call('withdraw', [currentCampaign.pId]);
    toast({
      title: "Withdraw successful",
      description: "Your withdraw has been made successfully",
    })
  })()

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');
    console.log({ campaigns })
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

    for (let i = 0; i < numberOfDonations; i++) {
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
      let data = await contract.call("donations", [currentCampaign.pId, address]);
      data = ethers.BigNumber.from(data); // Convert to BigNumber
      console.log({ isDonor: data })
      return !data.isZero(); // Check if data is not zero
    } catch (error) {
      console.log("isDonor failure", error)
      throw error
    }
  }

  const getWithdrawRequest = async (wrId) => {
    try {
      const data = await contract.call("withdrawRequests", [currentCampaign.pId, wrId]);
      console.log({ wrData: data })
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
        isLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);