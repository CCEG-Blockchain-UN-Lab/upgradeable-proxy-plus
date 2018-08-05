pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintAdvancedV2l_ChangeKeywordSafe is UpgradeablePlus {
    uint value;

    function getValue() pure public returns (uint) {
        return 666;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
