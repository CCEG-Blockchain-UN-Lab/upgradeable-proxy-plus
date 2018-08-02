pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintFallbackV4 is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function () payable public {
        value = msg.value;
    }
}
