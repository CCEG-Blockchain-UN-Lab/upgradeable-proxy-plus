pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintEther_Normal is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue() payable public {
        value = 10;
    }
}

contract UintEther_Payable is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue() payable public {
        value = msg.value;
    }
}

contract UintEther_NotPayable is UpgradeablePlus {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue() public {
        value = msg.value;
    }
}
