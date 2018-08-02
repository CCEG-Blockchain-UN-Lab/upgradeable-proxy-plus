pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract ChangeType_Uint8 is UpgradeablePlus {
    uint8 value;

    function getValue() view public returns (uint8) {
        return value;
    }

    function setValue(uint8 _value) public {
        value = _value;
    }
}
