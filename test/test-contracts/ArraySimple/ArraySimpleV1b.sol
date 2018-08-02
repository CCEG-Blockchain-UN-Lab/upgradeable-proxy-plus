pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract ArraySimpleV1b is UpgradeablePlus {
    uint[] values;
    uint anotherValue;

    function getValues() view public returns (uint[]) {
        return values;
    }

    function setValues(uint[] _values) public {
        values = _values;
    }
}
