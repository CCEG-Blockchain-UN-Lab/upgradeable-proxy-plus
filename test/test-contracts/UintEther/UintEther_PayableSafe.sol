pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintEther_PayableSafe is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue() payable public {
        value = msg.value;
    }
}
