pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintAdvancedV2c_NewEvent is UpgradeablePlus {
    uint value;
    event EventSetValue(uint newValue, uint oldValue);

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue(uint _value) public {
        EventSetValue(_value, value);
        value = _value;
    }
}
