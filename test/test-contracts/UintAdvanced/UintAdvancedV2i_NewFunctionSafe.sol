pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintAdvancedV2i_NewFunctionSafe is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setDoubleValue(uint _value) public {
        value = 2*_value;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
