pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintEventV2b_EventReorderedSafe is UpgradeablePlus {
    uint value;
    event EventValueChanged2(uint newValue2);
    event EventValueChanged(uint newValue);

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue(uint _value) public {
        EventValueChanged(_value);
        value = _value;
    }
}
