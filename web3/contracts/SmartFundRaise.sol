// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SmartFundRaise {
    struct Campaign {
        uint256 id;
        address owner;
        string title;
        string description;
        string image;
        uint256 startDate;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        uint256 noOfWithdrawRequests;
        uint256 amountClaimed;
        uint256 [] updates;
        address [] donors;
    }

    struct WithdrawRequest {
        uint256 id;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 amount;
        string description;
        string docLink;
        bool isActive;
    }

    struct Comment {
        uint256 id;
        address commenter;
        string comment;
        uint256 timestamp;
    }

    mapping(uint256 => Comment[]) private comments;
    mapping(uint256 => Campaign) private campaigns;
    mapping(uint256 => mapping(address => uint256)) private donations;
    mapping(uint256 => mapping(uint256 => WithdrawRequest)) public withdrawRequests;
    uint256 private numberOfCampaigns = 0;

    //  modifers - onlyOwner and onlyDonor
    modifier onlyOwner(uint256 _id) {
        require(campaigns[_id].owner == msg.sender, "You are not the owner of this campaign.");
        _;
    }

    modifier onlyDonor(uint256 _id) {
        require(donations[_id][msg.sender] > 0, "You are not a donor for this campaign.");
        _;
    }

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");
        require(_target > 0, "The target amount should be greater than 0.");

        campaign.id = numberOfCampaigns;
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.image = _image;
        campaign.startDate = block.timestamp;
        campaign.target = _target;
        campaign.deadline = _deadline;
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
            campaign.donors.push(msg.sender);
        }

        donations[_id][msg.sender] += amount;
        campaign.amountCollected += amount;

        if(campaign.amountCollected == campaign.target) {
            campaign.updates.push(2);
        }
    }

    function claimRefund(uint256 _id) public onlyDonor(_id)  {
        Campaign storage campaign = campaigns[_id];
        require(campaign.amountCollected < campaign.target, "The target amount is collected, you cannot claim refund now.");
        require(campaign.deadline < block.timestamp, "The deadline has not been reached yet.");
        // require(donations[_id][msg.sender] > 0, "You have not donated to this campaign.");

        uint256 amount = donations[_id][msg.sender];
        donations[_id][msg.sender] = 0;

        (bool sent,) = payable(msg.sender).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected - amount;
        }
    }

    function createWithdrawRequest(uint256 _id, uint256 _amount, string memory _description,  string memory _docLink) public onlyOwner(_id) {
        Campaign storage campaign = campaigns[_id];
        // require(campaign.owner == msg.sender, "You are not the owner of this campaign.");
        require(campaign.amountCollected >= campaign.target, "Target amount is not collected yet, you cannot create withdrawal request right now.");
        uint256 latestUpdate = campaign.updates[campaign.updates.length - 1];
        require(latestUpdate == 2 || latestUpdate == 42|| latestUpdate == 5, "You can create a new Withdrawal Request only if it is the first withdrawal request after target amount is collected, or if the previous withdrawal request has been successfully concluded.");
        require(_amount > 0 && _amount <= campaign.amountCollected - campaign.amountClaimed, "The amount should be greater than 0 and less than the remaining claimed amount.");
        
        uint wrId = 300 +campaign.noOfWithdrawRequests;
        withdrawRequests[_id][wrId] = WithdrawRequest({
            id: wrId,
            yesVotes: 0,
            noVotes: 0,
            amount: _amount,
            description: _description,
            docLink: _docLink,
            isActive: true
        });
        campaign.updates.push(wrId);
        campaign.noOfWithdrawRequests++;
    }

    function voteYes(uint256 _id, uint256 _wrId) public onlyDonor(_id) {
        Campaign storage campaign = campaigns[_id];
        // require(donations[_id][msg.sender] > 0, "You are not a donor for this campaign, Only donors can vote.");
        require(withdrawRequests[_id][_wrId].isActive == true, "This withdraw request is not active for voting.");
        require(campaign.updates[campaign.updates.length - 1] >= 300, "The campaign is not in the voting phase.");

        withdrawRequests[_id][_wrId].yesVotes++;
        if(withdrawRequests[_id][_wrId].yesVotes > campaign.donors.length / 2) {
            withdrawRequests[_id][_wrId].isActive = false;
            campaign.updates.push(41);
        }
    }

    function voteNo(uint256 _id, uint256 _wrId) public onlyDonor(_id) {
        Campaign storage campaign = campaigns[_id];
        // require(donations[_id][msg.sender] > 0, "You are not a donor for this campaign, Only donors can vote.");
        require(withdrawRequests[_id][_wrId].isActive == true, "This withdraw request is not active for voting.");
        require(campaign.updates[campaign.updates.length - 1] >= 300, "The campaign is not in the voting phase.");

        withdrawRequests[_id][_wrId].noVotes++;
        if(withdrawRequests[_id][_wrId].noVotes > campaign.donors.length / 2) { // 50% of donors vote no
            withdrawRequests[_id][_wrId].isActive = false;
            campaign.updates.push(42);
        }
    }

    function withdraw(uint256 _id) public onlyOwner(_id) {
        Campaign storage campaign = campaigns[_id];
        // require(campaign.owner == msg.sender, "You are not the owner of this campaign.");
        require(campaign.updates[campaign.updates.length - 1] == 41, "Campaign is not in withdrawal phase.");

        uint256 amount = withdrawRequests[_id][campaign.updates[campaign.updates.length - 2]].amount;

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


    function addComment(uint256 _id, string memory _comment) public {
        comments[_id].push(Comment({
            id: comments[_id].length,
            commenter: msg.sender,
            comment: _comment,
            timestamp: block.timestamp
        }));
    }
 
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    // function to get the campaingn details by id
    function getCampaign(uint256 _id) public view returns (Campaign memory) {
        return campaigns[_id];
    }

    function getDonorsAndDonations(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_id];
        address[] memory donors = new address[](campaign.donors.length);
        uint256[] memory donationsArray = new uint256[](campaign.donors.length);

        for(uint i = 0; i < campaign.donors.length; i++) {
            address donor = campaign.donors[i];
            uint256 donation = donations[_id][donor];

            donors[i] = donor;
            donationsArray[i] = donation;
        }

        return (donors, donationsArray);
    }


    function getComments(uint256 _id) public view returns (Comment[] memory) {
        return comments[_id];
    }
}
