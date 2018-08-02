pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintAdvancedV2o_ChangeReturn is UpgradeablePlus {
    uint value;

    function getValue() view public returns (string) {
        return 'I am a happy string';
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
