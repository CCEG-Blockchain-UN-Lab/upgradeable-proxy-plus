pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2p_ChangeReturn{
    uint value;

    function getValue() view public returns (bool) {
        return true;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
