pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintFallbackV3 is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function () public {
        revert();
    }
}
