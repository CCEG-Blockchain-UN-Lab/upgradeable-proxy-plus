pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintInheritedV1Safe is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
