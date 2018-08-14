pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2l_ChangeKeyword{
    uint value;

    function getValue() pure public returns (uint) {
        return 666;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
