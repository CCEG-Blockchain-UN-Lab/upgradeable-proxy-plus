pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract BoolSimpleV1Safe is UpgradeablePlus {
    bool value;

    function getValue() view public returns (bool) {
        return value;
    }

    function setValue(bool _value) public {
        value = _value;
    }
}
