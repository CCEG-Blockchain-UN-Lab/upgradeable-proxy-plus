pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintEventV1Safe is UpgradeablePlus {
    uint value;
    event EventValueChanged(uint newValue);
    event EventValueChanged2(uint newValue2);

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue(uint _value) public {
        EventValueChanged(_value);
        value = _value;
    }
}
