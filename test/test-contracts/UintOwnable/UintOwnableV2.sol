pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintOwnableV2 is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue(uint _value) public onlyOwner{
        value = 2*_value;
    }
}
