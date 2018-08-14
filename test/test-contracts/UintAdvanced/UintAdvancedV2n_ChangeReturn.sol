pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

contract UintAdvancedV2n_ChangeReturn{
    uint value;

    function getValue() view public returns (address) {
        return 0xffBf5CE297a5456A2f8FEc4f5961dD0D898b29a7;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
