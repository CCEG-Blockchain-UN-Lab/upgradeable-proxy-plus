pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintInitializeV1b_InitializedSafe is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function initialize() initializeOnceOnly public {
        value = 111;
    }
}
