pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2s_ChangeReturn{
    uint value;

    function getValue() view public returns (uint8) {
        return uint8(-1);
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
