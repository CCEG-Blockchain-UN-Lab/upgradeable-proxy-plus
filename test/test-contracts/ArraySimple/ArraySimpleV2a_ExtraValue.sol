pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract ArraySimpleV2a_ExtraValue is UpgradeablePlus {
    uint[4] values;
    uint anotherValue;

    function getValues() view public returns (uint[4]) {
        return values;
    }

    function setValues(uint[4] _values) public {
        values = _values;
    }
}
