pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2d_ReverseFunctionOrder{
    uint value;

    function setValue(uint _value) public {
        value = _value;
    }

    function getValue() view public returns (uint) {
        return value;
    }
}
