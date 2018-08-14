pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV1{
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
