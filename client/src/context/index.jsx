import React, { useContext, createContext, useState, useEffect } from 'react';

import { useAddress, useContract, useMetamask, useStorageUpload } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast"

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(import.meta.env.VITE_CONTRACT_ADDRESS);
  const address = useAddress();
  const connect = useMetamask();
  const { toast } = useToast()
  const { mutateAsync: upload } = useStorageUpload();
  
  const [theme, setTheme] = useState(localStorage.getItem('Theme') || 'light');
  const [currentCampaign, setCurrentCampaign] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  console.log({ contract })
  console.log({ address })
  console.log({ currentCampaign })

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
      if(!address) {
        const err = new Error();
        err.reason = "Please connect your metamask wallet to perform this action";
        throw err;
      }
      setIsLoading(true);
      await fun();
    } catch (error) {
      console.log("Transaction failed : ", error)
      toast({
        variant: "destructive", 
        title: "Transaction Failed",
        description: error?.reason || "Something went wrong",
      })
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const uploadFile = async (file) => {
    try {
      const uris = await upload({ data: [file] });
      console.log({uris})
      return uris[0];
    } catch (error) {
      console.log("Failed to upload file", error)
      error.reason = "Failed to upload file";
      throw error;
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
      form.image = await uploadFile(form.image)
      await contract.call('createCampaign', [
        address, // owner
        form.title, // title
        form.description, // description
        form.target,
        parseInt(new Date(form.deadline).getTime() / 1000), // deadline,
        form.image,
      ]);
      toast({
        variant: "success",
        title: "Campaign created successfully",
        description: "Your campaign has been created successfully",
      })
  })()


  
  const fetchCampaignById = async (id) => {
    const campaign = await contract.call('getCampaign', [id]);
    console.log({ campaign })
    setCurrentCampaign ({
      id: campaign.id.toNumber(),
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      amountClaimed: ethers.utils.formatEther(campaign.amountClaimed.toString()),
      image: campaign.image,
      updates: campaign.updates,
      donors: campaign.donors,
    })
  }

  // const donate = async (id, amount) => {
  //   try {
  //     if (!amount) return alert("Please enter a valid amount to donate");
  //     setIsLoading(true);
  //     await contract.call('donateToCampaign', [id], { value: ethers.utils.parseEther(amount) });
  //   } catch (error) {
  //     const errorReason = error?.reason;
  //     console.log("donate failure", error)
  //     alert("Failed to donate : "+ errorReason)
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const donate = async (id, amount) => handleError(async () => {
    await contract.call('donateToCampaign', [id], { value: ethers.utils.parseEther(amount) });
    await fetchCampaignById(id);
    toast({
      variant: "success",
      title:"Donation successful",
      description: "Your donation has been made successfully",
    })
  })();


  const claimRefund = async () => handleError(async () => {
    await contract.call('claimRefund', [currentCampaign.id]);
    await fetchCampaignById(currentCampaign.id);
    toast({
      variant: "success",
      title:"Refund Claimed",
      description: "Your refund has been claimed successfully",
    })
  })()

  // const createWithdrawRequest = async (amount, description, dockLink) => {
  //   try {
  //     setIsLoading(true);
  //     await contract.call('createWithdrawRequest', [
  //       currentCampaign.id,
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
    if(dockLink){
      dockLink = await uploadFile(dockLink);
    }
    await contract.call('createWithdrawRequest', [
      currentCampaign.id,
      ethers.utils.parseUnits(amount, 18),
      description,
      dockLink
    ]);
    await fetchCampaignById(currentCampaign.id);
    toast({
      variant: "success",
      title: "Withdraw request created",
      description: "Your withdraw request has been created successfully",
    })
  })()


  // const voteYes = async (wrId) => {
  //   try {
  //     setIsLoading(true);
  //     await contract.call('voteYes', [currentCampaign.id, wrId]);
  //   } catch (error) {
  //     console.log("voteYes failure", error)
  //     alert("Failed to vote")
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const voteYes = async (wrId) => handleError(async () => {
    await contract.call('voteYes', [currentCampaign.id, wrId]);
    await fetchCampaignById(currentCampaign.id);
    toast({
      variant: "success",
      title: "Vote successful",
      description: "Your vote has been recorded successfully",
    })
  })()


  // const voteNo = async (wrId) => {
  //   try {
  //     setIsLoading(true);
  //     await contract.call('voteNo', [currentCampaign.id, wrId]);
  //   } catch (error) {
  //     console.log("voteNo failure", error)
  //     alert("Failed to vote")
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const voteNo = async (wrId) => handleError(async () => {
    await contract.call('voteNo', [currentCampaign.id, wrId]);
    await fetchCampaignById(currentCampaign.id);
    toast({
      variant: "success",
      title: "Vote successful",
      description: "Your vote has been recorded successfully",
    })
  })()

  // const withdraw = async () => {
  //   try {
  //     setIsLoading(true);
  //     await contract.call('withdraw', [currentCampaign.id]);
  //   } catch (error) {
  //     console.log("withdraw failure", error)
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const withdraw = async () => handleError(async () => {
    await contract.call('withdraw', [currentCampaign.id]);
    await fetchCampaignById(currentCampaign.id);
    toast({
      variant: "success",
      title: "Withdraw successful",
      description: "Your withdraw has been made successfully",
    })
  })()

  const addComment = async (comment) => handleError(async () => {
    await contract.call('addComment', [currentCampaign.id, comment]);
    toast({
      variant: "success",
      title: "Comment added",
      description: "Your comment has been added successfully",
    })
  })()

  const getComments = async () => {
    const comments = await contract.call('getComments', [currentCampaign.id]);
    return comments.map((c) => {
      return {
        commenter: c.commenter,
        comment: c.comment,
        date: c.timestamp.toNumber()*1000,
      }
    })
  }


  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');
    const parsedCampaings = campaigns.map((campaign, i) => ({
      id: campaign.id.toNumber(),
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      amountClaimed: ethers.utils.formatEther(campaign.amountClaimed.toString()),
      image: campaign.image,
      updates: campaign.updates,
      donors: campaign.donors,
    }));

    console.log({ parsedCampaings })

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }


  const getDonations = async (id) => {
    const donations = await contract.call('getDonorsAndDonations', [id]);
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
  const isDonor = () => currentCampaign.donors.includes(address);

  // const isDonor = async () => {
  //   try {
  //     let data = await contract.call("donations", [currentCampaign.id, address]);
  //     data = ethers.BigNumber.from(data); // Convert to BigNumber
  //     console.log({ isDonor: data })
  //     return !data.isZero(); // Check if data is not zero
  //   } catch (error) {
  //     console.log("isDonor failure", error)
  //     throw error
  //   }
  // }


  const getWithdrawRequest = async (wrId) => {
    try {
      const data = await contract.call("withdrawRequests", [currentCampaign.id, wrId]);
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
        claimRefund,
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
        addComment,
        getComments,
        uploadFile,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);