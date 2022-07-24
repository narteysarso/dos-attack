// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DosResistant {
    
    address public highestBidder;
    uint public highestBid;

    // Track balance of all bidders
    // this is neccessary to be able to send back their respective Eth
    mapping (address => uint) balancesOf;

    constructor(){
        highestBidder = msg.sender;
    }

    // to make this function dos resistant, we create another function for withdraw
    // so that no external factor can cause the contract to stall.
    function bid() payable public {
        require(msg.value > highestBid, "Amount less than highest bid");

        balancesOf[msg.sender] += msg.value;
        
        highestBid = msg.value;
        highestBidder = msg.sender;
        
    }

    function withdraw() public {
        require(msg.sender != highestBidder, "Highest bidder cannot withdraw");

        uint amount = balancesOf[msg.sender];
        require(amount > 0 , "You have no balance");


        balancesOf[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send amount");
        
    }
}
