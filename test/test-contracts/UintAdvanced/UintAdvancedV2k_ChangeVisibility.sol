pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2k_ChangeVisibility{
    uint value;

    function getValue() view internal returns (uint) {
        return value;
    }

    function setValue(uint _value) internal {
        value = _value;
    }
}
