pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2j_ChangeVisibility{
    uint value;

    function getValue() view external returns (uint) {
        return value;
    }

    function setValue(uint _value) external {
        value = _value;
    }
}
