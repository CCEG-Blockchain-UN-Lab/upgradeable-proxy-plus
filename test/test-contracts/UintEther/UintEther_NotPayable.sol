pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintEther_NotPayableSafe is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue() public {
        value = msg.value;
    }
}
