pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintAdvancedV2p_ChangeReturnSafe is UpgradeablePlus {
    uint value;

    function getValue() view public returns (bool) {
        return true;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
