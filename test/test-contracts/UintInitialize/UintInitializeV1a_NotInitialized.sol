pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintInitializeV1a_NotInitialized is UpgradeablePlus {
    uint value = 111;

    function getValue() view public returns (uint) {
        return value;
    }
}
