pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintEther_NormalSafe is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue() payable public {
        value = 10;
    }
}
