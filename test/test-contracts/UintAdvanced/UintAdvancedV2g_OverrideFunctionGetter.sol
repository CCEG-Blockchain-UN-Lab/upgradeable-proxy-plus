pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2g_OverrideFunctionGetter{
    uint value;

    function getValue() view public returns (uint) {
        return value+2;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
