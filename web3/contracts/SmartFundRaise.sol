// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SmartFundRaise {
    struct Campaign {
        address owner;
        string title;
        string description;
        string image;
        // uint256 startDate;
        uint256 target;
        uint256 deadline;
        uint256 noOfDonors;
        uint256 amountCollected;
        uint256 noOfWithdrawRequests;
        uint256 amountClaimed;
        uint256 [] updates;
    }

    struct VotesData {
        uint256 yesVotes;
        uint256 noVotes;
        uint256 amount;
        string docLink;
        bool isExpired;
    }


    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(uint256 => mapping(uint256 => VotesData)) public votes;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.image = _image;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.noOfDonors = 0;
        campaign.amountCollected = 0;
        campaign.noOfWithdrawRequests = 0;
        campaign.amountClaimed = 0;
        campaign.updates.push(1);

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];
        require(amount > 0, "You need to donate more than 0 ether.");
        require(campaign.deadline > block.timestamp, "The deadline has been reached.");
        require(campaign.amountCollected + amount <= campaign.target, "The donated amount should be such that it doesn't exceed the target amount.");
        require(campaign.owner != msg.sender, "You cannot donate to your own campaign.");
        require(campaign.updates[campaign.updates.length - 1] == 1, "Campaign is not in donation phase.");

        if(donations[_id][msg.sender] == 0) { // new donor is donating
            campaign.noOfDonors++;
        }
        donations[_id][msg.sender] += amount;
        campaign.amountCollected += amount;

        if(campaign.amountCollected == campaign.target) {
            campaign.updates.push(2);
        }
    }

    // function claimRefund(uint256 _id) public  {

    //     Campaign storage campaign = campaigns[_id];
    //     require(campaign.deadline < block.timestamp, "The deadline has not been reached yet.");
    //     require(campaign.amountCollected < campaign.target, "The target has been reached.");
    //     require(donations[_id][msg.sender] > 0, "You have not donated to this campaign.");

    //     uint256 amount = donations[_id][msg.sender];
    //     donations[_id][msg.sender] = 0;

    //     (bool sent,) = payable(msg.sender).call{value: amount}("");

    //     if(sent) {
    //         campaign.amountCollected = campaign.amountCollected - amount;
    //     }
    // }

    function createWithdrawRequest(uint256 _id, uint256 _amount, string memory _docLink) public {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "You are not the owner of this campaign.");
        require(campaign.amountCollected >= campaign.target, "Target amount is not collected yet, cannot initiate withdrawl process.");
        require(campaign.updates[campaign.updates.length - 1] == 2, "Campaign is not in withdrawl phase as target is not reached yet.");
        require(_amount > 0 && _amount <= campaign.amountCollected - campaign.amountClaimed, "The amount should be greater than 0 and less than the remaining claimed amount.");
        
        uint key = 300 +campaign.noOfWithdrawRequests;
        votes[_id][key] = VotesData({
            yesVotes: 0,
            noVotes: 0,
            amount: _amount,
            docLink: _docLink,
            isExpired: false
        });
        campaign.updates.push(key);
        campaign.noOfWithdrawRequests++;
    }

    function voteYes(uint256 _id, uint256 _key) public {
        Campaign storage campaign = campaigns[_id];
        require(donations[_id][msg.sender] > 0, "You are not a donor for this campaign, Only donors can vote.");
        require(votes[_id][_key].isExpired == false, "The voting period has expired.");
        require(campaign.updates[campaign.updates.length - 1] == _key, "The campaign is not in the voting phase.");

        votes[_id][_key].yesVotes++;
        if(votes[_id][_key].yesVotes > campaign.noOfDonors / 2) {
            votes[_id][_key].isExpired = true;
            campaign.updates.push(41);
        }
    }

    function voteNo(uint256 _id, uint256 _key) public {
        Campaign storage campaign = campaigns[_id];
        require(donations[_id][msg.sender] > 0, "You are not a donor for this campaign, Only donors can vote.");
        require(votes[_id][_key].isExpired == false, "The voting period has expired.");
        require(campaign.updates[campaign.updates.length - 1] == _key, "The campaign is not in the voting phase.");

        votes[_id][_key].noVotes++;
        if(votes[_id][_key].noVotes > campaign.noOfDonors / 2) { // 50% of donors vote no
            votes[_id][_key].isExpired = true;
            campaign.updates.push(42);
        }
    }

    function withdraw(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "You are not the owner of this campaign.");
        require(campaign.updates[campaign.updates.length - 1] == 41, "Campaign is not in withdrawl phase.");

        uint256 amount = votes[_id][campaign.updates[campaign.updates.length - 2]].amount;

        (bool sent,) = payable(msg.sender).call{value: amount}("");

        if(sent) {
            campaign.amountClaimed = campaign.amountClaimed + amount;
        }

        if(campaign.amountClaimed == campaign.amountCollected) {
            campaign.updates.push(6);
        }else{
            campaign.updates.push(5);
        }
    }
     // Function to get all donors and their donation amounts for a specific project
    // function getDonors(uint256 _projectId) external view returns (address[] memory, uint256[] memory) {
    //     mapping(address => uint256) storage projectDonations = donations[_projectId];
        
    //     address[] memory donorAddresses = new address[](projectDonations.length);
    //     uint256[] memory donationAmounts = new uint256[](projectDonations.length);

    //     // Retrieve donor addresses and donation amounts directly into arrays
    //     uint256 index = 0;
    //     for (uint256 i = 0; i < projectDonations.length; i++) {
    //         address donorAddress = projectDonations[i];
    //         donorAddresses[index] = donorAddress;
    //         donationAmounts[index] = projectDonations[donorAddress];
    //         index++;
    //     }

    //     // Return the arrays containing donor addresses and donation amounts
    //     return (donorAddresses, donationAmounts);
    // }
    

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}




