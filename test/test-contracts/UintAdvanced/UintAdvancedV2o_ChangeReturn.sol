pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2o_ChangeReturn{
    uint value;

    function getValue() view public returns (string) {
        return 'I am a happy string';
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
