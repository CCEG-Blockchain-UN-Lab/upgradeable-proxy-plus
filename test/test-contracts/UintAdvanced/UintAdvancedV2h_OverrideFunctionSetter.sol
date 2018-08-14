pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2h_OverrideFunctionSetter{
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue(uint _value) public {
        value = _value+2;
    }
}
