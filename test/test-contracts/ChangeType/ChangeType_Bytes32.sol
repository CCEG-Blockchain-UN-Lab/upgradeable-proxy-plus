pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract ChangeType_Bytes32 is UpgradeablePlus {
    bytes32 value;

    function getValue() view public returns (bytes32) {
        return value;
    }

    function setValue(bytes32 _value) public {
        value = _value;
    }
}
