// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DosVulnerable {
    
    address public highestBidder;
    uint public highestBid;

    constructor(){
        highestBidder = msg.sender;
    }

    function bid() payable public {
        require(msg.value > highestBid, "Amount less than highest bid");
        // this makes it vulnerable to dos attack
        // because if the transaction fails the the highest bid and bidder cannot be changed
        // any contract that does not implment a fallback()/recieve() will prevent any change in highest bidder
        (bool sent,) = highestBidder.call{value: highestBid}("");

        if(sent){
            highestBid = msg.value;
            highestBidder = msg.sender;
        }
    }
}
